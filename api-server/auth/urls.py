from django.urls import include, path
from .views import (
    ProfileView,
    SessionLoginView,
    SessionLogoutView,
    SignUpView
)

urlpatterns = [
    path('login/', SessionLoginView.as_view()),
    path('logout/', SessionLogoutView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('profile/', ProfileView.as_view())
]
