from django.contrib.auth import authenticate, login, logout
from rest_framework import exceptions, permissions, response, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .serializers import SignUpSerializer, ProfileSerializer


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
