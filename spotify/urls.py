from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated


urlpatterns = [ # 어떤 url이든 index로 보내서 index에서 처리하게
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
]