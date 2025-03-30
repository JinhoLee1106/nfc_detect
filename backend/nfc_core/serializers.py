from rest_framework import serializers
from .models import NFCTag

class NFCTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFCTag
        fields = '__all__'
