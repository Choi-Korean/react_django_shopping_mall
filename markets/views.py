from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import AllowAny

from markets.models import Market
from markets.serializers import MarketSerializer
from rest_framework import generics, status

from users.models import User

# Create your views here.


class GetMarketList(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        user = User.objects.filter(username=request.user)[0]
        market = Market.objects.filter(master_id=user.id)
        serializer = MarketSerializer(market, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetMarket(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        market = Market.objects.filter(id=request.data.get('market_id'))
        serializer = MarketSerializer(market)
        return Response(serializer.data, status=status.HTTP_200_OK)