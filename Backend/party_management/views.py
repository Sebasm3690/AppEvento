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
import json
from decimal import Decimal
from django.template.loader import render_to_string
from django.shortcuts import render
from django.template.loader import get_template
import base64
from django.db.models import Sum, functions
from decimal import Decimal
#resend.api_key = os.environ["RESEND_API_KEY"]

class UploadImageView(APIView):

    def post(self, request, id_evento):
        try:
            event = Evento.objects.get(id_evento=id)
        except Evento.DoesNotExist:
            return Response({'error': 'Evento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        image = request.FILES.get('imagen')

        if not image:
            return Response({'error': 'No se proporcionó una imagen'}, status=status.HTTP_400_BAD_REQUEST)

        event.imagen = image
        event.save()

        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create your views here.
class OrganizerView(viewsets.ModelViewSet):
    serializer_class = OrganizerSerializer
    queryset = Organizador.objects.all()

    def create(self, request, *args, **kwargs):
        correo = request.data.get('correo')  # Asegúrate de que 'correo' es el nombre correcto del campo en tu serializer
        cedula = request.data.get('ci')

        if not validar_cedula(cedula):
            return Response({'error': 'La cedula proporcionada no es valida'}, status=status.HTTP_400_BAD_REQUEST) 
        
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
    
class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Boleto.objects.all()

    def create(self, request, *args, **kwargs):
        correo = request.data.get('correo')  # Asegúrate de que 'correo' es el nombre correcto del campo en tu serializer
        cedula = request.data.get('ci')

        if validar_cedular_repetida(cedula)['existe']:
            return Response({'error': 'La cedula ya fue registrada por un organizador o asistente'}, status=status.HTTP_400_BAD_REQUEST)

        if validar_correo(correo)['existe']:
            return Response({'error': 'El correo ya fue registrado por un organizador o asistente'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)


class AdminView(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    queryset = Administrador.objects.all()

    def create(self, request, *args, **kwargs):
        correo = request.data.get('correo')  # Asegúrate de que 'correo' es el nombre correcto del campo en tu serializer
        cedula = request.data.get('ci')

        if not validar_cedula(cedula):
            return Response({'error': 'La cedula proporcionada no es valida'}, status=status.HTTP_400_BAD_REQUEST) 
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Evento.objects.all()


class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Boleto.objects.all()

    def create(self, request, *args, **kwargs):
        correo = request.data.get('correo')  # Asegúrate de que 'correo' es el nombre correcto del campo en tu serializer
        cedula = request.data.get('ci')

        if validar_cedular_repetida(cedula)['existe']:
            return Response({'error': 'La cedula ya fue registrada por un organizador o asistente'}, status=status.HTTP_400_BAD_REQUEST)

        if validar_correo(correo)['existe']:
            return Response({'error': 'El correo ya fue registrado por un organizador o asistente'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Evento.objects.all()

class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Boleto.objects.all()



class ObtetenerEventosActivos (APIView):
    def get(self,request):
        organizadores = Organizador.objects.filter(eliminado=False)
        eventos = Evento.objects.filter(id_organizador__in = organizadores)
        evento_serializer = EventSerializer(eventos, many=True)
        return Response ({'eventos':evento_serializer.data})

class ordenCompraDashboard (APIView):
    def get(self,request,id_evento):
        #Obtener compra del evento
        total_precio = 0
        total_boletos = 0
        total_posible = 0
        total_stock_actual = 0
        boletos_comprados = 0
        boletos_porcentaje = 0
        perdida = 0
        boletos = Boleto.objects.filter(id_evento = id_evento)
        evento = Evento.objects.filter(id_evento = id_evento).first()

        boletos_ids = Boleto.objects.filter(id_evento=id_evento).values_list('id_boleto', flat=True) 
        vendes = Vende.objects.filter(id_boleto__in = boletos_ids)
        ordenes_ids = Contiene.objects.filter(id_boleto__in=boletos_ids).values_list('num_orden', flat=True)
        compras = OrdenCompra.objects.filter(num_orden__in=ordenes_ids)
        
        #Lógica compras
        ventas_mensuales = compras.annotate(   #objects.annotate en caso de que saques del modelo ordenCompra
            mes=functions.ExtractMonth('fecha'),
            año=functions.ExtractYear('fecha')          
        ).values('mes','año').annotate( #Aqui se agrupan los meses y año, por lo que en la linea de abajo se suman en caso que los meses y años sean iguales (GROUP BY)
            total_mes=Sum('valor_total')
        ).order_by('año', 'mes')

        total_anual = round(sum(venta['total_mes'] for venta in ventas_mensuales),2) #Se pone venta["total_mes"] para solo obtener solo el total_mes de cada elemento
        

        

        #Ganancia posible 
        for boleto in boletos:
            total_precio += boleto.precio
            total_boletos += boleto.stock
        

        for vende in vendes:
            total_stock_actual += vende.stock_actual
        
        boletos_comprados = total_boletos - total_stock_actual


        #Porcentaje ganancia 
        total_posible = total_precio * total_boletos
        porcentaje_total_anual = round(float(total_anual * 100) / float(total_posible),2)


        #Porcentaje boletos comprados
        boletos_porcentaje = round((boletos_comprados * 100) / total_boletos,2)

        #Perdida

        perdida = round(int(evento.gasto) - int(total_anual),2)
            
        #print("Total anual y ventas mensuales: {} y {}".format(total_anual, ventas_mensuales))
        return Response({'ventas_mensuales': ventas_mensuales, 'total_anual': total_anual, 'porcentaje_total_anual':porcentaje_total_anual,'total_boletos':total_boletos,'boletos_comprados':boletos_comprados,'boletos_porcentaje':boletos_porcentaje,'perdida':perdida})
     
   
        #compras_data = [{"num_orden": compra.num_orden, "valor_total": compra.valor_total, "fecha": compra.fecha} for compra in compras]
        #return JsonResponse(compras_data, safe=False)

class GananciaGeneral(APIView):
    def get(self, request,id_organizador):
        # Lista para almacenar la ganancia total de cada evento
        ganancia_por_evento = []

        organizadores_ids = Organizador.objects.filter(id_organizador=id_organizador).values_list('id_organizador', flat=True).first() 
        eventos = Evento.objects.filter(id_organizador = organizadores_ids)
        # Lista para almacenar la ganancia total de cada evento
        
        for evento in eventos:
            ganancia_total_evento = 0
            boletos = Boleto.objects.filter(id_evento=evento)
            gasto = 0

            for boleto in boletos:
                contienes = Contiene.objects.filter(id_boleto=boleto)
            
                for contiene in contienes:
                    ganancia_total_evento += boleto.precio * contiene.cantidad_total
                    gasto = evento.gasto - ganancia_total_evento
                    if(gasto < 0):
                        gasto = 0

            ganancia_general = {
                "nombre_evento": evento.nombre_evento,
                "ganancia_total_evento": ganancia_total_evento,
                "gasto_general":gasto
            }

            ganancia_por_evento.append(ganancia_general)
        

        return JsonResponse(ganancia_por_evento, safe=False)
                

class ValoresPIETotal(APIView):
    def get(self, request, id_organizador):
        total_boletos = 0
        total_precio = 0
        ganancia_total_eventos = 0
        gasto_total_eventos = 0
        ganancia_total_posible = 0
  

        # Obtener todos los eventos de un organizador que no han sido eliminados
        eventos = Evento.objects.filter(eliminado=False, id_organizador=id_organizador)
        # Boletos de todos los eventos
        for evento in eventos:
            boletos = Boleto.objects.filter(id_evento=evento.id_evento)
            gasto_total_eventos += evento.gasto
            for boleto in boletos:
                total_boletos += boleto.stock
                ganancia_total_posible += boleto.stock * boleto.precio
                contienes = Contiene.objects.filter(id_boleto=boleto.id_boleto)
                for contiene in contienes:
                    ordenCompras = OrdenCompra.objects.filter(num_orden = contiene.num_orden_id)
                    for ordenCompra in ordenCompras:
                        ganancia_total_eventos += ordenCompra.valor_total

        ganancia_porcentaje = round(Decimal(ganancia_total_eventos * 100) / Decimal(ganancia_total_posible), 2) if ganancia_total_posible else 0
        gasto_total_eventos = round(Decimal(gasto_total_eventos) - Decimal(ganancia_total_eventos), 2)

        # Suponiendo que 'vende.iva' es un valor constante o global, necesita ser obtenido correctamente
        iva = Vende.objects.first().iva if Vende.objects.exists() else 0  # Ajustar según la lógica de tu aplicación

        valoresPIE = {
            "ganancia_total_eventos": ganancia_total_eventos,
            "gasto_total_eventos": gasto_total_eventos,
            "iva": iva,
            "ganancia_porcentaje": ganancia_porcentaje
        }

        return JsonResponse(valoresPIE, safe=False)

        

        


class GananciaEvento(APIView):
    def get(self,request,id_evento):
        evento = Evento.objects.filter(id_evento=id_evento).first()
        boleto = Boleto.objects.filter(id_evento=id_evento).first()
        vende = Vende.objects.filter(id_boleto=boleto.id_boleto).first()
        numeroBoletosVendidos = boleto.stock - vende.stock_actual
        ganancia = numeroBoletosVendidos * boleto.precio
        ganancia_posible = boleto.stock * boleto.precio
        porcentajeBoletosVendidos = 100 - (vende.stock_actual * 100) / boleto.stock
        porcentajeGananciaTotal = (ganancia * 100) / ganancia_posible
        perdida = evento.gasto - ganancia
        #print(perdida)
        if (perdida < 0):
            perdida = 0
        evento_serializer = EventSerializer(evento)

        data = {
            'ganancia_total': ganancia,
            'ganancia_posible': ganancia_posible,
            'numero_boletos_vendidos':numeroBoletosVendidos,
            'porcentaje_boletos':porcentajeBoletosVendidos,
            'porcentajeGananciaTotal':porcentajeGananciaTotal,
            'evento':evento_serializer.data,
            'perdida':perdida
        }

        return Response(data)






class GananciaGeneralEventos(APIView):
    def get(self, request):
        eventos = Evento.objects.all()        


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

class BorradoLogicoOEvent(generics.UpdateAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id_evento'
    def update(self,request,id_evento):
        instance = self.get_object() # Obtener la instancia del objeto basado en el identificador proporcionado en la URL
        stock_boleto = Boleto.objects.filter(id_evento=instance.id_evento).first().stock
        stock_vende = Vende.objects.filter(id_boleto__id_evento=instance.id_evento).first().stock_actual

        if stock_boleto == stock_vende:
            instance.eliminado = True
            instance.save()
            
            return JsonResponse({"message": "El evento ha sido dado de baja"}, status=200)
        else:
            return JsonResponse({"message": " No se puede dar de baja el evento, ya que hay asistentes que compraron boletos para dicho evento"}, status=422)


class VendeBoleto(generics.CreateAPIView):
    queryset = Boleto.objects.all()
    serializer_class = TicketSerializer
    
    def perform_create(self,serializer):
        primer_vende = Vende.objects.first() #Obtener la primera instancia o columna vende
        if primer_vende is not None:
            iva = primer_vende.iva #Obtenemos el primer IVA
            precio = serializer.validated_data.get("precio",0) #Obtenemos el precio del serializer, que en este caso va a ser un campo de los que fueron ingresados por el usuario y vienen desde React hasta acá  
        else:
            serializer.save()
            return
        if iva == 0:
            serializer.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)       
        else:
            serializer.validated_data['precio'] = precio * Decimal(1+(iva/100)) #Actualizamos el serializer, ya que aun no tenemos guardado nuestro objeto serializer en la BD
            serializer.save() 
            return Response({'status': 'success'}, status=status.HTTP_200_OK)



class Update_iva_ice(generics.UpdateAPIView):
    serializer_class = VendeSerializer
    def update(self,request): #El self es necesario
        nuevo_iva = request.data.get("iva")

        #Actualizar todos los objetos vende
        Vende.objects.update(iva=nuevo_iva)

        #Lógica calculo de los precios con impuesto
        vendes = Vende.objects.all()
        boletos = Boleto.objects.all()
        for vende,boleto in zip(vendes,boletos): #Iterar sobre mas de un elemento
            precio_iva = vende.precio_actual * (1+(nuevo_iva/100))
            # Actualizar el campo precio en el objeto Boleto
            boleto.precio = precio_iva
            boleto.save()

        #Respuesta
        return Response({"message": "Impuestos actualizados correctamente"}, status=200)


        #Desglosar los datos que vienen de React a Django con el método PUT
        
        #data = json.loads(request.body)
        #nuevo_iva = data.get("iva")
        #nuevo_ice = data.get("ice")
        
        #Realizar la actualización (multiple registros)

        #Sirve si se quiere actualizar los campos de un solo registro

        #vende = Vende.objects.get(id_vende=id)
        #vende.iva = nuevo_iva
        #vende.ice = nuevo_ice
        #vende.save()


        
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

        try:
            is_password_strong(password)
        except ValidationError as e:
            return Response({'error': e.message if hasattr(e, 'message') else e.messages[0]}, status=400)

        # Validar Cedula
        if not cedula or not validar_cedula(cedula):
            return Response({'error': 'Cedula invalida'}, status=400)

        # Guardar el usuario sin confirmar
        user = serializer.save(confirmed=False)

        # Generar el token JWT para el usuario registrado
        payload = {
            'id': user.id_asistente,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'tu_clave_secreta', algorithm='HS256')

        # Enviar correo de confirmación con el token y enlace de confirmación
        subject = 'Confirmación de registro'
        confirmation_link = f'http://127.0.0.1:8000/confirmar/{token}'
        context = {'usuario_nombre': user.nombre, 'confirmation_link': confirmation_link}
        html_content = render(None, 'correo_registro.html', context).content.decode('utf-8')

        from_email = 'partyconnect069@gmail.com'
        to_email = [user.email]

        send_mail(subject, '', from_email, to_email, html_message=html_content)

        # Configurar la respuesta con el token
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
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

        # Enviar correo de confirmación al usuario utilizando la plantilla
        subject = 'Confirmación de correo electrónico exitosa'
        context = {'usuario_nombre': user.nombre}
        html_content = render(None, 'correo_confirmado.html', context).content.decode('utf-8')

        from_email = 'partyconnect069@gmail.com'  # Cambia esto al correo desde el cual deseas enviar el mensaje
        to_email = [user.email]

        send_mail(subject, '', from_email, to_email, html_message=html_content)

        # Devolver una respuesta con un mensaje de éxito
        return redirect('http://localhost:3000/correo-confirmado')

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
        
        if organizador.eliminado:
            raise AuthenticationFailed('Su cuenta fue desactivada')

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
            return super().get(request, *args, **kwargs) #Realiza la lógica y serializa el evento segun el argumento o id proporcionado
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
        contiene = Contiene.objects.get(id_contiene=id_contiene, num_orden__id_asistente=id_asistente)
    except Contiene.DoesNotExist:
        return HttpResponse('No se encontró el boleto específico para este asistente.', status=400)

    if request.method == 'POST':
        try:
            qr_image = ContieneQRViewSet().generate_qr_code(contiene)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return HttpResponse(f'Error al generar el código QR: {e}', status=500)

        subject = f'{asistente.nombre}, aquí está tu boleto'
        qr_image_base64 = base64.b64encode(qr_image.getvalue()).decode('utf-8')

        context = {
            'asistente_nombre': asistente.nombre,
            'mensaje': 'Gracias por realizar la compra. Adjunto encontrarás tu boleto específico.',
            'qr_image_base64': qr_image_base64,
        }

        try:
            html_content = render(None, 'correo_compra.html', context).content.decode('utf-8')

            from_email = 'partyconnect069@gmail.com'
            to_email = [asistente.email]

            email = EmailMessage(subject, html_content, from_email, to_email)
            email.content_subtype = 'html'
            email.attach(f'boleto_qr_{contiene.id_contiene}.png', qr_image.getvalue(), 'image/png')
            email.send()

            return HttpResponse(f'Correo enviado con éxito a {asistente.email}.')
        except Exception as e:
            import traceback
            traceback.print_exc()
            return HttpResponse(f'Error al enviar el correo a {asistente.email}: {e}', status=500)

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
       Administrador.objects.filter(ci=cedula).exists() or \
       Organizador.objects.filter(ci=cedula).exists():
        return {'existe': True}
    else:
        return {'existe': False}

class TotalGeneradoPorOrganizador(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('No inicio sesión correctamente')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('No inicio sesión')

        id_organizador = payload['id']
        try:
            organizador = Organizador.objects.get(pk=id_organizador)
        except Organizador.DoesNotExist:
            return Response({'error': 'Organizador no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        total = 0
        ventas = Vende.objects.filter(id_organizador=organizador.id_organizador)

        for venta in ventas:
            contiene_registros = Contiene.objects.filter(id_boleto=venta.id_boleto)
            for contiene in contiene_registros:
                orden = OrdenCompra.objects.get(num_orden=contiene.num_orden.num_orden)
                total += orden.valor_total

        return Response({'total_generado': total})

class TotalCantidadOrganizador(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('No inicio sesión correctamente')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('No inicio sesión')

        id_organizador = payload['id']
        try:
            organizador = Organizador.objects.get(pk=id_organizador)
        except Organizador.DoesNotExist:
            return Response({'error': 'Organizador no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        total_generado = 0
        ventas = Vende.objects.filter(id_organizador=organizador.id_organizador)

        for venta in ventas:
            contiene_registros = Contiene.objects.filter(id_boleto=venta.id_boleto)
            for contiene in contiene_registros:
                total_generado += contiene.cantidad_total

        return Response({'total_cantidad_generada': total_generado})

class CantidadSobranteOrg(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('No inició sesión correctamente')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('No inició sesión')

        id_organizador = payload['id']
        try:
            organizador = Organizador.objects.get(pk=id_organizador)
        except Organizador.DoesNotExist:
            return Response({'error': 'Organizador no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        total_generado = 0

        # Obtener la cantidad de boletos vendidos por boleto y por organizador
        ventas_por_boleto = Vende.objects.filter(id_organizador=organizador.id_organizador).values('id_boleto').annotate(total_boletos=Sum('stock_actual'))

        for venta in ventas_por_boleto:
            total_generado += venta['total_boletos']

        return Response({'total_sobrante': total_generado})

@api_view(['POST'])
def validate_qr_code(request):
    # Obtener el código escaneado desde los datos de la solicitud
    scanned_code = request.data.get('code')

    try:
        # Intentar obtener un objeto Contiene que coincida con el código escaneado
        contiene = Contiene.objects.get(boleto_cdg=scanned_code)

        # Si se encuentra, el código QR es válido, devolver una respuesta con estado 200
        return Response({'valid': True, 'details': contiene.id_contiene}, status=status.HTTP_200_OK)

    except Contiene.DoesNotExist:
        # Si no se encuentra, el código QR es inválido, devolver una respuesta con estado 400
        return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)

class CompraBoletoView(APIView):
    """
    Vista para manejar la compra de boletos y actualizar el límite del evento.
    """
    def post(self, request, *args, **kwargs):
        serializer = ContieneSerializer(data=request.data)
        if serializer.is_valid():
            contiene = serializer.save()

            # Obtener el evento relacionado y actualizar el límite
            evento = contiene.id_boleto.id_evento
            if evento.limite >= contiene.cantidad_total:
                evento.limite -= contiene.cantidad_total
                evento.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "No hay suficientes boletos disponibles."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventoList(generics.ListAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventSerializer

    def list(self, request, *args, **kwargs):
        # Filtrar por tipo, nombre, fecha (mes y año) si se proporcionan en los parámetros de la URL
        tipo = self.request.query_params.get('tipo', None)
        nombre = self.request.query_params.get('nombre', None)
        mes = self.request.query_params.get('mes', None)
        anio = self.request.query_params.get('anio', None)
        ordenamiento = self.request.query_params.get('ordenamiento', None)

        queryset = self.get_queryset()

        if tipo:
            queryset = queryset.filter(tipo=tipo)
        if nombre:
            queryset = queryset.filter(nombre_evento__icontains=nombre)
        if mes:
            queryset = queryset.filter(fecha__month=mes)
        if anio:
            queryset = queryset.filter(fecha__year=anio)
        
            # Ordenar por mes
        if ordenamiento == 'asc':
           queryset = queryset.order_by('fecha__month')
        elif ordenamiento == 'desc':
           queryset = queryset.order_by('-fecha__month')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
