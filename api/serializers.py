from dataclasses import field
from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'writer', 'image',
                'listing_or_not', 'like_count', 'created_at')

class CreateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'writer', 'image', 'listing_or_not')

class updateItemSerializer(serializers.ModelSerializer):
    
    # id는 유니크해야 하는데 뭐시기랬는데. 이거 만드는 이유 #11강 보기 https://www.youtube.com/watch?v=JOpmlhAZsPI
    id = serializers.CharField(validators=[])
    class Meta:
        model = Item
        fields = ('id', 'writer', 'image', 'listing_or_not')