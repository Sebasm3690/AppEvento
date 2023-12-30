from rest_framework import serializers
from .models import *

#Agregando serializer para cada entidad en la base de datos

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
      extra_kwargs = {
         'password': {'write_only': True}
      }
      
      def create(self, validated_data):
         password = validated_data.pop('password', None)
         instance = self.Meta.model(**validated_data)
         if password is not None:
            instance.set_password(password)
         instance.save()
         return instance

class EventSerializer(serializers.ModelSerializer):
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

class TicketSerializer(serializers.ModelSerializer):
   class Meta:
      model=Boleto
      fields = '__all__'