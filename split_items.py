import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
POSTGRES_URL = os.getenv("DATABASE_URL")

def split_composite_items():
    conn = psycopg2.connect(POSTGRES_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    print("Finding composite items with '/'...")
    cur.execute("SELECT * FROM foods WHERE food_name LIKE '%/%'")
    rows = cur.fetchall()
    print(f"Found {len(rows)} items with '/'")
    
    additions = 0
    deletions = 0
    
    for r in rows:
        name = r['food_name']
        # If it has a slash, split it
        # e.g. "Apple / Orange Juice" -> "Apple Juice", "Orange Juice"
        # Since logic to split "Apple / Orange Juice" into "Apple Juice" is complex,
        # we'll do a simple split: "A / B" becomes "A" and "B".
        
        parts = [p.strip() for p in name.split('/')]
        if len(parts) > 1:
            # We treat them as independent items with the same nutrition
            for p in parts:
                if len(p) < 2: continue # Skip single chars
                cur.execute("""
                    INSERT INTO foods (food_name, name_hindi, name_tamil, name_malayalam, calories, protein, carbs, fat, fiber, food_group)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (p, r['name_hindi'], r['name_tamil'], r['name_malayalam'], 
                      r['calories'], r['protein'], r['carbs'], r['fat'], r['fiber'], r['food_group']))
                additions += 1
            
            cur.execute("DELETE FROM foods WHERE id = %s", (r['id'],))
            deletions += 1

    conn.commit()
    print(f"Split {deletions} composite rows into {additions} individual items.")
    conn.close()

if __name__ == "__main__":
    split_composite_items()
