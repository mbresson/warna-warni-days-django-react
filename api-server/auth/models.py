from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
    )

    class FirstWeekday(models.TextChoices):
        MONDAY = 'M'
        SUNDAY = 'S'

    preferred_first_weekday = models.CharField(
        max_length=1,
        choices=FirstWeekday.choices,
        default=FirstWeekday.SUNDAY,
    )
