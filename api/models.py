from django.db import models
import string
import random
# Create your models here.

def generate_unique_code():
    length = 5
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Item.objects.filter(code=code).count() == 0:
            break
    return code


class Item(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    writer = models.CharField(max_length=50, null=True)
    image = models.ImageField(verbose_name='image', null=True, blank=True)
    listing_or_not = models.BooleanField(null=False, default=False) # 장바구니 표현하려 했으나, boolean이면 안될 거 같아서 판매가능여부로 치자
    like_count = models.IntegerField(null=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)