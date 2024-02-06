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
router.register(r'contieneqr', views.ContieneQRViewSet)

urlpatterns = [
    path("api/v1/", include(router.urls)),  #/api/v1/
    path("docs/", include_docs_urls(title="Parties API")),
    path("borrado_logico_organizador/<int:id_organizador>/",views.BorradoLogicoOrganizer.as_view(),name="borrado_logico:organizador"),
    path("borrado_logico_evento/<int:id_evento>/",views.BorradoLogicoOEvent.as_view(),name="borrado_logico_evento"),
    path("recuperar_organizador/<int:id_organizador>/",views.recuperarOrganizer.as_view(),name="recuperar_organizador"),
    path("recuperar_evento/<int:id_evento>/",views.recuperarEvento.as_view(),name="recuperar_evento"),
    path("Update_iva_ice/",views.Update_iva_ice.as_view(),name="Update_iva_ice"),
    path("vendeBoleto/",views.VendeBoleto.as_view(),name="vendeBoleto"),
    path("ganancia/<int:id_evento>/",views.GananciaEvento.as_view(),name="ganancia"),
    path("ordenDashboard/<int:id_evento>/",views.ordenCompraDashboard.as_view(),name="ordenDashboard"),
    path("ganancia_general/<int:id_organizador>/",views.GananciaGeneral.as_view(),name='ganancia_general'),
    path("valoresPIE/<int:id_organizador>",views.ValoresPIETotal.as_view(),name='valoresPIE'),
    path("eventos_activos/",views.ObtetenerEventosActivos.as_view(),name="eventos_activos"),

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
    path('api/contiene/agregar/', ContieneCreateAPIView.as_view(), name='agregarcont'),
    path('obtener_stock/<int:id_boleto>/', ObtenerStockBoleto.as_view(), name='obtenerbol'),
    path('actualizar_stock/<int:id_boleto>/', ActualizarStockView.as_view(), name='actualizar_stock'),
    
    path('api/actuv/<int:id_boleto>/', ActualizarVende.as_view(), name='actualizar_vende'),
    path('api/verstockv/<int:id_boleto>/', ObtenerStockVende.as_view(), name='obtener_vende'),
    path('historial-compras/<int:id_asistente>/', HistorialComprasUsuarioAPIView.as_view(), name='historial-compras-usuario'),
    path('api/asistenteid/', UserId.as_view(), name='evenmuestra'),
    
    path('asistentes/<int:id_asistente>/contiene/<int:id_contiene>/enviar_correo/', views.enviar_correo, name='enviar_correo'),
    path('confirmar/<str:token>/', confirmar_correo, name='confirmar_correo'),
    path('validar-correo/', views.validar_correo, name='validar_correo'),

    path('api/v1/event/<int:id_evento>/upload-image/', UploadImageView.as_view(), name='upload_image'),
    path('api/monto_organizador/',TotalGeneradoPorOrganizador.as_view(), name='monto_generado_organizador'),
    path('api/cantidadorg/', TotalCantidadOrganizador.as_view(), name='CantidadOrg'),
    path('api/cantidadsoborg/', CantidadSobranteOrg.as_view(), name='cantidad_sobrante'),
    path('validate_qr/', validate_qr_code, name='validate_qr'),
    path('compra-boleto/', CompraBoletoView.as_view(), name='compra-boleto'),
    path('api/eventoslist/', EventoList.as_view(), name='evento-list'),
]
