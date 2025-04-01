from rest_framework import serializers
from .models import NFCTag

class NFCTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFCTag
        fields = '__all__'
        read_only_fields = ['tag_id', 'auth_hash', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        instance.user_name = validated_data.get('user_name', instance.user_name)
        instance.user_role = validated_data.get('user_role', instance.user_role)
        instance.save()
        return instance
