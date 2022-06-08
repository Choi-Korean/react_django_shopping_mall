from django.db import models

# Create your models here.
class Item(models.Model):
    writer = models.CharField(max_length=50)
    image = models.ImageField(verbose_name='image', null=True, blank=True)
    listing_or_not = models.BooleanField(null=False, default=False) # 장바구니 표현하려 했으나, boolean이면 안될 거 같아서 판매가능여부로 치자
    like_count = models.IntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)