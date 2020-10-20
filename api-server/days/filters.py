from django_filters import filters, filterset
from .models import Day


class DayFilter(filterset.FilterSet):
    date = filters.DateFromToRangeFilter()

    class Meta:
        model = Day
        fields = ['date']
