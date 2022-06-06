from django.shortcuts import render
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer

class ItemView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer