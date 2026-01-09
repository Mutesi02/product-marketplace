import requests
import json

# Test registration
def test_register():
    url = "http://127.0.0.1:8000/auth/register/"
    data = {
        "username": "testuser",
        "email": "test@company.com",
        "password": "testpass123",
        "confirm_password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "company_name": "Test Company",
        "industry": "Technology",
        "company_size": "1-10"
    }
    
    response = requests.post(url, json=data)
    print("Register Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))
    return response.json()

# Test login
def test_login():
    url = "http://127.0.0.1:8000/auth/login/"
    data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    response = requests.post(url, json=data)
    print("Login Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))
    return response.json()

if __name__ == "__main__":
    print("Testing Authentication System...")
    print("=" * 50)
    
    # Test registration
    print("1. Testing Registration:")
    register_result = test_register()
    
    print("\n2. Testing Login:")
    login_result = test_login()