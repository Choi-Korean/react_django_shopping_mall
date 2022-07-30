from django.shortcuts import redirect, render
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm  # 장고에서 제공하는 기본 회원가입과 로그인 폼
from users.models import User
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from accounts.serializers import LoginSerializers, Tokenserializers
from django.contrib.auth import login as auth_login

# Create your views here.

class LoginView(APIView):   # 위 함수형이 안되어서 우선 class 기반으로 다시 작성해봄. 이건 정상 작동
    permission_classes = [AllowAny]
    def post(self, request):
        print(request.user)
        print(request.META)
        try:
            user = authenticate(username=request.data['username'], password=request.data['password'])
            auth_login(request, user)   # 이걸 해야 request에 user로 저장시켜줌
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'username': request.data['username'], 'token': token.key}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # if user:
        #     token, _ = Token.objects.get_or_create(user=user)
        #     return Response({'token': token.key})
        # else:
        #     return Response(status=401)

class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        # try:
        #     user = User.objects.filter(id=Token.objects.filter(key=request.data['token'])[0].user_id)[0]
        # except:
        #     return Response(status=401)
        if request.user.is_authenticated:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=401)




# class signup(APIView):
#     def post(self, request, format=None):
#         data = SignUp(request.POST)
#         if data.is_valid(): 
#             instance = data.save()
#             Response(data, status=status.HTTP_200_OK)
#         else:   
#             print("ERROR")
#             Response({'Failed': 'Invalid data'}, status=status.HTTP_404_NOT_FOUND)

# def login_view(request):
#     def post(self, request, format=None):
#         # 로그인 실행
#         # 데이터 유효성 검사
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         if username == '' or username == None:
#             pass
#         user = User.objects.get(username=username)
#         if user == None:
#             pass
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             login(request, form.user_cache)
#             return redirect('index')

#         else:
#             return render(request, 'accounts/login.html', {'form': form})


# def logout_view(request):
#     if request.user.is_authenticated:
#         logout(request)
#     return redirect('index')
