from django.urls import path
from .views import AuthURL


urlpatterns = [ # 어떤 url이든 index로 보내서 index에서 처리하게
    path('get-auth-url', AuthURL.as_view()),
]