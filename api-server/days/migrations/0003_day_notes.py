# Generated by Django 3.1 on 2020-10-16 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('days', '0002_day_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='day',
            name='notes',
            field=models.TextField(blank=True, max_length=10000),
        ),
    ]
