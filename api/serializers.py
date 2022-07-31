from dataclasses import field
from operator import mod
from attr import fields
from rest_framework import serializers
from .models import Cart, Item, ProductCategory
from rest_framework.parsers import MultiPartParser, FormParser

class ItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Item
        fields = ('__all__')
        # fields = ('id', 'code', 'writer', 'image',
        #         'listing_or_not', 'like_count', 'created_at')
        parser_classes = (MultiPartParser, FormParser)

class CreateItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Item
        fields = ('name', 'display_name', 'price', 'sale_price', 'image', 'category', 'market')
        # fields = ('id', 'code', 'writer', 'image',
        #         'listing_or_not', 'like_count', 'created_at')
        parser_classes = (MultiPartParser, FormParser)

class updateItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    # id는 유니크해야 하는데 뭐시기랬는데. 이거 만드는 이유 #11강 보기 https://www.youtube.com/watch?v=JOpmlhAZsPI
    code = serializers.CharField(validators=[])
    class Meta:
        model = Item
        fields = ('name', 'display_name', 'price', 'sale_price', 'image', 'category', 'market')
        parser_classes = (MultiPartParser, FormParser)


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('writer', 'item')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ('__all__')