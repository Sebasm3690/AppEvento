from rest_framework import viewsets, status
from .serializer import OrganizerSerializer
from .models import Organizador
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializer import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from jwt.exceptions import DecodeError, InvalidTokenError
from rest_framework import generics
from django.utils import timezone
import qrcode
from io import BytesIO
from django.http import HttpResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt


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
    
class VendeViewSet(viewsets.ModelViewSet):
    queryset = Vende.objects.all()
    serializer_class = VendeSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdminSerializer

class AsisViewSet(viewsets.ModelViewSet):
    queryset = Asistente.objects.all()
    serializer_class = AsisSerializer

class ContieneViewSet(viewsets.ModelViewSet):
    queryset = Contiene.objects.all()
    serializer_class = ContieneSerializer

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
    serializer_class = EventSerializer

class EventoDetail(generics.RetrieveAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventSerializer
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

class ObtenerStockBoleto(APIView):
    def get(self, request, id_boleto):
        try:
            boleto = Boleto.objects.get(id_boleto=id_boleto)
            serializer = TicketSerializer(boleto)
            return Response({'stock': serializer.data['stock']})
        except Boleto.DoesNotExist:
            return Response({'error': 'Boleto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class ActualizarStockView(APIView):
    def put(self, request, id_boleto):
        try:
            boleto = Boleto.objects.get(id_boleto=id_boleto)
            new_stock = request.data.get('stock')
            boleto.stock = new_stock
            boleto.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Boleto.DoesNotExist:
            return Response({'status': 'error', 'message': 'Boleto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class ObtenerStockVende(APIView):
    def get(self, request, id_boleto):
        try:
            boleto = Vende.objects.get(id_boleto=id_boleto)
            serializer = VendeSerializer(boleto)
            return Response({'stock': serializer.data['stock_actual']})
        except Boleto.DoesNotExist:
            return Response({'error': 'Boleto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class ActualizarVende(APIView):
    def put(self, request, id_boleto):
        try:
            boleto = Vende.objects.get(id_boleto=id_boleto)
            new_stock = request.data.get('stock_actual')
            boleto.stock_actual = new_stock
            boleto.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Boleto.DoesNotExist:
            return Response({'status': 'error', 'message': 'Boleto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
class ContieneQRViewSet(viewsets.ModelViewSet):
    queryset = Contiene.objects.all()
    serializer_class = ContieneSerializer

    def generate_qr_code(self, contiene):
        data = f"Codigo: {contiene.boleto_cdg},\n Orden: {contiene.num_orden}, \n Cantidad: {contiene.cantidad_total}"
        
        # Generar el código QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        # Crear una imagen del código QR
        img = qr.make_image(fill='black', back_color='white')
        buffer = BytesIO()
        img.save(buffer, format="PNG")

        return HttpResponse(buffer.getvalue(), content_type="image/png")

    def retrieve(self, request, *args, **kwargs):
        contiene = self.get_object()
        return self.generate_qr_code(contiene)

class HistorialComprasUsuarioAPIView(generics.ListAPIView):
    serializer_class = OrdenSerializer

    def get_queryset(self):
        # Obtiene el id_asistente del usuario solicitado desde los parámetros de la URL
        id_asistente = self.kwargs['id_asistente']
        # Filtra las ordenes de compra basadas en el id_asistente
        return OrdenCompra.objects.filter(id_asistente=id_asistente)

class UserId(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        id_asistente = payload.get('id')

        user = Asistente.objects.filter(id_asistente=id_asistente).first()

        if not user:
            raise AuthenticationFailed('Usuario no encontrado!')

        serializer = AsisSerializer(user)

        return Response({
            'id_asistente': id_asistente,
            'user_data': serializer.data,
            'email': user.email
        })
    
@csrf_exempt
def enviar_correo(request, id_asistente):
    try:
        asistente = Asistente.objects.get(id_asistente=id_asistente)
    except Asistente.DoesNotExist:
        return HttpResponse('El asistente no existe.', status=404)

    if request.method == 'POST':
        subject = f'{asistente.nombre} Aqui esta tu boleto'
        message = f'Hola {asistente.nombre}, Gracias por realizar la compra!.'
        from_email = 'partyconnect069@gmail.com'
        
        # Usar el correo electrónico del asistente autenticado
        to_email = [asistente.email]  # Suponiendo que el correo electrónico se obtuvo de alguna manera

        try:
            send_mail(subject, message, from_email, to_email)
            return HttpResponse(f'Correo enviado con éxito a {asistente.email}.')
        except Exception as e:
            return HttpResponse(f'Error al enviar el correo a {asistente.email}: {e}')

    return HttpResponse('Endpoint para enviar correo. Realiza una solicitud POST para enviar un correo.')
