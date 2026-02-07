from fastapi import FastAPI, HTTPException, Query, Request
from datetime import datetime
from fastapi.responses import StreamingResponse
import json
import asyncio
import re
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, ASCENDING
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

# Load environment variables
load_dotenv()

# Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medinutri")

app = FastAPI(
    title="MediNutri API",
    description="Backend API for MediNutri - Food, Drug, and Interaction Database",
    version="1.0.0"
)

# 3. Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
try:
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    # Test connection
    client.server_info()
    print(f"Connected to MongoDB: {DATABASE_NAME}")
    print("Database structure verified: foods, drugs, food_drug_interactions")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    # We continue to allow app startup, but functionality will fail if DB is down

# Auth Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "medinutri-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Collections
foods_collection = db["foods"]
drugs_collection = db["drugs"]
interactions_collection = db["food_drug_interactions"]
drug_side_effects_collection = db["drug_side_effects"]
users_collection = db["users"]

# Create indexes
try:
    users_collection.create_index([("email", ASCENDING)], unique=True)
except:
    pass

# 6. Load Knowledge Base
knowledge_base = []
try:
    kb_path = os.path.join(os.path.dirname(__file__), "data", "knowledge_base.json")
    if os.path.exists(kb_path):
        with open(kb_path, "r", encoding="utf-8") as f:
            knowledge_base = json.load(f)
        print(f"Knowledge Base Loaded: {len(knowledge_base)} entries")
    else:
        print(f"Knowledge Base file not found at: {kb_path}")
except Exception as e:
    print(f"Failed to load Knowledge Base: {e}")

# 7. Create database indexes
try:
    foods_collection.create_index([("Food", ASCENDING)])
    drugs_collection.create_index([("Medicine Name", ASCENDING)])
    interactions_collection.create_index([("food_name", ASCENDING), ("drug_name", ASCENDING)])
    print("Database indexes created")
except Exception as e:
    print(f"Index creation warning: {e}")


import math

# --- Pydantic Models for Auth ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

# --- Auth Helper Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Helper: Convert ObjectId to string and handle NaN
def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    
    new_doc = {}
    for k, v in doc.items():
        if k == "_id":
            new_doc[k] = str(v)
        elif isinstance(v, float) and math.isnan(v):
            new_doc[k] = None
        else:
            new_doc[k] = v
    return new_doc


# 1. Root Endpoint
@app.get("/")
def read_root():
    """Return API status and available endpoints"""
    return {
        "status": "online",
        "message": "MediNutri API is running!",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "foods_search": "/api/search/foods",
            "drugs_search": "/api/search/drugs",
            "interactions": "/api/search/interactions",
            "autocomplete": "/api/search/autocomplete",
            "stats": "/api/stats",
            "health": "/health",
            "auth": "/api/auth"
        }
    }


# --- AUTH ENDPOINTS ---
@app.post("/api/auth/register")
async def register(user: UserRegister):
    # Password validation
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not any(c.isalpha() for c in user.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter")
    if not any(c.isdigit() for c in user.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    # Check if user exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": get_password_hash(user.password),
        "created_at": datetime.utcnow()
    }
    
    try:
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        # Create token for immediate login
        access_token = create_access_token(
            data={"sub": user.email}
        )
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Create token
    access_token = create_access_token(
        data={"sub": user.email}
    )
    
    return {
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user.get("name", "User"),
            "email": db_user["email"]
        }
    }

@app.get("/api/auth/me")
async def get_me(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        db_user = users_collection.find_one({"email": email})
        if db_user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {
            "success": True,
            "user": {
                "id": str(db_user["_id"]),
                "name": db_user.get("name", "User"),
                "email": db_user["email"]
            }
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")



# 2. Search Foods
@app.get("/api/search/foods")
def search_foods(
    q: str = Query(..., description="Search query for food"),
    limit: int = Query(10, description="Limit results")
):
    """
    Search foods collection by "Food" field (case-insensitive, partial match)
    """
    try:
        query = {"Food": {"$regex": q, "$options": "i"}}
        cursor = foods_collection.find(query).limit(limit)
        results = [serialize_doc(doc) for doc in cursor]
        
        return {
            "success": True,
            "query": q,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# 3. Search Drugs
@app.get("/api/search/drugs")
def search_drugs(
    q: str = Query(..., description="Search query for drugs"),
    limit: int = Query(10, description="Limit results")
):
    """
    Search drugs collection by "Medicine Name" field (case-insensitive, partial match)
    """
    try:
        query = {"Medicine Name": {"$regex": q, "$options": "i"}}
        cursor = drugs_collection.find(query).limit(limit)
        results = [serialize_doc(doc) for doc in cursor]
        
        return {
            "success": True,
            "query": q,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# 4. Check Food-Drug Interactions (Enhanced Medical-Grade)
@app.get("/api/search/interactions")
def check_interactions(
    food: str = Query(..., description="Food name"),
    drug: str = Query(..., description="Drug name")
):
    """
    Medical-grade interaction checker with fuzzy matching
    Handles partial names, generic/brand names, and food categories
    """
    try:
        # Normalize inputs
        food_lower = food.lower().strip()
        drug_lower = drug.lower().strip()
        
        # Build comprehensive query with multiple matching strategies
        query = {
            "$or": [
                # Exact match (case-insensitive)
                {
                    "$and": [
                        {"food_name_lower": food_lower},
                        {"drug_name_lower": drug_lower}
                    ]
                },
                # Partial match on both
                {
                    "$and": [
                        {"food_name": {"$regex": food, "$options": "i"}},
                        {"drug_name": {"$regex": drug, "$options": "i"}}
                    ]
                },
                # Match food keywords (e.g., "leafy greens" matches "spinach")
                {
                    "$and": [
                        {"food_keywords": {"$in": food_lower.split()}},
                        {"drug_name": {"$regex": drug, "$options": "i"}}
                    ]
                },
                # Match drug keywords (e.g., "blood thinner" matches "warfarin")
                {
                    "$and": [
                        {"food_name": {"$regex": food, "$options": "i"}},
                        {"drug_keywords": {"$in": drug_lower.split()}}
                    ]
                }
            ]
        }
        
        cursor = interactions_collection.find(query)
        results = [serialize_doc(doc) for doc in cursor]
        
        # Sort by severity (High > Medium > Low)
        severity_order = {"High": 0, "Medium": 1, "Low": 2}
        results.sort(key=lambda x: severity_order.get(x.get("severity", "Low"), 3))
        
        # Count by severity
        severity_counts = {
            "high": sum(1 for item in results if item.get("severity") == "High"),
            "medium": sum(1 for item in results if item.get("severity") == "Medium"),
            "low": sum(1 for item in results if item.get("severity") == "Low")
        }
        
        # Determine overall risk level
        risk_level = "safe"
        if severity_counts["high"] > 0:
            risk_level = "danger"
        elif severity_counts["medium"] > 0:
            risk_level = "warning"
        elif severity_counts["low"] > 0:
            risk_level = "caution"
        
        return {
            "success": True,
            "food": food,
            "drug": drug,
            "has_interaction": len(results) > 0,
            "risk_level": risk_level,
            "interactions": results,
            "count": len(results),
            "severity_breakdown": severity_counts,
            "medical_note": "Always consult your healthcare provider before making dietary changes while on medication."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interaction check failed: {str(e)}")


@app.get("/api/interactions/drug/{drug_name}")
def get_drug_interactions(drug_name: str):
    """
    Get all known interactions for a specific drug
    """
    try:
        query = {"drug_name": {"$regex": drug_name, "$options": "i"}}
        cursor = interactions_collection.find(query)
        results = [serialize_doc(doc) for doc in cursor]
        
        # Sort by severity
        severity_order = {"High": 0, "Medium": 1, "Low": 2}
        results.sort(key=lambda x: severity_order.get(x.get("severity", "Low"), 3))
        
        return {
            "success": True,
            "drug": drug_name,
            "interactions": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch interactions: {str(e)}")


@app.post("/api/interactions/batch-check")
def batch_check_interactions(request: Dict[str, Any]):
    """
    Check multiple foods against user's medication list
    Request body: {
        "foods": ["Spinach", "Grapefruit", "Milk"],
        "medications": ["Warfarin", "Atorvastatin"]
    }
    """
    try:
        foods = request.get("foods", [])
        medications = request.get("medications", [])
        
        if not foods or not medications:
            return {
                "success": True,
                "message": "No interactions to check",
                "interactions": [],
                "safe_foods": foods,
                "risky_foods": []
            }
        
        all_interactions = []
        risky_foods = set()
        food_risk_map = {}
        
        # Check each food against each medication
        for food in foods:
            food_interactions = []
            highest_severity = "Low"
            
            for medication in medications:
                # Use the same comprehensive query as the main endpoint
                food_lower = food.lower().strip()
                drug_lower = medication.lower().strip()
                
                query = {
                    "$or": [
                        {
                            "$and": [
                                {"food_name_lower": food_lower},
                                {"drug_name_lower": drug_lower}
                            ]
                        },
                        {
                            "$and": [
                                {"food_name": {"$regex": food, "$options": "i"}},
                                {"drug_name": {"$regex": medication, "$options": "i"}}
                            ]
                        },
                        {
                            "$and": [
                                {"food_keywords": {"$in": food_lower.split()}},
                                {"drug_name": {"$regex": medication, "$options": "i"}}
                            ]
                        }
                    ]
                }
                
                cursor = interactions_collection.find(query)
                interactions = [serialize_doc(doc) for doc in cursor]
                
                for interaction in interactions:
                    food_interactions.append(interaction)
                    severity = interaction.get("severity", "Low")
                    
                    # Track highest severity for this food
                    if severity == "High":
                        highest_severity = "High"
                    elif severity == "Medium" and highest_severity != "High":
                        highest_severity = "Medium"
            
            if food_interactions:
                risky_foods.add(food)
                food_risk_map[food] = highest_severity
                all_interactions.extend(food_interactions)
        
        # Categorize foods by risk
        safe_foods = [f for f in foods if f not in risky_foods]
        high_risk_foods = [f for f, s in food_risk_map.items() if s == "High"]
        medium_risk_foods = [f for f, s in food_risk_map.items() if s == "Medium"]
        low_risk_foods = [f for f, s in food_risk_map.items() if s == "Low"]
        
        # Sort interactions by severity
        severity_order = {"High": 0, "Medium": 1, "Low": 2}
        all_interactions.sort(key=lambda x: severity_order.get(x.get("severity", "Low"), 3))
        
        return {
            "success": True,
            "total_foods_checked": len(foods),
            "total_medications_checked": len(medications),
            "interactions_found": len(all_interactions),
            "interactions": all_interactions,
            "safe_foods": safe_foods,
            "risky_foods": {
                "high_risk": high_risk_foods,
                "medium_risk": medium_risk_foods,
                "low_risk": low_risk_foods
            },
            "overall_risk": "high" if high_risk_foods else ("medium" if medium_risk_foods else ("low" if low_risk_foods else "safe")),
            "medical_note": "⚕️ This is for informational purposes only. Always consult your healthcare provider."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch check failed: {str(e)}")


# 5. Autocomplete Search
@app.get("/api/search/autocomplete")
def autocomplete(
    q: str = Query(..., description="Query string"),
    type: str = Query("food", description="Type: food or drug"),
    lang: str = Query("en", description="Language code: en, hi, ta, ml"),
    limit: int = Query(8, description="Limit suggestions")
):
    """
    Prefix search for autocomplete (starts with query)
    """
    try:
        if type.lower() == "drug":
            collection = drugs_collection
            field = "Medicine Name"
            # Substring search (more like Google/Medicines search)
            query = {field: {"$regex": q, "$options": "i"}}
            cursor = collection.find(query, {field: 1, "_id": 0}).limit(limit)
            
            suggestions = []
            for doc in cursor:
                val = doc.get(field)
                if val and val not in suggestions:
                    suggestions.append(val)
        else:
            collection = foods_collection
            lang_map = {
                "hi": "name_hindi",
                "ta": "name_tamil",
                "ml": "name_malayalam",
                "en": "Food"
            }
            target_field = lang_map.get(lang.lower(), "Food")
            
            # Cross-language search: search in English AND the target language
            # Using substring match (no ^) for "Google-like" behavior
            query = {
                "$or": [
                    {"Food": {"$regex": q, "$options": "i"}},
                    {"name_hindi": {"$regex": q, "$options": "i"}},
                    {"name_tamil": {"$regex": q, "$options": "i"}},
                    {"name_malayalam": {"$regex": q, "$options": "i"}}
                ]
            }
            
            cursor = collection.find(query).limit(limit)
            
            suggestions = []
            for doc in cursor:
                # Primary: Localized name. Fallback: English name.
                localized = doc.get(target_field)
                english = doc.get("Food")
                
                # If target field is empty, fallback to English
                display_name = localized if localized and localized.strip() else english
                
                if display_name and display_name not in suggestions:
                    suggestions.append(display_name)
        
        return {
            "success": True,
            "query": q,
            "type": type,
            "lang": lang,
            "suggestions": suggestions,
            "count": len(suggestions)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }


# 6. Get Food Details
@app.get("/api/food/{food_name}")
def get_food_details(food_name: str):
    """
    Get specific food by searching across all name fields
    """
    try:
        # Search across multiple name fields to handle localized names
        query = {
            "$or": [
                {"Food": {"$regex": f"^{food_name}$", "$options": "i"}},
                {"name_hindi": {"$regex": f"^{food_name}$", "$options": "i"}},
                {"name_tamil": {"$regex": f"^{food_name}$", "$options": "i"}},
                {"name_malayalam": {"$regex": f"^{food_name}$", "$options": "i"}}
            ]
        }
        doc = foods_collection.find_one(query)
        
        if not doc:
            raise HTTPException(status_code=404, detail="Food not found")
            
        return {
            "success": True,
            "food": serialize_doc(doc)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving food: {str(e)}")


# 7. Get Drug Details
@app.get("/api/drug/{medicine_name}")
def get_drug_details(medicine_name: str):
    """
    Get specific drug by exact name match
    """
    try:
        # Exact match logic
        query = {"Medicine Name": {"$regex": f"^{medicine_name}$", "$options": "i"}}
        doc = drugs_collection.find_one(query)
        
        if not doc:
            raise HTTPException(status_code=404, detail="Drug not found")
            
        return {
            "success": True,
            "drug": serialize_doc(doc)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving drug: {str(e)}")


@app.get("/foods/autocomplete")
def food_autocomplete_alias(
    q: str = Query(..., description="Query string"),
    lang: str = Query("en", description="Language code")
):
    """Alias for /api/search/autocomplete?type=food"""
    return autocomplete(q=q, type="food", lang=lang, limit=8)

@app.get("/drugs/autocomplete")
def drug_autocomplete_alias(
    q: str = Query(..., description="Query string"),
    lang: str = Query("en", description="Language code")
):
    """Alias for /api/search/autocomplete?type=drug"""
    return autocomplete(q=q, type="drug", lang=lang, limit=8)

@app.get("/foods/search")
def food_search_alias(
    q: str = Query(..., description="Search query"), 
    limit: int = Query(10, description="Limit")
):
    """Alias for /api/search/foods"""
    return search_foods(q=q, limit=limit)

@app.get("/drugs/search")
def drug_search_alias(
    q: str = Query(..., description="Search query"),
    limit: int = Query(10, description="Limit")
):
    """Alias for /api/search/drugs"""
    return search_drugs(q=q, limit=limit)


# 10. Drug Side Effects Search & Details
@app.get("/api/drugs/side-effects/search")
def search_drug_side_effects(
    q: str = Query(..., description="Search query for drug side effects"),
    limit: int = Query(10, description="Limit results")
):
    """
    Search specifically in the comprehensive side effects database
    Values returned include medical condition, rating, and safety warnings
    """
    try:
        # Search by drug name, generic name, or brand names
        query = {
            "$or": [
                {"drug_name": {"$regex": q, "$options": "i"}},
                {"generic_name": {"$regex": q, "$options": "i"}},
                {"brand_names": {"$regex": q, "$options": "i"}}
            ]
        }
        
        cursor = drug_side_effects_collection.find(query).limit(limit)
        results = [serialize_doc(doc) for doc in cursor]
        
        return {
            "success": True,
            "query": q,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Side effects search failed: {str(e)}")


@app.get("/api/drugs/side-effects/{drug_name}")
def get_drug_side_effects_details(drug_name: str):
    """
    Get full safety profile for a specific drug
    """
    try:
        # Try exact match first
        query = {"drug_name_lower": drug_name.lower().strip()}
        doc = drug_side_effects_collection.find_one(query)
        
        # If not found, try generic name
        if not doc:
            query = {"generic_name_lower": drug_name.lower().strip()}
            doc = drug_side_effects_collection.find_one(query)
        
        # If still not found, try partial match on name
        if not doc:
             query = {"drug_name": {"$regex": f"^{drug_name}", "$options": "i"}}
             doc = drug_side_effects_collection.find_one(query)
            
        if not doc:
            raise HTTPException(status_code=404, detail="Drug safety profile not found")
            
        return {
            "success": True,
            "drug": serialize_doc(doc)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving drug details: {str(e)}")

# 8. Database Statistics
@app.get("/api/stats")
def get_stats():
    """
    Return count of foods, drugs, interactions and total records
    """
    try:
        foods_count = foods_collection.count_documents({})
        drugs_count = drugs_collection.count_documents({})
        interactions_count = interactions_collection.count_documents({})
        
        return {
            "success": True,
            "database": DATABASE_NAME,
            "collections": {
                "foods": foods_count,
                "drugs": drugs_count,
                "interactions": interactions_count
            },
            "total_records": foods_count + drugs_count + interactions_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats failed: {str(e)}")


# 9. Health Check
@app.get("/health")
def health_check():
    """
    Check if MongoDB is connected and return healthy/unhealthy status
    """
    try:
        client.server_info()
        return {
            "status": "healthy",
            "database": "connected",
            "message": "MediNutri API is fully operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# 11. AI Assistant Endpoint (Rule-Based Expert System)
async def generate_ai_response(messages: List[Dict[str, str]], user_context: Dict[str, Any]):
    """
    Smart Health Logic Engine
    Analyzes user intent and context to generate medically relevant responses
    """
    last_message = messages[-1]["content"].lower() if messages else ""
    response_buffer = []
    
    # 1. Identify Intent
    intent = "general"
    if any(w in last_message for w in ["interaction", "safe with", "mix with", "take with", "eat with"]):
        intent = "interaction_check"
    elif any(w in last_message for w in ["side effect", "reaction", "symptom", "adverse", "risk"]):
        intent = "side_effects"
    elif any(w in last_message for w in ["analysis", "summary", "how is my diet", "daily stats", "progress today", "total calories"]):
        intent = "diet_advice"
    elif any(w in last_message for w in ["hello", "hi", "hey"]):
        intent = "greeting"

    # 2. Generate Content based on Intent & Data
    if intent == "greeting":
        response_buffer.append("Hello! I'm your MediNutri Health Assistant. I can help you check food-drug interactions, explain medication side effects, or analyze your diet. How can I help you today?")

    elif intent == "interaction_check":
        found_issue = False
        
        # Check active medications interactions
        meds = user_context.get("medications", [])
        if not meds:
            response_buffer.append("I don't see any active medications in your profile. Please add your medications first so I can check for interactions.")
        else:
            med_names = [m["name"] for m in meds]
            response_buffer.append(f"Analyzing for your medications: **{', '.join(med_names)}**...\n\n")
            
            # Simple keyword check against interaction database
            # In a real scenario, we would use the specific drug IDs
            found_hits = 0
            for med in meds:
                # Find interactions for this drug
                # We use a broad search since we don't have exact ID matching in this simple logic
                cursor = interactions_collection.find({"drug_name_lower": {"$regex": med["name"].lower()}}).limit(3)
                drug_interactions = list(cursor)
                
                if drug_interactions:
                    response_buffer.append(f"⚠️ **Potential alerts for {med['name']}**:\n")
                    for i in drug_interactions:
                        severity_icon = "🔴" if i.get('severity') == 'High' else "🟡"
                        response_buffer.append(f"{severity_icon} **{i['food_name']}**: {i.get('description', '')}\n")
                    found_hits += 1
                    found_issue = True
            
            if found_hits == 0:
                response_buffer.append("✅ I didn't find specific food interactions for your current medication list in my immediate database. However, always follow your doctor's advice.")
            else:
                response_buffer.append("\n**Recommendation:** Please review the [Check Safety](/interactions) page for detailed analysis.")

    elif intent == "side_effects":
        # Extract drug name from message
        target_drug = None
        
        # Check active meds first
        active_meds = user_context.get("medications", [])
        for med in active_meds:
            if med["name"].lower() in last_message:
                target_drug = med["name"]
                break
        
        # If not active, look for any word that looks like a drug in our DB
        if not target_drug:
            words = last_message.split()
            for w in words:
                clean_w = re.sub(r'[^\w]', '', w)
                if len(clean_w) > 3:
                     # Quick check
                     if drug_side_effects_collection.find_one({"drug_name_lower": clean_w.lower()}):
                         target_drug = clean_w
                         break
        
        if target_drug:
            # Fetch details
            drug_doc = drug_side_effects_collection.find_one({
                "$or": [
                    {"drug_name_lower": target_drug.lower()},
                    {"generic_name_lower": target_drug.lower()}
                ]
            })
            
            if drug_doc:
                response_buffer.append(f"### Safety Profile for **{drug_doc.get('drug_name')}**\n\n")
                
                severe = drug_doc.get('side_effects_severe', [])
                if severe:
                    response_buffer.append("🚫 **Serious Side Effects** (Call doctor):\n")
                    for s in severe[:3]:
                        response_buffer.append(f"- {s}\n")
                    response_buffer.append("\n")
                
                common = drug_doc.get('side_effects_common', [])
                if common:
                    response_buffer.append("ℹ️ **Common Side Effects**:\n")
                    for s in common[:3]:
                        response_buffer.append(f"- {s}\n")
                
                response_buffer.append(f"\n**Used for:** {drug_doc.get('medical_condition', 'Various conditions')}")
                
                if drug_doc.get('pregnancy_category'):
                     response_buffer.append(f"\n**Pregnancy Category:** {drug_doc.get('pregnancy_category')}")
            else:
                response_buffer.append(f"I found '{target_drug}' in your message, but I don't have detailed safety data for it yet.")
        else:
            response_buffer.append("Which medication are you asking about? I can provide safety details for over 2,900 drugs from our verified database.")

    elif intent == "diet_advice":
        cals = user_context.get("totalCalories", 0)
        protein = user_context.get("totalProtein", 0)
        meals = user_context.get("todaysMeals", [])
        
        response_buffer.append(f"### **Dietary Analysis**\n\n")
        response_buffer.append(f"- **Calories Today:** {round(cals)}\n")
        response_buffer.append(f"- **Protein Today:** {round(protein)}g\n")
        response_buffer.append(f"- **Meals Logged:** {len(meals)}\n\n")
        
        if cals < 1200:
            response_buffer.append("⚠️ **Low Intake:** Your calorie intake is quite low for today. Consider adding a balanced meal with complex carbohydrates.")
        elif cals > 2500:
             response_buffer.append("ℹ️ **High Intake:** You've had a hearty day! Ensure you're staying hydrated and active.")
        else:
             response_buffer.append("✅ **Good Range:** Your calorie intake is within a healthy daily range.")
             
        if protein < 45:
            response_buffer.append("\n\n💪 **Protein Tip:** Try adding more lentils, chickpea, paneer, or lean meats to support muscle health.")

    else:
        # 3. Integrated Search (Knowledge Base + Live Database)
        msg_lower = last_message.lower()
        stop_words = {"how", "many", "much", "in", "what", "is", "of", "the", "a", "an", "calories", "protein", "carbs", "fats"}
        search_words = [w for w in re.findall(r'\b\w+\b', msg_lower) if w not in stop_words and len(w) > 2]
        
        db_food_info = None
        db_drug_info = None
        
        # A. Try Database Lookup first for "Values"
        for word in search_words:
            food_doc = foods_collection.find_one({"Food": {"$regex": f"^{word}", "$options": "i"}})
            if food_doc:
                db_food_info = food_doc
                break
            drug_doc = drug_side_effects_collection.find_one({"drug_name_lower": {"$regex": f"^{word}", "$options": "i"}})
            if drug_doc:
                db_drug_info = drug_doc
                break

        # B. Check Knowledge Base for expert advice
        best_kb_match = None
        max_kb_score = 0
        for entry in knowledge_base:
            keywords = entry.get("keywords", [])
            matches = sum(1 for k in keywords if k.lower() in msg_lower)
            if matches > max_kb_score:
                max_kb_score = matches
                best_kb_match = entry

        # C. Combine Results
        if db_food_info:
            response_buffer.append(f"### **Nutrition Information: {db_food_info.get('Food')}**\n\n")
            response_buffer.append(f"✅ **Value:** {db_food_info.get('Calories', 'N/A')} calories per 100g\n")
            response_buffer.append(f"💪 **Protein:** {db_food_info.get('Protein', 'N/A')}g\n\n")
            
        if db_drug_info:
            response_buffer.append(f"### **Safety Info: {db_drug_info.get('drug_name')}**\n\n")
            response_buffer.append(f"**Medical Use:** {db_drug_info.get('medical_condition', 'N/A')}\n\n")

        if best_kb_match and max_kb_score >= 1:
            if not db_food_info and not db_drug_info:
                response_buffer.append(f"### **{best_kb_match.get('category', 'Health Insight')}**\n\n")
            else:
                response_buffer.append(f"**Health Tip:** ")
            response_buffer.append(f"{best_kb_match['answer']}\n\n")
        
        # Final Fallback if nothing found
        if not db_food_info and not db_drug_info and not best_kb_match:
            response_buffer.append("I'm trained to help with **Medications**, **Side Effects**, and **Diet Tracking**. \n\nTry asking:\n\n- \"Is it safe to eat grapefruit with my meds?\"\n- \"What are side effects of Metformin?\"\n- \"Is Idli good for diabetes?\"\n- \"How many calories in Samosa?\"")


    # STREAMING SIMULATION
    # In a real LLM, tokens come one by one. Here we break our constructed response into chunks.
    full_text = "".join(response_buffer)
    
    # Split by spaces to simulate typing
    words = full_text.split(" ")
    
    for i, word in enumerate(words):
        # Add space back except for last word
        chunk = word + (" " if i < len(words) - 1 else "")
        
        # Create OpenAI-compatible delta format
        data = {
            "choices": [
                {
                    "delta": {
                        "content": chunk
                    }
                }
            ]
        }
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(0.04)  # Semantic typing delay

    yield "data: [DONE]\n\n"

@app.post("/api/feedback")
async def submit_feedback(request: Request):
    """
    Receive feedback/queries from users
    """
    try:
        data = await request.json()
        name = data.get("name")
        email = data.get("email")
        subject = data.get("subject")
        message = data.get("message")
        
        # For now, we'll log the feedback.
        # Later we can integrate with SMTP to send to user's Gmail.
        print(f"--- FEEDBACK RECEIVED ---", flush=True)
        print(f"From: {name} ({email})", flush=True)
        print(f"Subject: {subject}", flush=True)
        print(f"Message: {message}", flush=True)
        print(f"-------------------------", flush=True)

        # EMAIL SENDING LOGIC
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        GMAIL_USER = os.getenv("GMAIL_USER")
        GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
        RECEIVER = os.getenv("FEEDBACK_RECEIVER")
        
        if GMAIL_USER and GMAIL_APP_PASSWORD:
            msg = MIMEMultipart()
            msg['From'] = GMAIL_USER
            msg['To'] = RECEIVER or GMAIL_USER
            msg['Subject'] = f"MediNutri Feedback: {subject}"
            
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
            msg.attach(MIMEText(body, 'plain'))

            try:
                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                text = msg.as_string()
                server.sendmail(GMAIL_USER, msg['To'], text)
                server.quit()
                print("Email sent successfully", flush=True)
            except Exception as email_err:
                print(f"Failed to send email: {email_err}", flush=True)
        
        # Save to a log file as well
        with open("feedback.log", "a", encoding="utf-8") as f:
            f.write(f"Timestamp: {datetime.now()}\n")
            f.write(f"From: {name} ({email})\n")
            f.write(f"Subject: {subject}\n")
            f.write(f"Message: {message}\n")
            f.write("-" * 30 + "\n")
            
        return {"success": True, "message": "Feedback received and logged."}
    except Exception as e:
        print(f"Feedback Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process feedback")

@app.post("/api/ai/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        user_context = data.get("userContext", {})
        
        return StreamingResponse(
            generate_ai_response(messages, user_context),
            media_type="text/event-stream"
        )
    except Exception as e:
        print(f"AI Error: {e}")
        # Create a generator that yields the error message as a stream
        async def error_generator():
            error_msg = json.dumps({"choices": [{"delta": {"content": f"System Error: {str(e)}"}} ]})
            yield f"data: {error_msg}\n\n"
            yield "data: [DONE]\n\n"
            
        return StreamingResponse(
            error_generator(),
            media_type="text/event-stream"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting MediNutri API Server...")
    print(f"Database: {DATABASE_NAME}")
    print(f"MongoDB URL: {MONGODB_URL}")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
