import requests
import json

# Test registration endpoint
def test_register():
    url = "http://localhost:8000/api/auth/register/"
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
    print(f"Registration Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

# Test login endpoint
def test_login():
    url = "http://localhost:8000/api/auth/login/"
    data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    response = requests.post(url, json=data)
    print(f"Login Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

if __name__ == "__main__":
    print("Testing Registration...")
    test_register()
    print("\nTesting Login...")
    test_login()