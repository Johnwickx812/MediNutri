import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import re

load_dotenv('medinutri-backend/.env')
POSTGRES_URL = os.getenv("DATABASE_URL")

def deep_clean_names():
    conn = psycopg2.connect(POSTGRES_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    print("Normalizing synonyms and formatting...")
    cur.execute("SELECT id, food_name FROM foods")
    rows = cur.fetchall()
    
    replacements = {
        r'\bWith Salt\b': 'Salted',
        r'\bW Salt\b': 'Salted',
        r'\bNo Salt\b': 'Unsalted',
        r'\bW/O Salt\b': 'Unsalted',
        r'\bLow Fat\b': 'Light',
        r'\bFluid\b': '',
        r'\bRaw\b': '(Raw)',
        r'\bCooked\b': '(Cooked)',
    }
    
    updates = 0
    for r in rows:
        name = r['food_name']
        for pattern, repl in replacements.items():
            name = re.sub(pattern, repl, name, flags=re.IGNORECASE)
        
        name = " ".join(name.split()).title()
        # Ensure (Raw) or (Cooked) at the end
        if "(Raw)" in name: name = name.replace("(Raw)", "").strip() + " (Raw)"
        if "(Cooked)" in name: name = name.replace("(Cooked)", "").strip() + " (Cooked)"
        
        if name != r['food_name']:
            cur.execute("UPDATE foods SET food_name = %s WHERE id = %s", (name, r['id']))
            updates += 1
            
    conn.commit()
    print(f"Updated {updates} names with synonyms.")
    
    # Deduplicate based on name + nutrition
    print("Deleting redundant rows with same name and nutrition...")
    cur.execute("""
        DELETE FROM foods a USING foods b
        WHERE a.id > b.id 
        AND LOWER(a.food_name) = LOWER(b.food_name) 
        AND ABS(a.calories - b.calories) < 0.1
        AND ABS(a.protein - b.protein) < 0.1
    """)
    print(f"Deleted {cur.rowcount} near-duplicate rows.")
    
    # Split composite items if they are clearly separate (e.g. Milk / Cheese)
    # But only if it's safe. For now, let's keep it simple as composite names are common in USDA.
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    deep_clean_names()
