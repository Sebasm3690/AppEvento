from django.urls import path,include 
from rest_framework import routers
from party_management import views
from rest_framework.documentation import include_docs_urls

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
]


