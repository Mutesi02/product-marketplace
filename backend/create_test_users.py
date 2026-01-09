#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.models import Business, UserProfile

def create_test_users():
    # Create a test business
    business, created = Business.objects.get_or_create(
        name="Test Company",
        defaults={
            'industry': 'Technology',
            'company_size': '50-100'
        }
    )
    
    # Test users data
    test_users = [
        {'username': 'admin', 'email': 'admin@test.com', 'role': 'admin', 'first_name': 'Admin', 'last_name': 'User'},
        {'username': 'editor', 'email': 'editor@test.com', 'role': 'editor', 'first_name': 'Editor', 'last_name': 'User'},
        {'username': 'approver', 'email': 'approver@test.com', 'role': 'approver', 'first_name': 'Approver', 'last_name': 'User'},
        {'username': 'viewer', 'email': 'viewer@test.com', 'role': 'viewer', 'first_name': 'Viewer', 'last_name': 'User'},
    ]
    
    for user_data in test_users:
        # Create or get user
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name']
            }
        )
        
        if created:
            user.set_password('password123')  # Set a simple password
            user.save()
            print(f"Created user: {user.username}")
        
        # Create or update profile
        profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'business': business,
                'role': user_data['role']
            }
        )
        
        if profile_created:
            print(f"Created profile for {user.username} with role: {user_data['role']}")
        else:
            profile.role = user_data['role']
            profile.save()
            print(f"Updated profile for {user.username} with role: {user_data['role']}")

if __name__ == '__main__':
    create_test_users()
    print("\nTest users created successfully!")
    print("Login credentials:")
    print("Admin: admin@test.com / password123")
    print("Editor: editor@test.com / password123") 
    print("Approver: approver@test.com / password123")
    print("Viewer: viewer@test.com / password123")