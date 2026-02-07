"""
Medical-Grade Drug Side Effects Import Script
Imports comprehensive drug information including side effects, ratings, and medical conditions
"""
import pandas as pd
from pymongo import MongoClient, ASCENDING, TEXT
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

# Connect to MongoDB
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

print("💊 MEDICAL-GRADE DRUG SIDE EFFECTS IMPORT")
print("=" * 70)

def extract_side_effects(side_effects_text):
    """Parse side effects text into structured categories"""
    if pd.isna(side_effects_text) or not side_effects_text:
        return {
            "severe": [],
            "common": [],
            "all_text": ""
        }
    
    text = str(side_effects_text)
    severe = []
    common = []
    
    # Extract severe/serious side effects
    severe_patterns = [
        r'serious (?:side effects|drug reaction)[:\s]*([^\.]+)',
        r'Call your doctor at once if you have[:\s]*([^\.]+)',
        r'severe ([^;\.]+)',
        r'emergency medical help[^:]*:([^\.]+)'
    ]
    
    for pattern in severe_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            # Split by common delimiters
            items = re.split(r'[;,]|\sor\s', match)
            severe.extend([item.strip() for item in items if item.strip() and len(item.strip()) > 3])
    
    # Extract common side effects
    common_patterns = [
        r'Common[^:]*side effects[^:]*:([^\.]+)',
        r'may include[:\s]*([^\.]+)'
    ]
    
    for pattern in common_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            items = re.split(r'[;,]|\sor\s', match)
            common.extend([item.strip() for item in items if item.strip() and len(item.strip()) > 3])
    
    # Remove duplicates while preserving order
    severe = list(dict.fromkeys(severe))[:10]  # Limit to top 10
    common = list(dict.fromkeys(common))[:10]
    
    return {
        "severe": severe,
        "common": common,
        "all_text": text[:1000]  # Store first 1000 chars for full reference
    }

# Import Drug Side Effects
print("\n💊 Importing Drug Side Effects Data...")
try:
    df = pd.read_csv("../data/drugs_side_effects_drugs_com.csv")
    
    print(f"📊 Total drugs in dataset: {len(df)}")
    
    # Clear existing data
    db.drug_side_effects.delete_many({})
    print("🗑️  Cleared existing drug side effects data")
    
    # Prepare records
    drugs_data = []
    condition_stats = {}
    rating_stats = {"high": 0, "medium": 0, "low": 0}
    
    for idx, row in df.iterrows():
        # Parse side effects
        side_effects = extract_side_effects(row.get('side_effects'))
        
        # Get rating
        try:
            rating = float(row.get('rating', 0)) if pd.notna(row.get('rating')) else 0
        except:
            rating = 0
        
        # Get number of reviews
        try:
            num_reviews = float(row.get('no_of_reviews', 0)) if pd.notna(row.get('no_of_reviews')) else 0
        except:
            num_reviews = 0
        
        # Track rating stats
        if rating >= 7:
            rating_stats["high"] += 1
        elif rating >= 5:
            rating_stats["medium"] += 1
        else:
            rating_stats["low"] += 1
        
        # Track conditions
        condition = str(row.get('medical_condition', 'Unknown'))
        condition_stats[condition] = condition_stats.get(condition, 0) + 1
        
        drug_record = {
            # Basic Info
            "drug_name": str(row.get('drug_name', '')).strip(),
            "generic_name": str(row.get('generic_name', '')).strip() if pd.notna(row.get('generic_name')) else "",
            "brand_names": str(row.get('brand_names', '')).strip() if pd.notna(row.get('brand_names')) else "",
            
            # Medical Condition
            "medical_condition": condition,
            "medical_condition_description": str(row.get('medical_condition_description', ''))[:500] if pd.notna(row.get('medical_condition_description')) else "",
            
            # Side Effects
            "side_effects_severe": side_effects["severe"],
            "side_effects_common": side_effects["common"],
            "side_effects_full": side_effects["all_text"],
            
            # Classification
            "drug_classes": str(row.get('drug_classes', '')).strip() if pd.notna(row.get('drug_classes')) else "",
            "rx_otc": str(row.get('rx_otc', '')).strip() if pd.notna(row.get('rx_otc')) else "",
            "pregnancy_category": str(row.get('pregnancy_category', '')).strip() if pd.notna(row.get('pregnancy_category')) else "",
            "alcohol_warning": str(row.get('alcohol', '')).strip() if pd.notna(row.get('alcohol')) else "",
            
            # User Ratings
            "rating": rating,
            "num_reviews": num_reviews,
            "activity": str(row.get('activity', '')).strip() if pd.notna(row.get('activity')) else "",
            
            # Search optimization
            "drug_name_lower": str(row.get('drug_name', '')).strip().lower(),
            "generic_name_lower": str(row.get('generic_name', '')).strip().lower() if pd.notna(row.get('generic_name')) else "",
            "search_keywords": [
                str(row.get('drug_name', '')).strip().lower(),
                str(row.get('generic_name', '')).strip().lower() if pd.notna(row.get('generic_name')) else ""
            ] + str(row.get('brand_names', '')).lower().split(', ') if pd.notna(row.get('brand_names')) else []
        }
        
        drugs_data.append(drug_record)
    
    # Insert into MongoDB
    if drugs_data:
        db.drug_side_effects.insert_many(drugs_data)
        print(f"✅ Imported {len(drugs_data)} drugs with side effects")
        
        # Create indexes
        db.drug_side_effects.create_index([("drug_name_lower", ASCENDING)])
        db.drug_side_effects.create_index([("generic_name_lower", ASCENDING)])
        db.drug_side_effects.create_index([("medical_condition", ASCENDING)])
        db.drug_side_effects.create_index([("rating", ASCENDING)])
        db.drug_side_effects.create_index([("search_keywords", ASCENDING)])
        # Text index for full-text search
        db.drug_side_effects.create_index([
            ("drug_name", TEXT),
            ("generic_name", TEXT),
            ("brand_names", TEXT)
        ])
        print("✅ Created search indexes")
        
        # Print statistics
        print("\n📊 IMPORT STATISTICS:")
        print(f"   Total Drugs: {len(drugs_data)}")
        print(f"\n   Rating Distribution:")
        print(f"   🟢 High (7-10):   {rating_stats['high']} drugs")
        print(f"   🟡 Medium (5-7):  {rating_stats['medium']} drugs")
        print(f"   🔴 Low (<5):      {rating_stats['low']} drugs")
        
        print(f"\n   Top 10 Medical Conditions:")
        sorted_conditions = sorted(condition_stats.items(), key=lambda x: x[1], reverse=True)[:10]
        for condition, count in sorted_conditions:
            print(f"   • {condition}: {count} drugs")
        
        # Sample high-rated drugs
        print(f"\n   ⭐ Sample High-Rated Drugs:")
        high_rated = db.drug_side_effects.find({"rating": {"$gte": 8}}).limit(5)
        for drug in high_rated:
            print(f"   • {drug['drug_name']} ({drug['generic_name']}) - Rating: {drug['rating']}/10")
            print(f"     Condition: {drug['medical_condition']}")
            if drug['side_effects_severe']:
                print(f"     ⚠️  Severe effects: {', '.join(drug['side_effects_severe'][:3])}")
    
    else:
        print("❌ No valid drug data found")
        
except FileNotFoundError:
    print("❌ ERROR: drugs_side_effects_drugs_com.csv not found")
    print("   Please ensure the file exists in ../data/")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("✨ Import Complete!")
print(f"🗄️  Database: {DATABASE_NAME}")
print(f"📁 Collection: drug_side_effects")
print("\n⚕️  MEDICAL SAFETY NOTE:")
print("   This data is sourced from drugs.com for informational purposes.")
print("   Always consult healthcare professionals for medical advice.")
print("=" * 70)

client.close()
