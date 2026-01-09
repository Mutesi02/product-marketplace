import requests
import json

# Test role-based dashboard access
def test_dashboard_access():
    base_url = "http://localhost:8000/api/auth"
    
    # First, login to get token
    login_data = {
        "username": "testuser",  # Replace with actual username
        "password": "testpass123"  # Replace with actual password
    }
    
    print("Testing Dashboard Access...")
    
    # Login
    login_response = requests.post(f"{base_url}/login/", json=login_data)
    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data['access']
        
        # Set authorization header
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        print(f"Login successful. User role: {token_data['user']['profile']['role']}")
        
        # Test general dashboard endpoint (auto-routes based on role)
        dashboard_response = requests.get(f"{base_url}/dashboard/", headers=headers)
        print(f"Dashboard Status: {dashboard_response.status_code}")
        if dashboard_response.status_code == 200:
            dashboard_data = dashboard_response.json()
            print(f"Dashboard Type: {dashboard_data['dashboard_type']}")
            print(f"Permissions: {dashboard_data['permissions']}")
        else:
            print(f"Dashboard Error: {dashboard_response.json()}")
        
        # Test specific role dashboards
        role_endpoints = ['admin', 'editor', 'approver', 'viewer']
        
        for role in role_endpoints:
            role_response = requests.get(f"{base_url}/dashboard/{role}/", headers=headers)
            print(f"{role.title()} Dashboard: {role_response.status_code}")
            if role_response.status_code != 200:
                error_data = role_response.json()
                print(f"  Error: {error_data.get('error', 'Unknown error')}")
    
    else:
        print(f"Login failed: {login_response.json()}")

if __name__ == "__main__":
    test_dashboard_access()