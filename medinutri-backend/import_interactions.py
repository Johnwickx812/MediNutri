"""
Enhanced Food-Drug Interaction Import Script
This script ensures medically accurate data import with validation
"""
import pandas as pd
from pymongo import MongoClient, ASCENDING
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

# Connect to MongoDB
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

print("🏥 MEDICAL-GRADE FOOD-DRUG INTERACTION IMPORT")
print("=" * 60)

# Import Food-Drug Interactions
print("\n📋 Importing Food-Drug Interactions...")
try:
    df = pd.read_csv("../data/food_drug_interactions.csv")
    
    # Validate required columns
    required_columns = ['food_name', 'drug_name', 'interaction_type', 'severity', 'description']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        print(f"❌ ERROR: Missing required columns: {missing_columns}")
        exit(1)
    
    # Clear existing data
    db.food_drug_interactions.delete_many({})
    print("🗑️  Cleared existing interaction data")
    
    # Prepare records with validation
    interactions = []
    severity_counts = {"High": 0, "Medium": 0, "Low": 0}
    
    for _, row in df.iterrows():
        # Validate severity
        severity = str(row['severity']).strip()
        if severity not in ['High', 'Medium', 'Low']:
            print(f"⚠️  WARNING: Invalid severity '{severity}' for {row['food_name']} + {row['drug_name']}")
            continue
        
        severity_counts[severity] += 1
        
        interaction = {
            "food_name": str(row['food_name']).strip(),
            "drug_name": str(row['drug_name']).strip(),
            "interaction_type": str(row['interaction_type']).strip(),
            "severity": severity,
            "description": str(row['description']).strip(),
            # Add normalized versions for better matching
            "food_name_lower": str(row['food_name']).strip().lower(),
            "drug_name_lower": str(row['drug_name']).strip().lower(),
            # Add keywords for partial matching
            "food_keywords": str(row['food_name']).strip().lower().split(),
            "drug_keywords": str(row['drug_name']).strip().lower().split()
        }
        interactions.append(interaction)
    
    # Insert into MongoDB
    if interactions:
        db.food_drug_interactions.insert_many(interactions)
        print(f"✅ Imported {len(interactions)} food-drug interactions")
        
        # Create indexes for fast searching
        db.food_drug_interactions.create_index([("food_name_lower", ASCENDING)])
        db.food_drug_interactions.create_index([("drug_name_lower", ASCENDING)])
        db.food_drug_interactions.create_index([("severity", ASCENDING)])
        db.food_drug_interactions.create_index([
            ("food_name_lower", ASCENDING),
            ("drug_name_lower", ASCENDING)
        ])
        print("✅ Created search indexes")
        
        # Print severity breakdown
        print("\n📊 Severity Breakdown:")
        print(f"   🔴 High Severity:   {severity_counts['High']} interactions")
        print(f"   🟡 Medium Severity: {severity_counts['Medium']} interactions")
        print(f"   🟢 Low Severity:    {severity_counts['Low']} interactions")
        
        # Print critical interactions
        print("\n⚠️  CRITICAL HIGH-SEVERITY INTERACTIONS:")
        critical = db.food_drug_interactions.find({"severity": "High"}).limit(10)
        for i, interaction in enumerate(critical, 1):
            print(f"   {i}. {interaction['food_name']} + {interaction['drug_name']}")
            print(f"      → {interaction['interaction_type']}: {interaction['description']}")
        
    else:
        print("❌ No valid interactions found")
        
except FileNotFoundError:
    print("❌ ERROR: food_drug_interactions.csv not found")
    print("   Please ensure the file exists in ../data/")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("✨ Import Complete!")
print(f"🗄️  Database: {DATABASE_NAME}")
print(f"📁 Collection: food_drug_interactions")
print("\n⚕️  MEDICAL SAFETY NOTE:")
print("   This data is for informational purposes.")
print("   Always consult healthcare professionals for medical advice.")
print("=" * 60)

client.close()
