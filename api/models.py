import os
from django.db import models
import string
import random
from qna.models import Question
from shop_controller.settings import BASE_DIR
from users.models import User
from markets.models import Market
from django.contrib.contenttypes.fields import GenericRelation

# Create your models here.

# def generate_unique_code():
#     length = 5
#     while True:
#         code = ''.join(random.choices(string.ascii_uppercase, k=length))
#         if Item.objects.filter(code=code).count() == 0:
#             break
#     return code

class ProductCategory(models.Model):
    name = models.CharField('이름', max_length=50)

def upload_to(instance, filename):
    print(BASE_DIR)
    return  'D:/react_django_tutorial/shop_controller/static/images/{filename}'.format(filename=filename)

class Item(models.Model):
    name = models.CharField('상품명(내부용)', max_length=100)
    display_name = models.CharField('상품명(노출용)', max_length=100)
    price = models.PositiveIntegerField('권장판매가')
    sale_price = models.PositiveIntegerField('실제판매가')
    # code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    # writer = models.CharField(User, max_length=50, null=True)
    image = models.ImageField(verbose_name='image', null=True, blank=True, upload_to=upload_to )
    # listing_or_not = models.BooleanField(null=False, default=False) # 장바구니 표현하려 했으나, boolean이면 안될 거 같아서 판매가능여부로 치자
    like_count = models.IntegerField(null=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField('삭제여부', default=False)
    delete_date = models.DateTimeField('삭제날짜', null=True, blank=True)

    # current_song = models.CharField(max_length=50, null=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.DO_NOTHING)
    market = models.ForeignKey(Market, on_delete=models.DO_NOTHING)
    
    is_hidden = models.BooleanField('노출여부', default=False)
    is_sold_out = models.BooleanField('품절여부', default=False)
    
    hit_count = models.PositiveIntegerField('조회수', default=0)
    review_count = models.PositiveIntegerField('리뷰수', default=0)
    review_point = models.PositiveIntegerField('리뷰평점', default=0)
    questions = GenericRelation(Question, related_query_name="question")

class Cart(models.Model):
    writer = models.CharField(max_length=50)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['writer', 'item'], name='user-polled'),
        ]
        
# class Product(models.Model):

#     def thumb_img_url(self):
#         img_name = self.category.name

#         img_name += '2' if self.id % 2 == 0 else ''

#         return f"https://raw.githubusercontent.com/jhs512/mbly-img/master/{img_name}.jpg"

#     def colors(self):
#         colors = []
#         product_reals = self.product_reals.all()
#         for product_real in product_reals:
#             colors.append(product_real.option_2_name)

#         html = ''

#         for color in set(colors):
#             if color == '레드':
#                 rgb_color = 'red'
#             elif color == '그린':
#                 rgb_color = 'green'
#             elif color == '블루':
#                 rgb_color = 'blue'
#             elif color == '핑크':
#                 rgb_color = 'pink'
#             elif color == '와인':
#                 rgb_color = '#722F37'
#             html += f"""<span style="width:10px; height:10px; display:inline-block; border-radius:50%; margin:0 3px; background-color:{rgb_color};"></span>"""

#         return html


class ItemReal(models.Model):
    reg_date = models.DateTimeField('등록날짜', auto_now_add=True)
    update_date = models.DateTimeField('갱신날짜', auto_now=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="product_reals")
    option_1_type = models.CharField('옵션1 타입', max_length=10, default='SIZE')
    option_1_name = models.CharField('옵션1 이름(내부용)', max_length=50)
    option_1_display_name = models.CharField('옵션1 이름(고객용)', max_length=50)
    option_2_type = models.CharField('옵션2 타입', max_length=10, default='COLOR')
    option_2_name = models.CharField('옵션2 이름(내부용)', max_length=50)
    option_2_display_name = models.CharField('옵션2 이름(고객용)', max_length=50)
    option_3_type = models.CharField('옵션3 타입', max_length=10, default='', blank=True)
    option_3_name = models.CharField('옵션3 이름(내부용)', max_length=50, default='', blank=True)
    option_3_display_name = models.CharField('옵션3 이름(고객용)', max_length=50, default='', blank=True)
    is_sold_out = models.BooleanField('품절여부', default=False)
    is_hidden = models.BooleanField('노출여부', default=False)
    add_price = models.IntegerField('추가가격', default=0)
    stock_quantity = models.PositiveIntegerField('재고개수', default=0)