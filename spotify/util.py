# 공통으로 쓸 함수들 모아놓는 곳

from datetime import timedelta
from email import header
from secrets import token_urlsafe
from urllib import response
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

# token 저장용 함수

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in) # 3600초 지나면 만료되게 설정할것임

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
        print(tokens.refresh_token)
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


# 토큰 확인해서 만료함수, 재부여 함수
# is_spotify_auth -> refresh -> get_user_tokens -> refresh -> update_or_create -> 토큰 업데이트 완료 -> is_spotify_auth(true). << false면 진작 짤렸고

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens.refresh_token is not None:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

# endpoint : request 보낼 곳
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False): #  오 내가 생각했더 ㄴ거네. 이렇게 put, post 뭐로 할지 보내게 한다음에 한번에 분기처리
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token} # Spotify 규정. 거기 doc 보기 이 구조 어떻게 쓰일지 보려면

    # post, put은 response 상관 안할거니, get으로 받아야겠지
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'ERROR': 'Issue with request'}

def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)