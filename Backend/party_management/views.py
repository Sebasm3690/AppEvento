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
from django.core.mail import EmailMessage
from django.http import HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import redirect
from django.http import JsonResponse
from django.core.exceptions import ValidationError
import re
#resend.api_key = os.environ["RESEND_API_KEY"]

# Create your views here.
class OrganizerView(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizador.objects.all()

    def create(self, request, *args, **kwargs):
        correo = request.data.get('correo')  # Asegúrate de que 'correo' es el nombre correcto del campo en tu serializer
        cedula = request.data.get('ci')

        if validar_cedular_repetida(cedula)['existe']:
            return Response({'error': 'La cedula ya fue registrada por un organizador o asistente'})

        if validar_correo(correo)['existe']:
            return Response({'error': 'El correo ya fue registrado por un organizador o asistente'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)


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

class recuperarOrganizer(APIView):
    def post(self,request,id_organizador):
        organizador = get_object_or_404(Organizador,pk=id_organizador)
        organizador.eliminado = False
        organizador.save()
        return Response({"Mensaje":"Recuperación de organizador exitosa"},status=status.HTTP_200_OK)

class recuperarEvento(APIView):
    def post(self,request,id_evento):
        evento = get_object_or_404(Evento,pk=id_evento)
        evento.eliminado = False
        evento.save()
        return Response({"Mensaje":"Recuperación de evento exitosa"},status=status.HTTP_200_OK)

class BorradoLogicoOEvent(APIView):
    def post(self,request,id_evento):
        evento = get_object_or_404(Evento, pk=id_evento)
        evento.eliminado = True
        evento.save()
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

class RegisterViewAs(APIView):
    def post(self, request):
        serializer = AsisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cedula = request.data.get('ci', None)
        password = request.data.get('password', '')
        correo = request.data.get('email', None)

        if cedula:
            if validar_cedular_repetida(cedula).get('existe'):
                return Response({'error': 'La cedula ya fue registrada por un organizador o asistente'}, status=400)

        #Validar correo
        if correo:
            if validar_correo(correo).get('existe'):
                return Response({'error': 'El correo ya se encuentra registrado por un Organizador o Asistente'}, status=400)

        #Validar clave
        try:
            is_password_strong(password)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)

        #Validar Cedula
        if not cedula or not validar_cedula(cedula):
            return Response({'error': 'Cedula invalida'}, status=400)

        # Guardar el usuario sin confirmar
        user = serializer.save(confirmed=False)  # Asumiendo que tienes un campo 'confirmed' en tu modelo Asistente

        # Generar el token JWT para el usuario registrado
        payload = {
            'id': user.id_asistente,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'tu_clave_secreta', algorithm='HS256')  # Cambia 'tu_clave_secreta' por una clave segura

        # Enviar correo de confirmación con el token
        subject = 'Confirmación de registro'
        message = f'Haga clic en el siguiente enlace para confirmar su correo: http://127.0.0.1:8000/confirmar/{token}'
        from_email = 'partyconnect069@gmail.com'  # Usa la misma dirección de correo configurada en settings.py
        to_email = [user.email]  # Asumiendo que tu modelo Asistente tiene un campo 'email'
        
        send_mail(subject, message, from_email, to_email)

        # Configurar la respuesta con el token
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)  # Opcional: usa cookies si lo prefieres
        response.data = {
            'jwt': token,
            'message': 'Registro exitoso. Por favor, confirme su correo electrónico.'
        }

        return response

def confirmar_correo(request, token):
    try:
        # Decodificar el token JWT para obtener el ID del usuario
        payload = jwt.decode(token, 'tu_clave_secreta', algorithms=['HS256'])
        user_id = payload['id']
        
        # Obtener el usuario de la base de datos
        user = Asistente.objects.get(id_asistente=user_id)
        
        # Marcar el correo como confirmado
        user.confirmed = True
        user.save()

        user.confirmation_token = None
        user.save()

        # Enviar correo de confirmación al usuario
        subject = 'Confirmación de correo electrónico exitosa'
        message = 'Estimado/a {},\n\nSu correo electrónico ha sido confirmado exitosamente.'.format(user.nombre)
        from_email = 'partyconnect069@gmail.com'  # Cambia esto al correo desde el cual deseas enviar el mensaje
        to_email = [user.email]

        send_mail(subject, message, from_email, to_email)

        # Devolver una respuesta con un mensaje de éxito
        return JsonResponse({'message': 'Correo confirmado exitosamente. Se ha enviado una confirmación.'})

    except (jwt.ExpiredSignatureError, jwt.DecodeError, Asistente.DoesNotExist) as e:
        # En caso de error, devolver un mensaje adecuado
        return JsonResponse({'error': 'Token inválido o usuario no encontrado.'}, status=400)
    
class LoginViewAs(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = Asistente.objects.filter(email=email, password=password).first()

        if user and not user.confirmed:
            raise AuthenticationFailed('Por favor, confirma tu correo electrónico antes de iniciar sesión.')
        
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
def enviar_correo(request, id_asistente, id_contiene):
    try:
        asistente = Asistente.objects.get(id_asistente=id_asistente)
    except Asistente.DoesNotExist:
        return HttpResponse('El asistente no existe.', status=404)

    try:
        # Obtén el boleto (Contiene) específico para este asistente
        contiene = Contiene.objects.get(id_contiene=id_contiene, num_orden__id_asistente=id_asistente)
    except Contiene.DoesNotExist:
        return HttpResponse('No se encontró el boleto específico para este asistente.', status=400)

    if request.method == 'POST':
        # Genera el código QR para el boleto específico
        qr_image = ContieneQRViewSet().generate_qr_code(contiene)

        subject = f'{asistente.nombre}, aquí está tu boleto'
        message = f'Hola {asistente.nombre}, gracias por realizar la compra. Adjunto encontrarás tu boleto específico.'
        from_email = 'partyconnect069@gmail.com'
        to_email = [asistente.email]

        try:
            # Crea un objeto EmailMessage y adjunta el código QR
            email = EmailMessage(subject, message, from_email, to_email)
            email.attach(f'boleto_qr_{contiene.id_contiene}.png', qr_image.getvalue(), 'image/png')
            email.send()
            return HttpResponse(f'Correo enviado con éxito a {asistente.email}.')
        except Exception as e:
            return HttpResponse(f'Error al enviar el correo a {asistente.email}: {e}')

    return HttpResponse('Endpoint para enviar correo. Realiza una solicitud POST para enviar un correo.')

def validar_cedula(cedula):
    if not cedula.isdigit():
        return False  # La cédula debe contener solo dígitos
    
    if len(cedula) != 10:
        return False  # La cédula debe tener 10 dígitos
    
    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    suma = 0
    
    for i in range(9):
        resultado = int(cedula[i]) * coeficientes[i]
        if resultado > 9:
            resultado -= 9
        suma += resultado
    
    verificador = (10 - (suma % 10)) % 10
    
    return verificador == int(cedula[9])

def is_password_strong(password):
    """
    Verifica si una contraseña es fuerte según ciertos criterios.
    """
    if not re.search(r'[A-Z]', password):
        raise ValidationError('La contraseña debe contener al menos una letra mayúscula.')
    
    if not re.search(r'[a-z]', password):
        raise ValidationError('La contraseña debe contener al menos una letra minúscula.')
    
    if not re.search(r'[0-9]', password):
        raise ValidationError('La contraseña debe contener al menos un número.')
    
    if not re.search(r'[!@#$%^&*()_+{}[\]:;<>,.?/~`]', password):
        raise ValidationError('La contraseña debe contener al menos un carácter especial.')
    
    if len(password) < 8:
        raise ValidationError('La contraseña debe tener al menos 8 caracteres.')
    
def validar_correo(correo):
    # Verificar si el correo ya existe en cualquiera de los modelos
    if Asistente.objects.filter(email=correo).exists() or \
       Organizador.objects.filter(correo=correo).exists():
        return {'existe': True}
    else:
        return {'existe': False}

def validar_cedular_repetida(cedula):
    # Verificar si el correo ya existe en cualquiera de los modelos
    if Asistente.objects.filter(ci=cedula).exists() or \
       Organizador.objects.filter(ci=cedula).exists():
        return {'existe': True}
    else:
        return {'existe': False}