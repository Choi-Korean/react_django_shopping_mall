from django.urls import path
from .views import *

urlpatterns = [
    # path('signup/', SignUp.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
]