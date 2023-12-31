from django.urls import path,include
from rest_framework import routers
from django.conf.urls.static import static #We use this to import images
from django.conf import settings #We need to import media_root and media_url
from party_management import views
from rest_framework.documentation import include_docs_urls
from .views import LoginViewAdm, LogoutViewAdm, UserViewAdm
from rest_framework.authtoken.views import ObtainAuthToken
from .views import *

router = routers.DefaultRouter()
router.register(r"organizer",views.OrganizerView,"organizer")  #/api/v1/organizer/
router.register(r"admin",views.AdminView,"admin") #api/v1/admin/
router.register(r"event",views.EventView,"event")
router.register(r"ticket",views.TicketView,"ticket")
router.register(r'vende', views.VendeViewSet)
router.register(r'administrador', views.AdminViewSet)
router.register(r'OrdenCompra', views.OrdenViewSet)
router.register(r'Asistente', views.AsisViewSet)
router.register(r'boleto', views.TicketView)
router.register(r'contiene', views.ContieneViewSet)

urlpatterns = [
    path("api/v1/", include(router.urls)),  #/api/v1/
    path("docs/", include_docs_urls(title="Parties API")),
    path("borrado_logico/<int:id_organizador>/",views.BorradoLogicoOrganizer.as_view(),name="borrado_logico"),
    
    path("api/login/", LoginViewAdm.as_view(), name='login'),
    path('api/logout/', LogoutViewAdm.as_view(), name='logout'),
    path('api/userv/', UserViewAdm.as_view(), name='admview'),

    path("register", RegisterViewAs.as_view()),
    path("loginAs", LoginViewAs.as_view()),
    path("asistente", UserViewAs.as_view()),
    path("logoutAs", LogoutViewAs.as_view()),

    path("api/loginOrg/", LoginViewOrg.as_view(), name='login'),
    path('api/organizador/', UserViewOrg.as_view(), name='organizador'),
    path('api/logoutOrg/', LogoutViewOrg.as_view(), name='logout'),
    
    path('api/vereven/', EventoMuestra.as_view(), name='evenmuestra'),
    path('api/lista/evendet/<int:id_evento>/', EventoDetail.as_view(), name='evendet'),
    path('api/crear-orden/', OrdenCompraView.as_view(), name='crearord'),
    path('api/contiene/agregar/', ContieneCreateAPIView.as_view(), name='agregarcont')
]

