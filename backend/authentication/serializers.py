from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Business

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'industry', 'company_size', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'role', 'business', 'created_at', 'can_create_product', 'can_approve_product', 'can_manage_users']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    company_name = serializers.CharField()
    industry = serializers.CharField()
    company_size = serializers.CharField()
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'company_name', 'industry', 'company_size']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        # Extract business data
        validated_data.pop('confirm_password')
        business_data = {
            'name': validated_data.pop('company_name'),
            'industry': validated_data.pop('industry'),
            'company_size': validated_data.pop('company_size')
        }
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create business
        business = Business.objects.create(**business_data)
        
        # Create user profile as admin (first user of business)
        UserProfile.objects.create(
            user=user,
            business=business,
            role='admin'
        )
        
        return user