import datetime
from http import server
from logging import root
from os import stat
import queue
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from .models import Cart, Item
from .serializers import CartSerializer, ItemSerializer, CreateItemSerializer, updateItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

def convertDate(serializer):
    # 날짜 변환 코드
    format = '%Y-%m-%dT%H:%M:%S.%fZ'
    format_to = "%Y-%m-%d %H시%M분"
    try:
        for i in serializer.data:
            i['created_at'] = datetime.datetime.strftime(datetime.datetime.strptime(i['created_at'], format), format_to)
        return serializer
    except:
        return datetime.datetime.strftime(datetime.datetime.strptime(serializer['created_at'], format), format_to)

class ItemView(generics.CreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class GetItem(APIView):
    serializer_class = ItemSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            item = Item.objects.filter(code=code)   # 내가 id인 부분이 강의에서는 전부 랜덤생성한 code(session 느낌)임
            if len(item) > 0:
                data = ItemSerializer(item[0]).data
                # 이건 강의에서 현재 session이 host의 session과 일치하는지 확인하고, 일치하면 현재 session을 담는거고, 아니면 걍 냅두는?
                # 처음 보는 코드라 남겨봄
                data['is_writer'] = self.request.session.session_key == item[0].writer
                data['created_at'] = convertDate(data)
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Item Not Found': 'Invalid Item code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'URL Not Found' : 'Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class BuyItem(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, foramt=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()
        
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            item_result = Item.objects.filter(code=code)
            if len(item_result) > 0:
                item = item_result[0]
                self.request.session['item_code'] = code # code로 세션 부여
                return Response({'message':'Item Bought!'}, status=status.HTTP_200_OK)
            # code 일치하는 거 없으면 Bad request
            return Response({'message':'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        # 보낸 code 없으면 bad request
        return Response({'Bad Request':'Invalid post data, did not find a code'}, status=status.HTTP_400_BAD_REQUEST)

class CreateItemView(APIView):
    serializer_class = CreateItemSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        # 유튜브에서는 host에 session을 줬는데 .. 왜그렇게 하지? 로그인 없이 하려 그러나. 어쨌든 session 부분은
        # 좀 변경했고(뺀거나 다름없으), 다음에 다시 생각해보자. #5강의
        # 아 윹튜브는 따로 로그인 없이 session으로 회원의 행동 관리할라고 이렇게 한거네. 채팅방일때는 무명일 경우는 이렇게 해주는 거 괜찮곘네
        serializer = self.serializer_class(data=request.data) # data 유효한지 확인
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid():
            writer = self.request.session.session_key
            # image = serializer.data.get('image')
            # image = request.FILES.get('image') #serializer.data.get('image')
            print(request.data)
            image = request.data.get('image')
            print("이미지")
            print(image)
            listing_or_not = serializer.data.get('listing_or_not')
            like_count = serializer.data.get('like_count')
            queryset = Item.objects.filter(writer=writer)
            if queryset.exists():
                item = queryset[0]
                item.image = image
                item.listing_or_not = listing_or_not
                item.like_count = like_count
                item.save(update_fields=['image', 'listing_or_not', 'like_count'])
                self.request.session['item_code'] = item.code
                return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)
            else:
                item = Item(writer=writer, image=image, listing_or_not=listing_or_not, like_count=like_count)
                item.save()
                self.request.session['item_code'] = item.code
                return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)
        print("아아아아아ㅏ")
        print(self.serializer_class(data=request.data))
        return Response({'Bad Request' : 'Invalid Data..'}, status=status.HTTP_400_BAD_REQUEST)

class UserInItem(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()

        data = {
            'code': self.request.session.get('item_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveItem(APIView):
    def post(self, request, format=None):
        if 'item_code' in self.request.session:
            self.request.session.pop('item_code')
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
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid():
            image = request.data.get('image')
            listing_or_not = serializer.data.get('listing_or_not')
            like_count = serializer.data.get('like_count')
            code = serializer.data.get('code')
            queryset = Item.objects.filter(code=code)

            if not queryset.exists():
                print("업데이트에선 여기 에러")
                return Response({'msg': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

            item = queryset[0]

            # 여기서 사용자 id와 세션 id 다르면 에러처리 해줘야 하는데, 내가 session 부여 쪽을 의도대로 안해놔서.. 이건 빼야 할듯 우선
            user_id = self.request.session.session_key
            if item.writer != user_id:
                return Response({'msg': 'You are not the writer of this item.'}, status=status.HTTP_403_FORBIDDEN)
            
            item.image = image
            item.listing_or_not = listing_or_not
            item.like_count = like_count
            item.save(update_fields=['image', 'listing_or_not', 'like_count'])
            return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


    def get(self, request, format=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = ItemSerializer(queryset, many=True)

        # 날짜 변환 코드
        serializer = convertDate(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response(serializer.data)

    #     if len(item) > 0:
    #         data = ItemSerializer(item[0]).data
    #         # 이건 강의에서 현재 session이 host의 session과 일치하는지 확인하고, 일치하면 현재 session을 담는거고, 아니면 걍 냅두는?
    #         # 처음 보는 코드라 남겨봄
    #         data['is_writer'] = self.request.session.session_key == item[0].writer
    #         return Response(data, status=status.HTTP_200_OK)
    #     return Response({'Item Not Found': 'Invalid Item code'}, status=status.HTTP_404_NOT_FOUND)
    # return Response({'URL Not Found' : 'Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class GetCart(APIView):
    serializer_class = CartSerializer
    lookup_url_kwarg = 'writer'
    def get(self, request, format=None):
        writer = request.GET.get(self.lookup_url_kwarg)
        cart = Cart.objects.filter(writer=writer)
        if len(cart) > 0:
            serializer = CartSerializer(cart, many=True)
            print(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Cart Not Found'}, status=status.HTTP_404_NOT_FOUND)

# 아 delete method는 뭐 request로 데이터 전송이 안되는데? update, delete  둘다 post로 해야 할 듯.
class UpdateCart(APIView):
    serializer_class = CartSerializer
    lookup_url_kwarg = 'writer'

    def delete(self, request, **kwargs):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid():
            writer = self.request.session.session_key
            item = serializer.data.get('item')
            print(writer)
            cart = Cart(writer=writer, item=item)
            cart.save()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        print(self.serializer_class(data=request.data))
        return Response({'Bad Request' : 'Invalid Data..'}, status=status.HTTP_400_BAD_REQUEST)
        # if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
        #     self.request.session.create()
        # serializer = self.serializer_class(data=request.data)
        # print(serializer)
        # if not serializer.is_valid():
        #     print(serializer.errors)
        # if serializer.is_valid():
        #     print(serializer)
        #     writer = self.request.session.session_key
        #     item = serializer.data.get('item')
        #     print(writer)
        #     print(item)
        #     item_code = self.request.session.get('item_code')
        #     item = Item.objects.filter(code=item_code)[0]

        #     writer = request.GET.get(self.lookup_url_kwarg)
        #     cart = Cart.objects.filter(writer=writer, item=item)
        #     print(item_code)
        #     # serializer = self.serializer_class(data=request.data)
        #     print(writer)
        #     # print(serializer.is_valid())
        #     print(item)
        #     print(cart)
        #     if cart.exists():
        #         cart.delete()
        #         return Response(status=status.HTTP_204_NO_CONTENT)
        #     else:
        #         return Response({'Cart Not Found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):   # session 부여하기
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid():
            writer = self.request.session.session_key
            item = serializer.data.get('item')
            cart = Cart(writer=writer, item=item)
            cart.save()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        print(self.serializer_class(data=request.data))
        return Response({'Bad Request' : 'Invalid Data..'}, status=status.HTTP_400_BAD_REQUEST)