from django.contrib.auth import authenticate, login, logout, get_user_model, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import exceptions, permissions, response, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .messages import send_password_reset_message
from .serializers import SignUpSerializer, ProfileSerializer

UserModel = get_user_model()


class SessionLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)
        if user is None:
            raise exceptions.AuthenticationFailed()

        login(request, user)

        return response.Response(status=status.HTTP_200_OK)


class SessionLogoutView(APIView):
    def post(self, request, format=None):
        logout(request)

        return response.Response(status=status.HTTP_200_OK)


class SignUpView(CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        new_user = authenticate(
            username=request.data['username'],
            password=request.data['password'],
        )

        login(request, new_user)

        return response.Response(status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    """
    Client-side javascript code cannot access the session cookie since it is HttpOnly for security purposes.
    Hence, we must provide an API for the frontend to know whether it is authenticated or not
    and return the profile of the current user.
    """

    def get(self, request, format=None):
        """
        Since all views are by default restricted to logged-in users,
        this view will automatically return 403 if the user is not authenticated.
        """
        serializer = ProfileSerializer(request.user)
        return response.Response(serializer.data)


class ChangePasswordView(APIView):
    def post(self, request, format=None):
        user = request.user

        current_password = request.data['current_password']
        new_password = request.data['new_password']

        if not user.check_password(current_password):
            return response.Response(
                data={
                    'current_password': ['Incorrect password'],
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new_password, user)
        except ValidationError as errors:
            return response.Response(
                data={
                    'new_password': errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return response.Response(status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """
    This view will require the user's username and email address,
    and, if correct, will change the user password to a random one and notify the user by email.

    To prevent against attacks such as user enumeration, this view will always return 200,
    even if no user matches the provided email address and username combination.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        account_username = request.data['username']
        account_email = UserModel.objects.normalize_email(
            request.data['email'],
        )

        try:
            account = UserModel.objects.get(
                username=account_username,
                email=account_email
            )
        except UserModel.DoesNotExist:
            return response.Response(status=status.HTTP_200_OK)

        new_password = UserModel.objects.make_random_password(length=20)

        send_password_reset_message(
            account_username, account_email, new_password)

        # change the password after notifying the user,
        # so that the password is not changed if sending the message fails
        account.set_password(new_password)
        account.save()

        return response.Response(status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    def post(self, request, format=None):
        user = request.user

        current_password = request.data['current_password']

        if not user.check_password(current_password):
            return response.Response(
                data={
                    'current_password': ['Incorrect password'],
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return response.Response(status=status.HTTP_200_OK)
