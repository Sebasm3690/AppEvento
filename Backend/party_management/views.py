from rest_framework import viewsets, status
from .serializer import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import check_password
import jwt, datetime

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
        
class RegisterViewAs(APIView) :
    def post(self, request):
        serializer = AsisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class LoginViewAs(APIView):
    def post(self, request):
        email = request.data['correo']
        password = request.data['contrasenia']

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


# Organizador Autentificación


class LoginViewOrg(APIView):
    def post(self, request):
        email = request.data['correo']
        password = request.data['constrasenia']

        user = Organizador.objects.filter(email=email, password=password).first()

        if user is None or not check_password(password, user.password):
            raise AuthenticationFailed('Usuario no Encontrado o Contraseña Incorrecta')
            
        payload = {
            'id': user.id_organizador,
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

class UserViewOrg(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = Organizador.objects.filter(id_organizador=payload['id']).first()

        if not user:
            raise AuthenticationFailed('Usuario no encontrado!')

        serializer = OrganizerSerializer(user)
        return Response(serializer.data)

class LogoutViewOrg(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    