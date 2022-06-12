from django.urls import path
from .views import ItemView, CreateItemView, GetItem, BuyItem

urlpatterns = [
    path('', ItemView.as_view()),
    path('create-item/', CreateItemView.as_view()),
    path('get-item/', GetItem.as_view()),
    path('buy-item/', BuyItem.as_view())
]
