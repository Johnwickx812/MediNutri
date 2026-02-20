import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import re

load_dotenv('medinutri-backend/.env')
POSTGRES_URL = os.getenv("DATABASE_URL")

def get_db():
    return psycopg2.connect(POSTGRES_URL)

def analyze_names():
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Samples with likely multiple items
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%&%' OR food_name ILIKE '% and %' LIMIT 20")
    print("Items with & or AND:")
    for r in cur.fetchall():
        print(f"- {r['food_name']}")
        
    cur.execute("SELECT food_name FROM foods WHERE food_name LIKE '%,%' LIMIT 20")
    print("\nItems with commas:")
    for r in cur.fetchall():
        print(f"- {r['food_name']}")
        
    cur.execute("SELECT food_name FROM foods WHERE length(food_name) > 60 LIMIT 20")
    print("\nVery long names:")
    for r in cur.fetchall():
        print(f"- {r['food_name']}")
        
    conn.close()

if __name__ == "__main__":
    analyze_names()
