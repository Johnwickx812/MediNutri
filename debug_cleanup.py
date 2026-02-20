import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
POSTGRES_URL = os.getenv("DATABASE_URL")

def debug():
    conn = psycopg2.connect(POSTGRES_URL)
    cur = conn.cursor()
    
    # 1. Hindi translations in brackets
    print("--- Hindi in brackets ---")
    cur.execute("SELECT food_name, name_hindi FROM foods WHERE food_name ~ '[\u0900-\u097F]' LIMIT 10")
    for r in cur.fetchall():
        print(f"EN: {r[0]} | HI_COL: {r[1]}")
        
    # 3. Separators
    print("\n--- Semicolons ---")
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%;%' LIMIT 10")
    for r in cur.fetchall(): print(r[0])
    
    print("\n--- Slashes ---")
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%/%' LIMIT 10")
    for r in cur.fetchall(): print(r[0])
        
    # 2. Duplicate looking items
    print("\n--- Potential redundancy (similar names) ---")
    cur.execute("""
        SELECT food_name, COUNT(*) 
        FROM foods 
        GROUP BY food_name 
        HAVING COUNT(*) > 1 
        LIMIT 10
    """)
    for r in cur.fetchall():
        print(f"Name: {r[0]} | Count: {r[1]}")
        
    conn.close()

if __name__ == "__main__":
    debug()
