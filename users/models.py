from django.utils import timezone
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from shop_controller.settings import BASE_DIR


def upload_to(instance, filename):
    print(BASE_DIR)
    return  'D:/react_django_tutorial/shop_controller/static/profile_img/%Y/%m/%d/{filename}'.format(filename=filename)

class UserManager(BaseUserManager):
    use_in_migrations = True
    def _create_user(self, password, **extra_fields):
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(password, **extra_fields)

    def create_superuser(self, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(password, **extra_fields)

class User(AbstractUser, PermissionsMixin):
    class GenderChoices(models.TextChoices):
        MALE = "M", "남성"
        FEMALE = "F", "여성"

    first_name = None
    last_name = None
    date_joined = None

    reg_date = models.DateTimeField('등록일', auto_now_add=True)
    update_date = models.DateTimeField('갱신일', auto_now=True)

    name = models.CharField('이름', max_length=100)
    gender = models.CharField('성별', max_length=1, blank=True, choices=GenderChoices.choices)
    profile_img = models.ImageField('프로필이미지', blank=True, upload_to=upload_to ,help_text="gif/png/jpg 이미지를 업로드해주세요.")
    # "accounts/profile_img/%Y/%m/%d",help_text="gif/png/jpg 이미지를 업로드해주세요.")
    # is_staff = models.BooleanField(
    #     _('staff status'),
    #     default=False,
    #     help_text=_('Designates whether the user can log into this admin site.'),
    # )
    # is_active = models.BooleanField(
    #     _('active'),
    #     default=True,
    #     help_text=_(
    #         'Designates whether this user should be treated as active. '
    #         'Unselect this instead of deleting accounts.'
    #     ),
    # )
    # date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    # objects = UserManager()

    # class Meta:
    #     verbose_name = _('user')
    #     verbose_name_plural = _('users')

    # def __str__(self):
    #     return self.username

# class UserInfo(models.Model):
#     phone_sub = models.CharField(verbose_name='보조 전화번호', max_length=11)
#     user = models.ForeignKey(to='User', on_delete=models.CASCADE)