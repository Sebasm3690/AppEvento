from rest_framework import viewsets, status
from .serializer import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from jwt.exceptions import DecodeError, InvalidTokenError
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

class LoginViewAdm(APIView):
    def post(self, request, *args, **kwargs):
        nombre = request.data.get('username')
        ci = request.data.get('password')
        
        # Buscar el administrador basado en el nombre y ci proporcionados
        #administrador = get_object_or_404(Administrador, nombre=nombre, ci=ci)
        administrador = Administrador.objects.filter(nombre=nombre, ci=ci).first()
        if administrador is None:
            raise AuthenticationFailed('User not found')

        if administrador:
            request.session['is_logged_in'] = True
            serializer = AdminSerializer(administrador)
            
            payload = {
                'id': administrador.id_admin,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')

            response = Response()

            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data ={
                'jwt': token
            }

            return response
        else:
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewAdm(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('No inicio sesion correctamente')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('No inicio sesion')
        
        admin = Administrador.objects.filter(id_admin=payload['id']).first()
        serializer = AdminSerializer(admin)
        return Response(serializer.data)

class LogoutViewAdm(APIView):
    def post(self, request):
        # Cerrar la sesión del usuario almacenando la información en la sesión
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'logout success'
        }

        return response