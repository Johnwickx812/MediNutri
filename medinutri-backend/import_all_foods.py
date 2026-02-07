import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

# Connect to MongoDB
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]
foods_collection = db["foods"]

print("🔄 Starting food data import...")

# Clear existing data
print("🗑️  Clearing existing food data...")
foods_collection.delete_many({})

total_imported = 0

# ============================================
# 1. Import food_macros.csv (IFCT 2017 Indian Foods)
# ============================================
print("\n📦 Importing food_macros.csv (IFCT 2017)...")
try:
    df1 = pd.read_csv("../data/food_macros.csv")
    
    for _, row in df1.iterrows():
        food_doc = {
            "Food": row.get("food_name", "Unknown"),
            "food_code": row.get("food_code"),
            "food_group_nin": row.get("food_group_nin", "Other"),
            "calories": float(row.get("energy_kcal", 0)),
            "protein": float(row.get("protein_g", 0)),
            "carbs": float(row.get("carb_g", 0)),
            "fat": float(row.get("fat_g", 0)),
            "fiber": float(row.get("fibre_g", 0)),
            "calcium": float(row.get("calcium_mg", 0)),
            "iron": float(row.get("iron_mg", 0)),
            "serving_unit": row.get("servings_unit", "100g"),
            "source": "IFCT2017",
            # Add regional names if available
            "name_hindi": "",
            "name_tamil": "",
            "name_malayalam": ""
        }
        foods_collection.insert_one(food_doc)
        total_imported += 1
    
    print(f"✅ Imported {len(df1)} foods from food_macros.csv")
except Exception as e:
    print(f"❌ Error importing food_macros.csv: {e}")

# ============================================
# 2. Import food2.csv (USDA Database)
# ============================================
print("\n📦 Importing food2.csv (USDA Database)...")
try:
    df2 = pd.read_csv("../data/food2.csv")
    
    for _, row in df2.iterrows():
        food_doc = {
            "Food": row.get("Shrt_Desc", "Unknown"),
            "NDB_No": row.get("NDB_No"),
            "food_group_nin": "International",  # Default category
            "calories": float(row.get("Energ_Kcal", 0)),
            "protein": float(row.get("Protein_(g)", 0)),
            "carbs": float(row.get("Carbohydrt_(g)", 0)),
            "fat": float(row.get("Lipid_Tot_(g)", 0)),
            "fiber": float(row.get("Fiber_TD_(g)", 0)),
            "calcium": float(row.get("Calcium_(mg)", 0)),
            "iron": float(row.get("Iron_(mg)", 0)),
            "serving_unit": "100g",
            "source": "USDA",
            "name_hindi": "",
            "name_tamil": "",
            "name_malayalam": ""
        }
        foods_collection.insert_one(food_doc)
        total_imported += 1
    
    print(f"✅ Imported {len(df2)} foods from food2.csv")
except Exception as e:
    print(f"❌ Error importing food2.csv: {e}")

# ============================================
# 3. Import food3.csv (Indian Foods with Cost Data)
# ============================================
print("\n📦 Importing food3.csv (Indian Foods with Cost)...")
try:
    df3 = pd.read_csv("../data/food3.csv")
    
    for _, row in df3.iterrows():
        # Calculate calories from macros if not available
        protein = float(row.get("Protein (g)", 0))
        carbs = float(row.get("Carbohydrates (g)", 0))
        fats = float(row.get("Fats (g)", 0))
        
        # Approximate calories: Protein=4 cal/g, Carbs=4 cal/g, Fat=9 cal/g
        estimated_calories = (protein * 4) + (carbs * 4) + (fats * 9)
        
        food_doc = {
            "Food": row.get("Food Item", "Unknown"),
            "food_group_nin": row.get("Food Class", "Other"),
            "calories": estimated_calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fats,
            "fiber": 0.0,  # Not available in this dataset
            "calcium": 0.0,
            "iron": 0.0,
            "serving_unit": f"{row.get('Serving (g)', 100)}g",
            "serving_size": float(row.get("Serving (g)", 100)),
            "cost_inr": float(row.get("Cost (INR)", 0)),
            "protein_value": float(row.get("Protein Value For Money (g/INR)", 0)),
            "source": "ICMR",
            "name_hindi": "",
            "name_tamil": "",
            "name_malayalam": ""
        }
        foods_collection.insert_one(food_doc)
        total_imported += 1
    
    print(f"✅ Imported {len(df3)} foods from food3.csv")
except Exception as e:
    print(f"❌ Error importing food3.csv: {e}")

# ============================================
# Summary
# ============================================
print(f"\n✨ Import Complete!")
print(f"📊 Total foods imported: {total_imported}")
print(f"🗄️  Database: {DATABASE_NAME}")
print(f"📁 Collection: foods")

# Create indexes for faster search
print("\n🔍 Creating search indexes...")
foods_collection.create_index([("Food", 1)])
foods_collection.create_index([("food_group_nin", 1)])
print("✅ Indexes created successfully!")

client.close()
