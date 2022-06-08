from django.urls import path
from .views import ItemView, CreateItemView

urlpatterns = [
    path('', ItemView.as_view()),
    path('create-item/', CreateItemView.as_view()),
]
