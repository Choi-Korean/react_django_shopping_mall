from django.urls import path
from .views import *

urlpatterns = [
    path('', ItemView.as_view()),
    path('create-item/', CreateItemView.as_view()),
    path('get-item/', GetItem.as_view()),
    path('buy-item/', BuyItem.as_view()),
    path('user-in-item/', UserInItem.as_view()),
    path('leave-item/', LeaveItem.as_view()),
    path('update-item/', UpdateItem.as_view()),
    path('item-list/', ItemList.as_view()),
]
