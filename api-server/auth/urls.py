from django.urls import include, path
from .views import (
    AccountView,
    ResetPasswordView,
    SessionLoginView,
    SessionLogoutView,
    SignUpView,
)

urlpatterns = [
    path('login/', SessionLoginView.as_view(), name='auth-login'),
    path('logout/', SessionLogoutView.as_view(), name='auth-logout'),
    path('signup/', SignUpView.as_view(), name='auth-signup'),
    path('account/', AccountView.as_view(), name='auth-account'),
    path('reset-password/', ResetPasswordView.as_view(),
         name='auth-reset-password'),
]
