from logging import root
from os import stat
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from .models import Item
from .serializers import ItemSerializer, CreateItemSerializer, updateItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class ItemView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class GetItem(APIView):
    serializer_class = ItemSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            item = Item.objects.filter(id=id)   # 내가 id인 부분이 강의에서는 전부 랜덤생성한 code(session 느낌)임
            if len(item) > 0:
                data = ItemSerializer(item[0]).data
                # 이건 강의에서 현재 session이 host의 session과 일치하는지 확인하고, 일치하면 현재 session을 담는거고, 아니면 걍 냅두는?
                # 처음 보는 코드라 남겨봄
                # data['is_host'] = self.request.session.session_key == item[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Item Not Found': 'Invalid Item Id'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'URL Not Found' : 'Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class BuyItem(APIView):
    lookup_url_kwarg = 'id'

    def post(self, request, foramt=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()
        
        id = request.data.get('id')
        if id != None:
            item_result = Item.objects.filter(id=id)
            if len(item_result) > 0:
                item = item_result[0]
                self.request.session['id'] = id # id로 세션 부여
                return Response({'message':'Item Bought!'}, status=status.HTTP_200_OK)
            # Id 일치하는 거 없으면 Bad request
            return Response({'message':'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)
        # 보낸 id 없으면 bad request
        return Response({'Bad Request':'Invalid post data, did not find a id'}, status=status.HTTP_400_BAD_REQUEST)

class CreateItemView(APIView):
    serializer_class = CreateItemSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        # 유튜브에서는 host에 session을 줬는데 .. 왜그렇게 하지? 로그인 없이 하려 그러나. 어쨌든 session 부분은
        # 좀 변경했고(뺀거나 다름없으), 다음에 다시 생각해보자. #5강의
        # 아 윹튜브는 따로 로그인 없이 session으로 회원의 행동 관리할라고 이렇게 한거네. 채팅방일때는 무명일 경우는 이렇게 해주는 거 괜찮곘네
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
                self.request.session['id'] = item.id
                return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)
            else:
                item = Item(writer=writer, image=image, listing_or_not=listing_or_not)
                item.save()
                self.request.session['id'] = item.id
                return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)
            
        return Response({'Bad Request' : 'Invalid Data..'}, status=status.HTTP_400_BAD_REQUEST)

class UserInItem(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        data = {
            'id': self.request.session.get('id')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveItem(APIView):
    def post(self, request, format=None):
        if 'id' in self.request.session:
            self.request.session.pop('id')
            writer_id = self.request.session.session_key
            item_results = Item.objects.filter(writer=writer_id)
            if len(item_results) > 0:   # 이건 노래방 웹앱만들기였는데, 방에 아무도 없으면 방 삭제하는 코드용이었음
                item = item_results[0]
                item.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateItem(APIView):
    serializer_class = updateItemSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            image = serializer.data.get('data')
            listing_or_not = serializer.data.get('listing_or_not')
            id = serializer.data.get('id')
            queryset = Item.objects.filter(id=id)

            if not queryset.exists():
                return Response({'msg': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

            item = queryset[0]
            user_id = self.request.session.session_key
            if item.id != user_id:
                return Response({'msg': 'You are not the writer of this item.'}, status=status.HTTP_403_FORBIDDEN)
            
            item.image = image
            item.listing_or_not = listing_or_not
            item.save(update_fields=['image', 'listing_or_not'])
            return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid Data...'}, stats=status.HTTP_400_BAD_REQUEST)