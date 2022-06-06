from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'writer', 'image',
                'listing_or_not', 'like_count', 'created_at')