from django.shortcuts import render
from rest_framework import generics, status
from .models import Item
from .serializers import ItemSerializer, CreateItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class ItemView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class CreateItemView(APIView):
    serializer_class = CreateItemSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        # 유튜브에서는 host에 session을 줬는데 .. 왜그렇게 하지? 로그인 없이 하려 그러나. 어쨌든 session 부분은
        # 좀 변경했고(뺀거나 다름없으), 다음에 다시 생각해보자. #5강의
        serializer = self.serializer_class(data=request.data) # data 유효한지 확인
        if serializer.is_valid():
            session = self.request.session.session_key
            writer = serializer.data.get('writer')
            image = serializer.data.get('image')
            listing_or_not = serializer.data.get('listing_or_not')
            queryset = Item.objects.filter(writer=writer)
            if queryset.exists():
                item = queryset[0]
                item.writer = writer
                item.image = image
                item.listing_or_not = listing_or_not
                item.save(update_fields=['writer', 'image', 'listing_or_not'])
            else:
                item = Item(writer=writer, image=image, listing_or_not=listing_or_not)
                item.save()
            
            return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)