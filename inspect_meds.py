import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("--- Medication Sample Data ---")
    cur.execute("SELECT medicine_name, uses, category FROM medications LIMIT 20")
    for r in cur.fetchall():
        print(f"Name: {r[0]} | Uses: {r[1]} | Category: {r[2]}")
    
    conn.close()

if __name__ == "__main__":
    main()
