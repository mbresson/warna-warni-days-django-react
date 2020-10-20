from django.contrib.auth import get_user_model
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from .filters import DayFilter
from .models import Day
from .permissions import IsOwner
from .serializers import DaySerializer

UserModel = get_user_model()


class DayViewSet(viewsets.ModelViewSet):
    serializer_class = DaySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = DayFilter
    ordering_fields = ['date']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()

        user = UserModel.objects.get(username=self.kwargs['username'])

        context.update({
            'user': user
        })

        return context

    def get_queryset(self):
        return Day.objects.filter(user=self.request.user)
