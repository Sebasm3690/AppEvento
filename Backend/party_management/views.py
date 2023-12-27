from rest_framework import viewsets
from .serializer import OrganizerSerializer
from .models import Organizador

# Create your views here.
class OrganizerView(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizador.objects.all()