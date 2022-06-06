from django.db import models

# Create your models here.
class Item(models.Model):
    writer = models.CharField(max_length=50, unique=True)
    image = models.ImageField(verbose_name='image', null=True, blank=True)
    listing_or_not = models.BooleanField(null=False, default=False)
    like_count = models.IntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)