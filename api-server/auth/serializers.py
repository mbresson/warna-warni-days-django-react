from django.contrib.auth import get_user_model
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.password_validation import validate_password
from rest_framework import permissions, serializers, validators

UserModel = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        return UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
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

    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('username', 'email')
