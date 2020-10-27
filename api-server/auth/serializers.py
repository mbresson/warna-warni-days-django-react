from django.contrib.auth import get_user_model
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import permissions, serializers, validators
from .models import UserProfile

UserModel = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        with transaction.atomic():
            created_user = UserModel.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
            )

            UserProfile.objects.create(
                user=created_user,
                preferred_first_weekday=UserProfile.FirstWeekday.SUNDAY,
            )

        return created_user

    def validate_email(self, value):
        email = BaseUserManager.normalize_email(value)

        if UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with that email already exists.")

        return email

    def validate_password(self, value):
        validate_password(value)

        return value

    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    preferred_first_weekday = serializers.ChoiceField(
        choices=UserProfile.FirstWeekday.choices,
        source='userprofile.preferred_first_weekday',
    )

    def validate_email(self, value):
        email = BaseUserManager.normalize_email(value)

        if UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with that email already exists.")

        return email

    def validate_password(self, value):
        validate_password(value)

        return value

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(
                validated_data['password'])

        with transaction.atomic():
            preferred_first_weekday = validated_data.pop(
                'userprofile', {}).get('preferred_first_weekday')

            if preferred_first_weekday is not None:
                profile_object = UserProfile.objects.get(user=instance)
                profile_object.preferred_first_weekday = preferred_first_weekday
                profile_object.save()

            return super().update(instance, validated_data)

    class Meta:
        model = UserModel
        fields = ('password', 'username', 'email', 'date_joined',
                  'preferred_first_weekday')

        read_only_fields = ('username', 'date_joined')
