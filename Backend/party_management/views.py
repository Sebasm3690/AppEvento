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
from rest_framework import generics
from django.utils import timezone

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

class BorradoLogicoOrganizer(APIView):
    def post(self,request,id_organizador):
        organizador = get_object_or_404(Organizador, pk=id_organizador)
        organizador.eliminado = True
        organizador.save()
        return Response({'mensaje':'Borrado lógico exitoso'}, status=status.HTTP_200_OK)
    
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

class RegisterViewAs(APIView) :
    def post(self, request):
        serializer = AsisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class LoginViewAs(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = Asistente.objects.filter(email=email, password=password).first()

        if user is None:
            raise AuthenticationFailed('Usuario no Encontrado o Contraseña Incorrecta')

        #if user.check_password(password):
            #raise AuthenticationFailed('Cotraseña Incorrecta!')
            
        payload = {
            'id': user.id_asistente,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')


        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
    
        return response
    
class UserViewAs(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Utiliza 'id_asistente' en lugar de 'id' en la consulta
        user = Asistente.objects.filter(id_asistente=payload['id']).first()

        if not user:
            raise AuthenticationFailed('Usuario no encontrado!')

        serializer = AsisSerializer(user)
        return Response(serializer.data)

class LogoutViewAs(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

# Organizador
    
class LoginViewOrg(APIView):
    def post(self, request, *args, **kwargs):
        nombre = request.data.get('username')
        ci = request.data.get('password')
        
        organizador = Organizador.objects.filter(nombre=nombre, ci=ci).first()

        if organizador  is None:
            raise AuthenticationFailed('User not found')

        if organizador :
            request.session['is_logged_in'] = True
            serializer = OrganizerSerializer(organizador )
            
            payload = {
                'id': organizador.id_organizador,
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

class UserViewOrg(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('No inicio sesion correctamente')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('No inicio sesion')
        
        admin = Organizador.objects.filter(id_organizador=payload['id']).first()
        serializer = OrganizerSerializer(admin)
        return Response(serializer.data)

class LogoutViewOrg(APIView):
    def post(self, request):
        # Cerrar la sesión del usuario almacenando la información en la sesión
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'logout success'
        }

        return response

class EventoMuestra(generics.ListAPIView):
    queryset = Evento.objects.all()
    serializer_class = EvenSerializer

class EventoDetail(generics.RetrieveAPIView):
    queryset = Evento.objects.all()
    serializer_class = EvenSerializer
    lookup_field = 'id_evento'

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Evento.DoesNotExist:
            return Response({"detail": "El evento no existe."}, status=status.HTTP_404_NOT_FOUND)

class OrdenCompraView(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        # Obtener el usuario basado en el token
        user = Asistente.objects.filter(id_asistente=payload['id']).first()

        if not user:
            raise AuthenticationFailed('Usuario no encontrado!')

        # Aquí asumimos que tienes una lógica para calcular el valor_total. 
        # Puedes adaptar esto según tus necesidades.
        valor_total = request.data.get('valor_total')  # Suponiendo que envíes el valor_total en la solicitud

        # Crear una nueva orden de compra
        orden_compra = OrdenCompra.objects.create(
            id_asistente=user,
            valor_total=valor_total,
            fecha=timezone.now()
        )

        serializer = OrdenSerializer(orden_compra)

        return Response(serializer.data)
    
class ContieneCreateAPIView(APIView):
     def post(self, request, format=None):
        serializer = ContieneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
