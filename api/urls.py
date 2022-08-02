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
    path('cart/', GetCart.as_view()),
    path('create-cart/', CreateCart.as_view()),
    path('delete-cart/', DeleteCart.as_view()),
    path('cart-list/', GetCartList.as_view()),
    path('cartegory-list/', GetCategoriesList.as_view()),
    path('get-cartegory/', GetCategory.as_view()),
]
