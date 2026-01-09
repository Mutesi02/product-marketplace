#!/usr/bin/env python
import os
import django
import sys

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from authentication.models import Business, UserProfile

def create_test_user():
    """Create a test user with email as username"""
    email = "admin@test.com"
    password = "admin123"
    
    # Delete existing user if exists
    User.objects.filter(username=email).delete()
    
    # Create user with email as username
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name="Admin",
        last_name="User"
    )
    
    # Create business
    business, created = Business.objects.get_or_create(
        name="Test Company",
        defaults={
            'industry': 'Technology',
            'company_size': '10-50'
        }
    )
    
    # Create user profile
    profile, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            'business': business,
            'role': 'admin'
        }
    )
    
    print(f"Created user: {email} / {password}")
    print(f"Business: {business.name}")
    print(f"Role: {profile.role}")
    
    # Test authentication
    auth_user = authenticate(username=email, password=password)
    if auth_user:
        print("✓ Authentication successful")
    else:
        print("✗ Authentication failed")

if __name__ == "__main__":
    create_test_user()