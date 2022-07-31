from dataclasses import field
from operator import mod
from attr import fields
from rest_framework import serializers
from .models import Market
from rest_framework.parsers import MultiPartParser, FormParser

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = ('__all__')