import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("--- Semicolon ';' search ---")
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%;%' LIMIT 20")
    for r in cur.fetchall(): print(r[0])
    
    print("\n--- Slash '/' search ---")
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%/%' LIMIT 20")
    for r in cur.fetchall(): print(r[0])
    
    print("\n--- Bracket () search ---")
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%(%)%' LIMIT 20")
    for r in cur.fetchall(): print(r[0])
    
    conn.close()

if __name__ == "__main__":
    main()
