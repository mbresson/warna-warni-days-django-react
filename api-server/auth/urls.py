from django.urls import include, path
from .views import (
    ProfileView,
    ChangePasswordView,
    DeleteAccountView,
    ResetPasswordView,
    SessionLoginView,
    SessionLogoutView,
    SignUpView,
)

urlpatterns = [
    path('login/', SessionLoginView.as_view(), name='auth-login'),
    path('logout/', SessionLogoutView.as_view(), name='auth-logout'),
    path('signup/', SignUpView.as_view(), name='auth-signup'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
    path('change-password/', ChangePasswordView.as_view(),
         name='auth-change-password'),
    path('reset-password/', ResetPasswordView.as_view(),
         name='auth-reset-password'),
    path('delete-account/', DeleteAccountView.as_view(),
         name='auth-delete-account'),
]
