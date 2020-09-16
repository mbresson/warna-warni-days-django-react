from django.contrib.auth import get_user_model
from django.contrib.auth.models import BaseUserManager
from rest_framework import permissions, serializers, validators

UserModel = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = UserModel.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

    def validate_email(self, value):
        email = BaseUserManager.normalize_email(value)

        if UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with that email already exists")

        return email

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'email', 'password')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('username', 'email')
