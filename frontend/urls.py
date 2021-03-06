from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [ # 어떤 url이든 index로 보내서 index에서 처리하게
    path('', index, name=''),
    path('info', index),
    path('buy', index),
    path('create', index),
    path('item/<str:id>', index),
    path('cart', index),
    path('signup', index),
    path('login', index),
    path('logout', index),
]