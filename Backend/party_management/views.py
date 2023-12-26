from rest_framework import viewsets
from .serializer import AdminSerializer
from .models import Administrador

# Create your views here.
class AdminView(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    queryset = Administrador.objects.all()