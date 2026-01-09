from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    business_name = serializers.CharField(source='business.business.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'status', 'created_by', 'created_by_name', 'business', 'business_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'business', 'created_at', 'updated_at']

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price']
        
    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'profile'):
            raise serializers.ValidationError('User profile not found')
        validated_data['created_by'] = user
        validated_data['business'] = user.profile
        return super().create(validated_data)