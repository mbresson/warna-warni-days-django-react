from django.conf import settings
from django.db import models
from core.utils import validate_color


class Day(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,

        # we'll retrieve days by user and date,
        # which are already indexed through the UniqueConstraint,
        # so we can remove the index on user
        db_index=False,
    )

    date = models.DateField()

    color = models.CharField(
        max_length=7,
        validators=[validate_color],
        db_index=True
    )

    notes = models.TextField(
        blank=True,
        max_length=10000,
    )

    class Meta:
        db_table = 'day'

        constraints = [
            models.UniqueConstraint(
                fields=['user', 'date'], name='unique_user_day')
        ]
