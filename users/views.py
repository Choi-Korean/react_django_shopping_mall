from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from users.serializers import UserCreateSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth import login as auth_login

# Create your views here.

User = get_user_model()

class Signup(APIView):
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = UserCreateSerializer(data=request.data) 
        if serializer.is_valid(raise_exception=True):
            serializer.clean_email()
            print(serializer)
            user = User.objects.create(username=serializer.data['username'],
                email=serializer.data['email'],
                name=serializer.data['name'],
                gender=serializer.data['gender'],
                profile_img=request.data.get('profile_img'))
            print(request.data.get('profile_img'))
            user.set_password(serializer.data['password'])
            user.save()
            auth_login(request, user)
            return Response(serializer.data, status=201)