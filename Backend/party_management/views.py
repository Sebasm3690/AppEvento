from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
#from django.http import JsonResponse
#from django.views import View
from .serializer import *
from .models import *

# Create your views here.
class OrganizerView(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizador.objects.all()

class AdminView(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    queryset = Administrador.objects.all()

class BorradoLogicoOrganizer(APIView):
    def post(self,request,id_organizador):
        organizador = get_object_or_404(Organizador, pk=id_organizador)
        organizador.eliminado = True
        organizador.save()
        return Response({'mensaje':'Borrado lógico exitoso'}, status=status.HTTP_200_OK)