from django.urls import path,include 
from rest_framework import routers
from party_management import views

router = routers.DefaultRouter()
router.register(r"party",views.AdminView,"party")  #/api/v1/party/

urlpatterns = [
    path("api/v1/", include(router.urls))  #/api/v1/
]
