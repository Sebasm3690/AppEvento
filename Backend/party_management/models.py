from django.db import models

# Create your models here.
class Organizador(models.Model):
    id_organizador = models.AutoField(primary_key=True)
    id_admin = models.ForeignKey("Administrador", on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)
    correo = models.CharField(max_length=25)
    constrasenia = models.CharField(max_length=15)
    def __str__(self):
        return f"{self.id_organizador}{self.id_admin}{self.nombre}{self.apellido}{self.ci}{self.correo}{self.constrasenia}"


class Vende(models.Model):
    id_boleto = models.OneToOneField("Organizador", primary_key=True, on_delete=models.CASCADE, related_name='vende_boleto')
    id_organizador = models.ForeignKey("Organizador", on_delete=models.CASCADE, related_name='vende_organizador')
    iva = models.FloatField()
    descuento = models.FloatField()
    ice = models.FloatField()
    def __str__(self):
        return f"{self.id_boleto} {self.id_organizador} {self.iva} {self.descuento} {self.ice}"
    
class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)
    def __str__(self):
        return f"{self.id_admin} {self.nombre} {self.apellido} {self.ci}"

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
    def __str__(self):
        return f"{self.id_evento}{self.id_organizador}{self.nombre_evento}{self.fecha}{self.hora}{self.ubicacion}{self.descripcion}{self.tipo}{self.limite}"

class Asistente(models.Model):
    id_asistente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    correo = models.CharField(max_length=25)
    contrasenia = models.CharField(max_length=50)
    ci = models.CharField(max_length=10)
    def __str__(self):
        return f"{self.id_asistente} {self.nombre} {self.apellido} {self.correo} {self.ci}" 


class OrdenCompra(models.Model):
    num_orden = models.AutoField(primary_key=True)
    id_asistente = models.ForeignKey("Asistente", on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    valor_total = models.FloatField()
    def __str__(self):
        return f"{self.num_orden}{self.id_asistente}{self.fecha}{self.valor_total}"
    

class Contiene(models.Model):
    id_boleto = models.OneToOneField("OrdenCompra", primary_key=True, on_delete=models.CASCADE)
    num_orden = models.IntegerField()
    cantidad_total = models.IntegerField()
    def __str__(self):
        return f"{self.id_boleto}{self.num_orden}{self.cantidad_total}"

class Boleto(models.Model):
    id_boleto = models.AutoField(primary_key=True)
    stock = models.BooleanField()
    tipo = models.CharField(max_length=15)
    precio = models.FloatField()
    def __str__(self):
        return f"{self.id_boleto}{self.stock}{self.tipo}{self.precio}"

