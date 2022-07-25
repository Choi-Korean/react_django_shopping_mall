from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from users.serializers import UserCreateSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model

# Create your views here.

User = get_user_model()

class Signup(APIView):
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = UserCreateSerializer(data=request.data) 
        if serializer.is_valid(raise_exception=True):
            user = User.objects.create(
                username=serializer.data['username'],
            )
            user.set_password(serializer.data['password'])
            user.save()
            return Response(serializer.data, status=201)