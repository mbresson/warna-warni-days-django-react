from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from .models import Day
from .permissions import IsOwner
from .serializers import DaySerializer

UserModel = get_user_model()


class DayViewSet(viewsets.ModelViewSet):
    serializer_class = DaySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

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
        username = self.kwargs['username']
        return Day.objects.filter(user__username=username)
