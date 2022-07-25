from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

# class UserCreateSerializer(serializers.Serializer):
#     username = serializers.CharField(required=True)
#     password = serializers.CharField(required=True)
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
    # def create(self, validated_data):
    #     user = User.objects.create( # User 생성
    #         username=validated_data['username'],
    #     )
    #     user.set_password(validated_data['password'])
    #     user.save()
        
    #     return user