import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv('medinutri-backend/.env')
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

def main():
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    col = db['drugs']
    
    print("--- MongoDB Drugs Sample ---")
    for doc in col.find().limit(5):
        name = doc.get("Medicine Name")
        composition = doc.get("Composition")
        uses = doc.get("Uses")
        print(f"Name: {name}")
        print(f"Composition: {composition}")
        print(f"Uses: {uses}")
        print("-" * 20)
    
    client.close()

if __name__ == "__main__":
    main()
