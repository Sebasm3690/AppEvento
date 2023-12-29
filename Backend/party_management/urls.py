from django.urls import path,include
from rest_framework import routers
from party_management import views
from rest_framework.documentation import include_docs_urls
from .views import LoginViewAdm, LogoutViewAdm, UserViewAdm
from rest_framework.authtoken.views import ObtainAuthToken
from .views import *

router = routers.DefaultRouter()
router.register(r"party",views.OrganizerView,"party")  #/api/v1/party/
router.register(r'vende', views.VendeViewSet)
router.register(r'administrador', views.AdminViewSet)
router.register(r'OrdenCompra', views.OrdenViewSet)
router.register(r'Asistente', views.AsisViewSet)
router.register(r'Evento', views.EvenViewSet)
router.register(r'contiene', views.ContieneViewSet)
router.register(r'boleto', views.BoletoViewSet)

urlpatterns = [
    path("api/v1/", include(router.urls)),  #/api/v1/
    path("docs/", include_docs_urls(title="Parties API")),
    path("api/login/", LoginViewAdm.as_view(), name='login'),
    path('api/logout/', LogoutViewAdm.as_view(), name='logout'),
    path('api/userv/', UserViewAdm.as_view(), name='admview'),
    path("register", RegisterViewAs.as_view()),
    path("loginAs", LoginViewAs.as_view()),
    path("asistente", UserViewAs.as_view()),
    path("logoutAs", LogoutViewAs.as_view()),
]



