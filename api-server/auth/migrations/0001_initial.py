# Generated by Django 3.1 on 2020-10-20 14:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('preferred_first_weekday', models.CharField(choices=[('M', 'Monday'), ('S', 'Sunday')], default='S', max_length=1)),
            ],
        ),
    ]