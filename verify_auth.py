import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth():
    test_email = "Verify@Example.com"
    test_password = "Password123"
    
    # 1. Register a new user
    print(f"Registering user: {test_email}")
    reg_data = {
        "name": "Verify User",
        "email": test_email,
        "password": test_password
    }
    r = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
    print(f"Registration Status: {r.status_code}")
    print(f"Registration Response: {r.text}")
    
    if r.status_code != 200 and "already registered" not in r.text.lower():
        print("Registration failed")
        return

    # 2. Login with different casing
    login_variations = [
        test_email.lower(),
        test_email.upper(),
        test_email
    ]
    
    for email in login_variations:
        print(f"\nAttempting login with: {email}")
        login_data = {
            "email": email,
            "password": test_password
        }
        lr = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {lr.status_code}")
        if lr.status_code == 200:
            print(f"Login SUCCESS for {email}")
        else:
            print(f"Login FAILED for {email}")
            print(f"Response: {lr.text}")

if __name__ == "__main__":
    test_auth()
