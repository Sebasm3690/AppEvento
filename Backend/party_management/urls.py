from django.urls import path,include 
from rest_framework import routers
from django.conf.urls.static import static #We use this to import images
from django.conf import settings #We need to import media_root and media_url
from party_management import views
from rest_framework.documentation import include_docs_urls

#Here you don't need to use parameters and .as_view()

router = routers.DefaultRouter()
router.register(r"organizer",views.OrganizerView,"organizer")  #/api/v1/organizer/
router.register(r"admin",views.AdminView,"admin") #api/v1/admin/
router.register(r"event",views.EventView,"event")
router.register(r"ticket",views.TicketView,"ticket")

urlpatterns = [
    path("api/v1/", include(router.urls)),  #/api/v1/
    path("docs/", include_docs_urls(title="Parties API")), #/docs
    #path('api/v1/upload/', views.upload_image, name='upload_image'),
    path("borrado_logico/<int:id_organizador>/",views.BorradoLogicoOrganizer.as_view(),name="borrado_logico"), #Se pasan parametros como el id por lo que es mas recomendable utilizarlo como path y no como router.register
] #+ static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT) #UPLOAD IMAGE #3


