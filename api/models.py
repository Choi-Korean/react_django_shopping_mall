import os
from django.db import models
import string
import random
from shop_controller.settings import BASE_DIR
# Create your models here.

def generate_unique_code():
    length = 5
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Item.objects.filter(code=code).count() == 0:
            break
    return code

def upload_to(instance, filename):
    print(BASE_DIR)
    return  'D:/react_django_tutorial/shop_controller/static/images/{filename}'.format(filename=filename)

class Item(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    writer = models.CharField(max_length=50, null=True)
    image = models.ImageField(verbose_name='image', null=True, blank=True, upload_to=upload_to )
    listing_or_not = models.BooleanField(null=False, default=False) # 장바구니 표현하려 했으나, boolean이면 안될 거 같아서 판매가능여부로 치자
    like_count = models.IntegerField(null=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)


class Cart(models.Model):
    writer = models.CharField(max_length=50)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['writer', 'item'], name='user-polled'),
        ]