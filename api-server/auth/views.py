from django.contrib.auth import authenticate, forms, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework import exceptions, permissions, response, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .serializers import SignUpSerializer, ProfileSerializer


class SessionLoginView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @csrf_exempt
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
    model = get_user_model()
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer


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
