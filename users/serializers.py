from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

# class UserCreateSerializer(serializers.Serializer):
#     username = serializers.CharField(required=True)
#     password = serializers.CharField(required=True)
class UserCreateSerializer(serializers.ModelSerializer):
    profile_img = serializers.ImageField(required=False)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].required = True
        self.fields['name'].required = True
        self.fields['username'].label = '아이디'
        # self.fields['profile_img'].widget.attrs['accept'] = 'image/png, image/gif, image/jpeg'

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'name', 'gender', 'profile_img']
        parser_classes = (MultiPartParser, FormParser)
    
    def clean_email(self):
        email = self.data['email']
        if email:
            qs = User.objects.filter(email=email)
            if qs.exists():
                raise serializers.ValidationError("이미 등록된 이메일 주소입니다.")
        return email
    # def create(self, validated_data):
    #     user = User.objects.create( # User 생성
    #         username=validated_data['username'],
    #     )
    #     user.set_password(validated_data['password'])
    #     user.save()
        
    #     return user