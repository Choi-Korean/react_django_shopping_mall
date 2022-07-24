from django.urls import path
from .views import *

urlpatterns = [
    # path('signup/', SignUp.as_view()),
    path('signup/', Signup.as_view()),
]