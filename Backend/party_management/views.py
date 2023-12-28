from rest_framework import viewsets, status
from .serializer import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

#@api_view(['POST'])
#def login(request):
#    nombre = request.data.get('nombre')
#    ci = request.data.get('ci')

    #user = get_object_or_404(Administrador, nombre=nombre, ci=ci)

    #token, created = Token.objects.get_or_create(user=user)
    #serializer = AdminSerializer(instance=user)
   ## return Response({"token": token.key, "user": serializer.data})


#@api_view(['GET'])
#def test_token(request):
    #return Response({})

# Create your views here.
class OrganizerView(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizador.objects.all()

class VendeViewSet(viewsets.ModelViewSet):
    queryset = Vende.objects.all()
    serializer_class = VendeSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdminSerializer

class AsisViewSet(viewsets.ModelViewSet):
    queryset = Asistente.objects.all()
    serializer_class = AsisSerializer

class EvenViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EvenSerializer

class ContieneViewSet(viewsets.ModelViewSet):
    queryset = Contiene.objects.all()
    serializer_class = ContieneSerializer

class BoletoViewSet(viewsets.ModelViewSet):
    queryset = Boleto.objects.all()
    serializer_class = BoletoSerializer

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.all()
    serializer_class = OrdenSerializer

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        nombre = request.data.get('username')
        ci = request.data.get('password')
        
        # Buscar el administrador basado en el nombre y ci proporcionados
        administrador = get_object_or_404(Administrador, nombre=nombre, ci=ci)
        
        if administrador:
            serializer = AdminSerializer(administrador)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)