from rest_framework import viewsets
from rest_framework import permissions
from .models import Day
from .permissions import IsOwner
from .serializers import DaySerializer


class DayViewSet(viewsets.ModelViewSet):
    serializer_class = DaySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        username = self.kwargs['username']
        return Day.objects.filter(user__username=username)
