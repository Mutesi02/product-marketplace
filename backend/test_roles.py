#!/usr/bin/env python3

import requests
import json

# Test role-based user registration
def test_role_registration():
    base_url = "http://localhost:8000/api/auth"
    
    # Test data for different roles
    test_users = [
        {
            "username": "admin_user",
            "email": "admin@testcompany.com",
            "password": "AdminPass123",
            "confirm_password": "AdminPass123",
            "first_name": "Admin",
            "last_name": "User",
            "company_name": "Test Company Admin",
            "industry": "Technology",
            "company_size": "11-50 employees",
            "role": "admin"
        },
        {
            "username": "editor_user", 
            "email": "editor@testcompany.com",
            "password": "EditorPass123",
            "confirm_password": "EditorPass123",
            "first_name": "Editor",
            "last_name": "User",
            "company_name": "Test Company Editor",
            "industry": "Healthcare",
            "company_size": "51-200 employees",
            "role": "editor"
        },
        {
            "username": "approver_user",
            "email": "approver@testcompany.com", 
            "password": "ApproverPass123",
            "confirm_password": "ApproverPass123",
            "first_name": "Approver",
            "last_name": "User",
            "company_name": "Test Company Approver",
            "industry": "Finance",
            "company_size": "201-1000 employees",
            "role": "approver"
        },
        {
            "username": "viewer_user",
            "email": "viewer@testcompany.com",
            "password": "ViewerPass123", 
            "confirm_password": "ViewerPass123",
            "first_name": "Viewer",
            "last_name": "User",
            "company_name": "Test Company Viewer",
            "industry": "Retail",
            "company_size": "1-10 employees",
            "role": "viewer"
        }
    ]
    
    print("Testing role-based user registration...")
    print("=" * 50)
    
    for user_data in test_users:
        print(f"\nTesting registration for {user_data['role']} role...")
        
        try:
            response = requests.post(
                f"{base_url}/register/",
                headers={"Content-Type": "application/json"},
                json=user_data
            )
            
            if response.status_code == 201:
                print(f"✅ {user_data['role']} user registered successfully")
                result = response.json()
                print(f"   User ID: {result.get('user', {}).get('id', 'N/A')}")
            else:
                print(f"❌ {user_data['role']} registration failed")
                print(f"   Status: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ Connection failed - make sure Django server is running on localhost:8000")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

def test_login_with_roles():
    base_url = "http://localhost:8000/api/auth"
    
    test_logins = [
        {"email": "admin@testcompany.com", "password": "AdminPass123", "expected_role": "admin"},
        {"email": "editor@testcompany.com", "password": "EditorPass123", "expected_role": "editor"},
        {"email": "approver@testcompany.com", "password": "ApproverPass123", "expected_role": "approver"},
        {"email": "viewer@testcompany.com", "password": "ViewerPass123", "expected_role": "viewer"}
    ]
    
    print("\nTesting login with different roles...")
    print("=" * 50)
    
    for login_data in test_logins:
        print(f"\nTesting login for {login_data['expected_role']}...")
        
        try:
            response = requests.post(
                f"{base_url}/login/",
                headers={"Content-Type": "application/json"},
                json={"email": login_data["email"], "password": login_data["password"]}
            )
            
            if response.status_code == 200:
                result = response.json()
                actual_role = result.get('user', {}).get('profile', {}).get('role', 'unknown')
                
                if actual_role == login_data['expected_role']:
                    print(f"✅ Login successful with correct role: {actual_role}")
                else:
                    print(f"⚠️  Login successful but role mismatch. Expected: {login_data['expected_role']}, Got: {actual_role}")
            else:
                print(f"❌ Login failed")
                print(f"   Status: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_role_registration()
    test_login_with_roles()