from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser
#--> Migration <-- 
# Are a feature that basically define steps for Django to execute
# Steps that will touch the database and manipulate it (For creating new tables or manipulating existing tables)

#------------------------------------------------------------------------------------------
# We need to execute this command in our main folder "python3 manage.py makemigrations"
# And we have to execute the command "python manage.py migrate" -> Tell Django to have a look at all files in migrations folders and all apps and run all migrations that haven't been executed yet
# After that db.sqlite3 will now contain the database setup which was created based on all migrations

#-> We have to have installed the postgres controller with this command "pip install psycopg2.9.6" or "pip install psycopg2-binary or "pip install psycopg2==2.9.1" or "pip install psycopg2-binary==2.9.1"

#Other commands used in command prompt to run Migration
# python -m venv venv
# venv\Scripts\activate
# pip install django
# python
# import sys

# And finally in the termain on VS "python manage.py shell"

#-------------------------------------------------------------------------------------------


# --> ORM <--

# We have to put this coomand "python3 manage.py shell" -> Interactive Python interpreter (To work wit this Django project and then also work with the database that belongs to it)
# from party_management.models import Asistente

# -->  SAVE (INSERT)  <--

# The databse is not touched yet, this just creates an object in Python ands stores it in a variable

# Pepito = Asistente(nombre="Pepito",apellido="Perez",correo="pepitoperez@espoch.edu.ec",contrasenia="pepito123",ci="0604312546")
# Pepito.save()   With this you put the insert into the database

#--> CREATE INSTEAD OF SAVE (INSERT) <--

#Asistente.objects.create(nombre="Hanz",apellido="Karl",correo="hanzkarl@gmail.com",contrasenia="hanz123",ci=0704315795)


# --> SELECT <--

# object inherit from the model class
# Also we need the methods in each class to show the class data in a better way

# Asistente.object.all()


# --> SELECT * FROM WHERE <--

# Asistente.objects.get(id_asistente=3)
# Vende.objects.filter(descuento=25)  #filter returns multyple values
# --> If is lower greater, etc or contains some element (is case sensitive with elements) <--
# Book.objects.filter(rating__lt=3) #lower than 3
# Asistente.objects.filter(nombre__contains="Hanz")

# OR 

# from django.db.models import Q
# Asistente.objects.filter(Q(nombre="Hanz") | Q(nombre="Carlos")) #We can delete the last Q in this case the Q of Carlos

# AND

# The same that above but whit "," insted of "|"

# -->  UPDATE  <--

# When you call save on an object that already existis in a database it will not create a new entry, but instead update the existing entry 
# This only happen if the object doesn't exist, otherwise Django creates a new object

# Pepito = Asistente.objects.all()[0]
# Pepito.correo = "pepitoperez@gmail.com"
# Pepito.save()
# Asistente.objects.all()  -> Ver el resultado

#--> DELETE DATA <--

# Is like save, but with delete, you delete the class

# Pepito = Asistente.objects.all[0]
# Pepito.delete()

#--> Query perfomance 

# ** bestsellers = Book.objects.filter(is_bestselling=True) -> The database is not hit by Django, the variable only stores the query definition

# If you do something with your queries sets, the database will be hit

# ** print(bestsellers)  -> The database will be hit (Django goes to the database and run the query ) (If I run this code twice Django reuses chashed results and will no go to the database)

#--> Conclusion --> Is better to store queries in variables to avoid to hit more than once the database


# Create your models here.

class Organizador(models.Model):
    id_organizador = models.AutoField(primary_key=True)
    id_admin = models.ForeignKey("Administrador", on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10,unique=True)
    correo = models.CharField(max_length=25,unique=True)
    contrasenia = models.CharField(max_length=15)
    eliminado = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.id_organizador}{self.id_admin}{self.nombre}{self.apellido}{self.ci}{self.correo}{self.contrasenia}"


class Vende(models.Model):
    id_boleto = models.OneToOneField("Boleto", primary_key=True, on_delete=models.CASCADE, related_name='vende_boleto')
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
    ci = models.CharField(max_length=10,unique=True)

    def __str__(self):
        return f"{self.id_admin} {self.nombre} {self.apellido} {self.ci}"

class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    id_organizador = models.ForeignKey("Organizador", on_delete=models.CASCADE)
    nombre_evento = models.CharField(max_length=50,unique=True)
    fecha = models.DateTimeField(auto_now_add=True)
    hora = models.TimeField()
    ubicacion = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10)
    limite = models.IntegerField()
    #image = models.ImageField(upload_to="images/") #It'll go into a subfolder of our uploads folder named images #UPLOAD IMAGE #2
    def __str__(self):
        return f"{self.id_evento} {self.id_organizador} {self.nombre_evento} {self.fecha} {self.hora} {self.ubicacion} {self.descripcion} {self.tipo} {self.limite}"

class Asistente(AbstractUser):
    id_asistente = models.AutoField(primary_key=True)
    username = None
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.CharField(max_length=25,unique=True)
    password = models.CharField(max_length=50)
    ci = models.CharField(max_length=10,unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    #I don't have to run migrations again because I just added a method (I don't change the structure or the fields of my class)
    def __str__(self):
        return f"{self.id_asistente} {self.nombre} {self.apellido} {self.email} {self.ci}" #With this you can show the elements of the class in a better way


class OrdenCompra(models.Model):
    num_orden = models.AutoField(primary_key=True)
    id_asistente = models.ForeignKey("Asistente", on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    valor_total = models.FloatField()
    def __str__(self):
        return f"{self.num_orden}{self.id_asistente}{self.fecha}{self.valor_total}"
    

class Contiene(models.Model):
    id_boleto = models.OneToOneField("Boleto", primary_key=True, on_delete=models.CASCADE)
    num_orden = models.ForeignKey("OrdenCompra", on_delete=models.CASCADE)
    cantidad_total = models.IntegerField()
    def __str__(self):
        return f"{self.id_boleto}{self.num_orden}{self.cantidad_total}"

class Boleto(models.Model):
    id_boleto = models.AutoField(primary_key=True)
    stock = models.IntegerField()
    tipo = models.CharField(max_length=15)
    precio = models.FloatField()
    def __str__(self):
        return f"{self.id_boleto}{self.stock}{self.tipo}{self.precio}"
    #->Add another field (Alter)
    #Django does not accept null values

    # python3 manage.py majemigrations
    #exlusividad = models.IntegerField(validators=[null=True,MinValueValidator(1),MaxValueValidator(5)])
