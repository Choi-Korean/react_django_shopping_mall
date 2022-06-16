from cmath import exp
from django.shortcuts import redirect, render
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated

# Create your views here.

# front -> AuthURL -> return url to front ? 맞나? -> authorizing -> spotify_callback -> back to original app with token

class AuthURL(APIView):
    def get(self, request, format=None):
        # 접속/사용 원하는 서비스. spotify docs에 정해진 내용인듯
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        # url 만들기 위한 설정값
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope':scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        
        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()
    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    return redirect('frontend:')    # 폴더명 + : + 페이지(js) 파일명. 해당 폴더명 urls에 들어가서 app_name = frontend로 설정해줘야 찾을 수 있음 장고가. 와 편하네


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)