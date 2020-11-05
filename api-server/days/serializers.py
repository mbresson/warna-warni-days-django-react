from .models import Day
from rest_framework import serializers


class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = ['color', 'date', 'id', 'notes']
