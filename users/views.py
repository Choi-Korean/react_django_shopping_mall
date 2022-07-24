from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from users.serializers import UserCreateSerializer
from rest_framework.response import Response

# Create your views here.

class Signup(APIView):
    permission_classes = AllowAny
    def post(self, request, format=None):
        serializer = UserCreateSerializer(data=request.data) 
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201) 