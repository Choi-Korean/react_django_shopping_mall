from dataclasses import field
from rest_framework import serializers
from .models import Cart, Item
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    def create(self, validated_data):
        user = User.objects.create( # User 생성
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user