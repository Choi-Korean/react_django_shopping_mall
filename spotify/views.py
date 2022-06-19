from cmath import exp
from urllib import response
from django.shortcuts import redirect, render
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Item

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
    print(expires_in)

    if not request.session.exists(request.session.session_key):
        request.session.create()
    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    return redirect('frontend:')    # 폴더명 + : + 페이지(js) 파일명. 해당 폴더명 urls에 들어가서 app_name = frontend로 설정해줘야 찾을 수 있음 장고가. 와 편하네


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request, format=None):
        item_code = self.request.session.get('item_code')
        item = Item.objects.filter(code=item_code)
        if item.exists():
            item = item[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        writer = item.writer
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(writer, endpoint)    # get요청 보낼거니까 put, post parms는 false로 냅두기
        
        if 'error' in response or 'item' not in response:   # 여기서 item은 song 목록
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        # API response에서 필요한 정보만 담기
        item_song = response.get('item')
        duration = item_song.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item_song.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item_song.get('id')

        artist_string = ""
        
        # artist 명만 다 담기
        for i, artist in enumerate(item_song.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        
        song = {
            'title' : item_song.get('name'),
            'artist' : artist_string,
            'duration': duration,
            'time' : progress,
            'image_url': album_cover,
            'is_playing' : is_playing,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)

class PauseSong(APIView):
    def put(self, response, format=None):
        item_code = self.request.session.get('item_code')
        item = Item.objects.filter(code=item_code)[0]
        if self.request.session.session_key == item.writer:
            pause_song(item.writer)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, response, format=None):
        item_code = self.request.session.get('item_code')
        item = Item.objects.filter(code=item_code)[0]
        if self.request.session.session_key == item.writer:
            play_song(item.writer)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)