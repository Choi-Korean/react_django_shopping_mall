from django.urls import path
from .views import ItemView, CreateItemView, GetItem

urlpatterns = [
    path('', ItemView.as_view()),
    path('create-item/', CreateItemView.as_view()),
    path('get-item', GetItem.as_view())
]
