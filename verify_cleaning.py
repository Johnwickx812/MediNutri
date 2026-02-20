import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("--- Cleaned Results Check ---")
    # Checking our example
    cur.execute("SELECT food_name FROM foods WHERE food_name ILIKE '%Sesame%' AND food_name ILIKE '%Rice Cake%' LIMIT 5")
    for r in cur.fetchall(): print(f"Result: {r[0]}")
    
    print("\n--- More Cleaned examples ---")
    cur.execute("SELECT food_name FROM foods ORDER BY id ASC LIMIT 10")
    for r in cur.fetchall(): print(f"Result: {r[0]}")
    
    conn.close()

if __name__ == "__main__":
    main()
