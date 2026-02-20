import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import re

load_dotenv('medinutri-backend/.env')
POSTGRES_URL = os.getenv("DATABASE_URL")

ABBREVIATIONS = {
    r'\bSd\b': 'Seed',
    r'\bCrl\b': 'Cereal',
    r'\bW/\b': 'With',
    r'\bW/O\b': 'Without',
    r'\bLgt\b': 'Light',
    r'\bPln\b': 'Plain',
    r'\bWhl\b': 'Whole',
    r'\bHydr\b': 'Hydrogenated',
    r'\bSoybn\b': 'Soybean',
    r'\bCttnsd\b': 'Cottonseed',
    r'\bCkd\b': 'Cooked',
    r'\bVeg\b': 'Vegetable',
    r'\bCond\b': 'Condensed',
    r'\bUnsw\b': 'Unsweetened',
    r'\bSwt\b': 'Sweetened',
    r'\bFlav\b': 'Flavored',
    r'\bPrep\b': 'Prepared',
    r'\bFroz\b': 'Frozen',
    r'\bConc\b': 'Concentrated',
    r'\bH2O\b': 'Water',
    r'\bBev\b': 'Beverage',
    r'\bIntstd\b': 'Interesterified',
    r'\bBttrmlk\b': 'Buttermilk',
    r'\bCrm\b': 'Cream',
    r'\bLowfat\b': 'Low Fat',
    r'\bNonfat\b': 'Non Fat',
    r'\bLn\b': 'Lean',
    r'\bReg\b': 'Regular',
    r'\bEnr\b': 'Enriched',
    r'\bUnenr\b': 'Unenriched',
    r'\bFlr\b': 'Flour',
    r'\bVits\b': 'Vitamins',
    r'\bDry\b': 'Dried',
    r'\bPDR\b': 'Powder',
}

def naturalize_name(name):
    if not name: return name
    
    # 1. Clean translations in brackets (e.g. "Bread (Roti)")
    # Extract Hindi if present
    hindi_part = re.findall(r'[\u0900-\u097F]+', name)
    name = re.sub(r'\s*\([^)]*[\u0900-\u097F][^)]*\)', '', name)
    name = re.sub(r'[\u0900-\u097F]+', '', name).strip()
    
    # 2. Reorder commas
    if "," in name:
        parts = [p.strip() for p in name.split(",")]
        # Category is usually first. Move it to the end.
        main_item = parts[0]
        details = parts[1:]
        if details:
            name = f"{' '.join(details)} {main_item}"
        else:
            name = main_item

    # 3. Expand Abbreviations
    for abbr, full in ABBREVIATIONS.items():
        name = re.sub(abbr, full, name, flags=re.IGNORECASE)
        
    # 4. Clean up special characters & spaces
    name = name.replace("&", "And").replace("/", " / ")
    name = " ".join(name.split()) # Dedup spaces
    
    # 5. Remove word redundancy (e.g. "Brown Rice Rice")
    words = name.split()
    seen = []
    for w in words:
        if w.lower() not in [x.lower() for x in seen]:
            seen.append(w)
    name = " ".join(seen)
    
    return name.strip().title()

def clean_database():
    conn = psycopg2.connect(POSTGRES_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    print("Fetching foods...")
    cur.execute("SELECT id, food_name, name_hindi FROM foods")
    rows = cur.fetchall()
    print(f"Loaded {len(rows)} foods.")
    
    updates = 0
    for r in rows:
        old_name = r['food_name']
        new_name = naturalize_name(old_name)
        
        if old_name != new_name:
            cur.execute("UPDATE foods SET food_name = %s WHERE id = %s", (new_name, r['id']))
            updates += 1
            if updates % 1000 == 0:
                print(f"Updated {updates} names...")
    
    conn.commit()
    print(f"Done! Cleaned {updates} food names.")
    
    # De-duplicate rows with same name and nutrition
    print("Deduplicating perfectly matching rows...")
    cur.execute("""
        DELETE FROM foods a USING foods b
        WHERE a.id > b.id 
        AND a.food_name = b.food_name 
        AND a.calories = b.calories 
        AND a.protein = b.protein
        AND a.carbs = b.carbs
    """)
    print(f"Deleted {cur.rowcount} redundant rows.")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    clean_database()
