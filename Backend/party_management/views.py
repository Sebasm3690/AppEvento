from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
#import uuid
#from rest_framework.decorators import api_view
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

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Evento.objects.all()


class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Boleto.objects.all()

class BorradoLogicoOrganizer(APIView):
    def post(self,request,id_organizador):
        organizador = get_object_or_404(Organizador, pk=id_organizador)
        organizador.eliminado = True
        organizador.save()
        return Response({'mensaje':'Borrado lógico exitoso'}, status=status.HTTP_200_OK)



# 4 Images

#@api_view(['POST'])
#def upload_image(request):
    #if 'image' in request.FILES:
        #image = request.FILES['image']
        # Procesa la carga de la imagen y guárdala donde sea necesario
        #image_name = f"evento-cover-{uuid.uuid4().hex}.jpg"
        #with open(f"media/{image_name}", 'wb') as destination:
            #for chunk in image.chunks():
                #destination.write(chunk)

        #image_url = f"http://127.0.0.1:8000/media/{image_name}"
        #return Response({'url': image_url})
    
    #return Response({'error': 'No se proporcionó ninguna imagen'}, status=400)

