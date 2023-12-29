from django.urls import path,include 
from rest_framework import routers
from party_management import views
from rest_framework.documentation import include_docs_urls

#Here you don't need to use parameters and .as_view()

router = routers.DefaultRouter()
router.register(r"organizer",views.OrganizerView,"organizer")  #/api/v1/organizer/
router.register(r"admin",views.AdminView,"admin") #api/v1/admin/


urlpatterns = [
    path("api/v1/", include(router.urls)),  #/api/v1/
    path("docs/", include_docs_urls(title="Parties API")), #/docs
    path("borrado_logico/<int:id_organizador>/",views.BorradoLogicoOrganizer.as_view(),name="borrado_logico"), #Se pasan parametros como el id por lo que es mas recomendable utilizarlo como path y no como router.register
]


