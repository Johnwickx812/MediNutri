import requests
import json

url = "http://localhost:8000/api/feedback"
data = {
    "name": "Antigravity Test",
    "email": "medinutriofficial@gmail.com",
    "subject": "System Verification",
    "message": "This is a test message to verify the email system."
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
