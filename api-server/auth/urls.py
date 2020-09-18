from django.urls import include, path
from .views import (
    ProfileView,
    SessionLoginView,
    SessionLogoutView,
    SignUpView
)

urlpatterns = [
    path('login/', SessionLoginView.as_view(), name='auth-login'),
    path('logout/', SessionLogoutView.as_view(), name='auth-logout'),
    path('signup/', SignUpView.as_view(), name='auth-signup'),
    path('profile/', ProfileView.as_view(), name='auth-profile')
]
