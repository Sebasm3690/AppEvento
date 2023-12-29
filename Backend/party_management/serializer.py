from rest_framework import serializers
from .models import *

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador #Never put comma here, you got an error just here because with comma the interpreter thinks it is a tuple
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'
    