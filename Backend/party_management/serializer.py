from rest_framework import serializers
from .models import *

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador #Never put comma here, you got an error just here because with comma the interpreter thinks it is a tuple
        fields = '__all__'
    
class VendeSerializer(serializers.ModelSerializer):
   class Meta:
      model=Vende
      fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
   class Meta:
      model=Administrador
      fields = '__all__'

class AsisSerializer(serializers.ModelSerializer):
   class Meta:
      model=Asistente
      fields = '__all__'

class EvenSerializer(serializers.ModelSerializer):
   class Meta:
      model=Evento
      fields = '__all__'

class OrdenSerializer(serializers.ModelSerializer):
   class Meta:
      model=OrdenCompra
      fields = '__all__'

class ContieneSerializer(serializers.ModelSerializer):
   class Meta:
      model=Contiene
      fields = '__all__'

class BoletoSerializer(serializers.ModelSerializer):
   class Meta:
      model=Boleto
      fields = '__all__'