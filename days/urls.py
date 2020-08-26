from django.urls import include, path
from rest_framework import routers
from .views import DayViewSet

api_router = routers.DefaultRouter()
api_router.register('', DayViewSet, basename='day')

urlpatterns = [
    path('users/<str:username>/days/', include(api_router.urls)),
]
