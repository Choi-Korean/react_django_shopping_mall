from django.urls import path
from .views import *

urlpatterns = [
    path('market-list/', GetMarketList.as_view()),
]
