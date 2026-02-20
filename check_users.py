import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("--- Registered Users ---")
        cur.execute("SELECT id, name, email FROM users")
        users = cur.fetchall()
        if not users:
            print("No users found.")
        for r in users:
            print(f"ID: {r[0]}, Name: {r[1]}, Email: {r[2]}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
