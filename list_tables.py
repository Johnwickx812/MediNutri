import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("--- Public Tables ---")
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    for r in cur.fetchall():
        print(r[0])
    
    conn.close()

if __name__ == "__main__":
    main()
