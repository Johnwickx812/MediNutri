
import pandas as pd
from pymongo import MongoClient, ASCENDING
import os
import requests
import io
import re
import csv
from dotenv import load_dotenv

load_dotenv()

# Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

# CSV File Paths
FOOD_CSV = "d:/medinutri-/data/food_macros.csv"
DRUG_CSV = "d:/medinutri-/data/Medicine_Details.csv"
INTERACTION_CSV = "d:/medinutri-/data/food_drug_interactions.csv"

def get_ifct_mappings():
    """Fetch IFCT 2017 local name mappings from unpkg."""
    url = "https://unpkg.com/@ifct2017/compositions/index.csv"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return {}
        f = io.StringIO(response.text)
        reader = csv.DictReader(f)
        mapping = {}
        for row in reader:
            code = row.get("Food Code; code")
            lang_str = row.get("Local Name; lang", "")
            if not code or not lang_str: continue
            
            trans = {}
            parts = lang_str.split(';')
            for part in parts:
                part = part.strip()
                match = re.match(r'^([A-Z][a-z]*\.)\s*(.*)$', part)
                if match:
                    prefix, name = match.group(1), match.group(2)
                    if prefix == "H.": trans['name_hindi'] = name
                    elif prefix in ["Mal.", "Malayalam."]: trans['name_malayalam'] = name
                    elif prefix in ["Tam.", "Tamil."]: trans['name_tamil'] = name
            mapping[code] = trans
        return mapping
    except Exception as e:
        print(f"Error fetching IFCT mappings: {e}")
        return {}

def import_data():
    try:
        client = MongoClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")

        # 1. Import Foods (Multilingual)
        if os.path.exists(FOOD_CSV):
            print(f"Reading {FOOD_CSV}...")
            df = pd.read_csv(FOOD_CSV, dtype=str).fillna("")
            
            cols = list(df.columns)
            code_col = cols[0]
            print(f"Detected Columns: {cols}")
            print(f"First 5 values in {code_col}: {df[code_col].head().tolist()}")
            df[code_col] = df[code_col].str.strip()
            
            mappings = get_ifct_mappings()
            print(f"Fetched {len(mappings)} localized mappings from IFCT")
            
            # Add translation columns
            for target_col in ['name_hindi', 'name_tamil', 'name_malayalam']:
                if target_col not in df.columns:
                    df[target_col] = ""

            # Populate translations
            mapped_count = 0
            for i, row in df.iterrows():
                code = str(row[code_col]).strip()
                if code == "C033":
                    print(f"DEBUG: Processing code C033. In mappings? {code in mappings}")
                if code in mappings:
                    m = mappings[code]
                    if code == "C033":
                        print(f"DEBUG: Mapping found for C033: {m}")
                    m = mappings[code]
                    if m.get('name_hindi'): 
                        df.at[i, 'name_hindi'] = m['name_hindi']
                    if m.get('name_tamil'): 
                        df.at[i, 'name_tamil'] = m['name_tamil']
                    if m.get('name_malayalam'): 
                        df.at[i, 'name_malayalam'] = m['name_malayalam']
                    mapped_count += 1
            
            print(f"Successfully mapped {mapped_count} foods with IFCT translations")

            # Standardize column names
            column_mapping = {
                'energy_kcal': 'calories',
                'protein_g': 'protein',
                'fat_g': 'fat',
                'fibre_g': 'fiber',
                'carb_g': 'carbs'
            }
            df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})

            food_col = 'food_name' if 'food_name' in df.columns else cols[1]
            df['Food'] = df[food_col]

            for col in ['calories', 'protein', 'fat', 'fiber', 'carbs']:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

            records = df.to_dict('records')
            db.foods.drop()
            if records:
                db.foods.insert_many(records)
                print(f"✅ Imported {len(records)} foods")
                
                # Multiple indexes for multilingual search
                db.foods.create_index([("Food", ASCENDING)])
                db.foods.create_index([("name_hindi", ASCENDING)])
                db.foods.create_index([("name_tamil", ASCENDING)])
                db.foods.create_index([("name_malayalam", ASCENDING)])
                print("✅ Created indices for multilingual food search")
        else:
            print(f"❌ Food CSV not found at {FOOD_CSV}")

        # 2. Import Drugs
        if os.path.exists(DRUG_CSV):
            drugs_df = pd.read_csv(DRUG_CSV, dtype=str).fillna("")
            drugs_records = drugs_df.to_dict('records')
            db.drugs.drop()
            if drugs_records:
                CHUNK_SIZE = 1000
                total_inserted = 0
                for i in range(0, len(drugs_records), CHUNK_SIZE):
                    chunk = drugs_records[i : i + CHUNK_SIZE]
                    db.drugs.insert_many(chunk)
                    total_inserted += len(chunk)
                print(f"✅ Imported {total_inserted} drugs")
                db.drugs.create_index([("Medicine Name", ASCENDING)])
        
        # 3. Import Interactions
        if os.path.exists(INTERACTION_CSV):
            interactions_df = pd.read_csv(INTERACTION_CSV, dtype=str).fillna("")
            interactions_records = interactions_df.to_dict('records')
            db.food_drug_interactions.drop()
            if interactions_records:
                db.food_drug_interactions.insert_many(interactions_records)
                print(f"✅ Imported {len(interactions_records)} interactions")
                db.food_drug_interactions.create_index([("food_name", ASCENDING), ("drug_name", ASCENDING)])

    except Exception as e:
        print(f"❌ Error during import: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    import_data()
