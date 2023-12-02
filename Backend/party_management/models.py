from django.db import models

#--> Migration <-- 
# Are a feature that basically define steps for Django to execute
# Steps that will touch the database and manipulate it (For creating new tables or manipulating existing tables)

# We need to execute this command in our main folder "python3 manage.py makemigrations"

# Create your models here.

class Organizador(models.Model):
    id_organizador = models.AutoField(primary_key=True)
    id_admin = models.ForeignKey("Administrador", on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)
    correo = models.CharField(max_length=25)
    constrasenia = models.CharField(max_length=15)

class Vende(models.Model):
    id_boleto = models.OneToOneField("Organizador", primary_key=True, on_delete=models.CASCADE, related_name='vende_boleto')
    id_organizador = models.ForeignKey("Organizador", on_delete=models.CASCADE, related_name='vende_organizador')
    iva = models.FloatField()
    descuento = models.FloatField()
    ice = models.FloatField()

    
class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)

class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    id_organizador = models.ForeignKey("Organizador", on_delete=models.CASCADE)
    nombre_evento = models.CharField(max_length=50)
    fecha = models.DateTimeField(auto_now_add=True)
    hora = models.CharField(max_length=8)
    ubicacion = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10)
    limite = models.IntegerField()

class Asistente(models.Model):
    id_asistente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    correo = models.CharField(max_length=25)
    contrasenia = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)

class OrdenCompra(models.Model):
    num_orden = models.AutoField(primary_key=True)
    id_asistente = models.ForeignKey("Asistente", on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    valor_total = models.FloatField()

class Contiene(models.Model):
    id_boleto = models.OneToOneField("OrdenCompra", primary_key=True, on_delete=models.CASCADE)
    num_orden = models.IntegerField()
    cantidad_total = models.IntegerField()

class Boleto(models.Model):
    id_boleto = models.AutoField(primary_key=True)
    stock = models.BooleanField()
    tipo = models.CharField(max_length=15)
    precio = models.FloatField()