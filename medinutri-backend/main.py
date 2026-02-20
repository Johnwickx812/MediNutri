from fastapi import FastAPI, HTTPException, Query, Request
print("!!! MAIN.PY IS LOADING !!!")
from datetime import datetime
from fastapi.responses import StreamingResponse
import json
import asyncio
import re
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt
from pydantic import BaseModel, EmailStr

# Load environment variables
load_dotenv()

# app instance initialization

app = FastAPI(
    title="MediNutri API",
    description="Backend API for MediNutri - Food, Drug, and Interaction Database",
    version="1.0.0"
)

# Enable CORS middleware
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"  # Fallback for other setups
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL Connection Helper
pg_pool = None

def get_db_pool():
    global pg_pool
    if pg_pool is None:
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            print("CRITICAL: DATABASE_URL not found in environment")
            return None
        
        # Smart SSL handling
        is_localhost = "localhost" in db_url or "127.0.0.1" in db_url
        if "sslmode=" not in db_url and not is_localhost:
            separator = "&" if "?" in db_url else "?"
            db_url = f"{db_url}{separator}sslmode=require"
            
        try:
            # Log connection attempt (masking password)
            masked_url = db_url
            if "@" in db_url:
                prefix = db_url.split("@")[0]
                if ":" in prefix:
                    base = prefix.split(":")[0] + ":" + prefix.split(":")[1].split("//")[0] + "//" + prefix.split("//")[1].split(":")[0]
                    masked_url = f"{base}:****@{db_url.split('@')[1]}"
            print(f"Connecting to PostgreSQL: {masked_url}")
            
            pg_pool = SimpleConnectionPool(1, 10, db_url)
            print("Connected to PostgreSQL successfully")
        except Exception as e:
            print(f"PostgreSQL connection failed: {e}")
            return None
    return pg_pool

# Initial attempt
print("--- STARTING DB CONNECTION ATTEMPT ---")
get_db_pool()

# Auth Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "medinutri-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Database helper (Kept for compatibility during transition if needed, but primarily PG now)
# (All direct MongoDB collections removed)

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

# PostgreSQL Initialization
# Note: Ensure medinutri_schema.sql has been run on the database


import math


# --- Pydantic Models for Auth ---
class UserDataSync(BaseModel):
    medications: List[Dict[str, Any]] = []
    meals: List[Dict[str, Any]] = []
    reminders: Dict[str, Any] = {}

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    medicalConditions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    dietPreference: Optional[str] = None
    cuisinePreference: Optional[str] = None
    onboardingComplete: Optional[bool] = None
    profileImage: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserDataSync(BaseModel):
    medications: List[Dict[str, Any]] = []
    meals: List[Dict[str, Any]] = []
    reminders: Dict[str, Any] = {}

# --- Auth Helper Functions ---
def verify_password(plain_password, hashed_password):
    try:
        # Direct bcrypt verification
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password):
    # Direct bcrypt hashing
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# (serialize_doc removed as MongoDB is no longer used)


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
    if len(user.password) > 70:
        raise HTTPException(status_code=400, detail="Password is too long (max 70 characters)")
    if not any(c.isalpha() for c in user.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter")
    if not any(c.isdigit() for c in user.password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    try:
        pool = get_db_pool()
        if not pool:
            raise HTTPException(status_code=500, detail="Database connection could not be established. Check DATABASE_URL.")
        
        conn = pool.getconn()
        try:
            with conn.cursor() as cur:
                # Check if exists (case-insensitive)
                cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (user.email,))
                if cur.fetchone():
                    print(f"Registration failed: Email {user.email} already exists")
                    raise HTTPException(status_code=400, detail="Email already registered")
                
                # Create user
                pwd_hash = get_password_hash(user.password)
                print(f"Registering new user: {user.name} ({user.email.lower()})")
                cur.execute("""
                    INSERT INTO users (name, email, password_hash) 
                    VALUES (%s, %s, %s) RETURNING id
                """, (user.name, user.email.lower(), pwd_hash))
                user_id = cur.fetchone()[0]
                conn.commit()
                
                access_token = create_access_token(data={"sub": user.email.lower()})
                return {
                    "success": True,
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {"id": user_id, "name": user.name, "email": user.email, "db": "postgresql"}
                }
        finally:
            if 'pool' in locals() and pool and 'conn' in locals():
                pool.putconn(conn)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
async def login(user: UserLogin):
    try:
        pool = get_db_pool()
        if not pool:
            raise HTTPException(status_code=500, detail="Database connection could not be established.")
            
        conn = pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                print(f"Login attempt for: {user.email}")
                cur.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(%s)", (user.email,))
                db_user = cur.fetchone()
                
                if not db_user:
                    print(f"Login failed: User {user.email} not found in database")
                    raise HTTPException(status_code=401, detail="Incorrect email or password")
                
                if not verify_password(user.password, db_user['password_hash']):
                    print(f"Login failed: Invalid password for {user.email}")
                    raise HTTPException(status_code=401, detail="Incorrect email or password")
                
                print(f"Login successful for: {user.email}")
                access_token = create_access_token(data={"sub": db_user['email']})
                db_user['id'] = db_user.pop('id') 
                if 'password_hash' in db_user: del db_user['password_hash']
                db_user['db'] = "postgresql"
                # Ensure role is present
                if 'role' not in db_user: db_user['role'] = 'user'
                return { "success": True, "access_token": access_token, "token_type": "bearer", "user": db_user }
        finally:
            if 'pool' in locals() and pool and 'conn' in locals():
                pool.putconn(conn)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/api/auth/me")
async def get_me(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise HTTPException(status_code=401, detail="Invalid token")
        
        pool = get_db_pool()
        if not pool:
            raise HTTPException(status_code=500, detail="Database connection setup failed")
        
        conn = pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
                db_user = cur.fetchone()
                if db_user:
                    if 'password_hash' in db_user: del db_user['password_hash']
                    if 'role' not in db_user: db_user['role'] = 'user'
                    db_user['db'] = "postgresql"
                    return { "success": True, "user": db_user }
        finally:
            if 'pool' in locals() and pool and 'conn' in locals():
                pool.putconn(conn)

        raise HTTPException(status_code=401, detail="User not found in PostgreSQL")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

@app.patch("/api/auth/me")
async def update_profile(request: Request, profile: UserProfileUpdate):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get update data
        update_data = {k: v for k, v in profile.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Build dynamic update query for PostgreSQL
                    set_clauses = []
                    values = []
                    for k, v in update_data.items():
                        # Map Pydantic fields to PostgreSQL column names
                        pg_col_name = k.lower() # Simple lowercase mapping for now
                        if k == "medicalConditions": pg_col_name = "medical_conditions"
                        if k == "dietPreference": pg_col_name = "diet_preference"
                        if k == "cuisinePreference": pg_col_name = "cuisine_preference"
                        if k == "onboardingComplete": pg_col_name = "onboarding_complete"
                        if k == "profileImage": pg_col_name = "profile_image"

                        if isinstance(v, list): # For array types like medicalConditions, allergies
                            set_clauses.append(f"{pg_col_name} = %s::jsonb")
                            values.append(json.dumps(v))
                        else:
                            set_clauses.append(f"{pg_col_name} = %s")
                            values.append(v)
                    
                    if not set_clauses:
                        raise HTTPException(status_code=400, detail="No valid data provided for update")

                    query = f"UPDATE users SET {', '.join(set_clauses)} WHERE email = %s RETURNING *"
                    values.append(email)
                    
                    cur.execute(query, tuple(values))
                    updated_user = cur.fetchone()
                    conn.commit()

                    if not updated_user:
                        raise HTTPException(status_code=404, detail="User not found")
                    
                    if 'password_hash' in updated_user: del updated_user['password_hash']
                    updated_user['db'] = "postgresql"
                    return {
                        "success": True,
                        "message": "Profile updated successfully",
                        "user": updated_user
                    }
            finally:
                pg_pool.putconn(conn)

        raise HTTPException(status_code=404, detail="User data not found in PostgreSQL")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")



# --- USER DATA SYNC ENDPOINTS ---
@app.get("/api/user/data")
async def get_user_data(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
                    user_row = cur.fetchone()
                    if user_row:
                        user_id = user_row['id']
                        # Fetch medications
                        cur.execute("SELECT * FROM user_medications WHERE user_id = %s", (user_id,))
                        meds = cur.fetchall()
                        # Fetch meals
                        cur.execute("SELECT * FROM meal_logs WHERE user_id = %s", (user_id,))
                        meals = cur.fetchall()
                        # Fetch reminders
                        cur.execute("SELECT settings FROM user_reminders WHERE user_id = %s", (user_id,))
                        reminders_row = cur.fetchone()
                        reminders = reminders_row['settings'] if reminders_row else {"enabled": False, "medications": {}}
                        
                        return { "success": True, "medications": meds, "meals": meals, "reminders": reminders, "db": "postgresql" }
            finally:
                pg_pool.putconn(conn)

        raise HTTPException(status_code=404, detail="User not found in PostgreSQL")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/sync")
async def sync_user_data(request: Request, data: UserDataSync):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
                    user_row = cur.fetchone()
                    if not user_row:
                        raise HTTPException(status_code=401, detail="User not found")
                    
                    user_id = user_row[0]
                    
                    # Sync medications - simpler to overwrite for now or use JSONB
                    # For now, let's use the user_reminders table as a catch-all for complex settings
                    # but proper tables for meds and meals
                    
                    # Note: Deep sync is complex, so I'll use a JSONB field for now to ensure 1:1 match with frontend
                    # in a dedicated table 'user_data_json' if needed, or just use the existing ones.
                    
                    # Update Reminders
                    cur.execute("""
                        INSERT INTO user_reminders (user_id, enabled, settings)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (user_id) DO UPDATE SET enabled = EXCLUDED.enabled, settings = EXCLUDED.settings
                    """, (user_id, data.reminders.get('enabled', False), json.dumps(data.reminders)))
                    
                    # For medications and meals, we'll clear existing and insert new for simplicity
                    # In a real app, you'd want more granular updates or use JSONB columns in the users table
                    # for these if they are small and frequently updated.
                    
                    # Clear existing medications and insert new ones
                    cur.execute("DELETE FROM user_medications WHERE user_id = %s", (user_id,))
                    for med in data.medications:
                        cur.execute("""
                            INSERT INTO user_medications (user_id, medication_name, dosage, frequency, start_date, end_date, notes)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """, (user_id, med.get('medication_name'), med.get('dosage'), med.get('frequency'),
                              med.get('start_date'), med.get('end_date'), med.get('notes')))

                    # Clear existing meals and insert new ones
                    cur.execute("DELETE FROM meal_logs WHERE user_id = %s", (user_id,))
                    for meal in data.meals:
                        cur.execute("""
                            INSERT INTO meal_logs (user_id, meal_name, meal_time, items, notes)
                            VALUES (%s, %s, %s, %s::jsonb, %s)
                        """, (user_id, meal.get('meal_name'), meal.get('meal_time'), json.dumps(meal.get('items', [])), meal.get('notes')))
                    
                    conn.commit()
                    return { "success": True, "message": "Data synced to PostgreSQL" }
            finally:
                pg_pool.putconn(conn)

        raise HTTPException(status_code=500, detail="PostgreSQL sync failed")
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN ENDPOINTS ---
async def verify_admin(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        # Check PG first
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT role FROM users WHERE email = %s", (email,))
                    user = cur.fetchone()
                    if user and user.get('role') == 'admin':
                        return email
            finally:
                pg_pool.putconn(conn)
        
        # Check Mongo
        user = users_collection.find_one({"email": email})
        if user and user.get('role') == 'admin':
            return email
            
        raise HTTPException(status_code=403, detail="Admin access required")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/admin/stats")
async def get_admin_stats(request: Request):
    await verify_admin(request)
    stats = {}
    if pg_pool:
        conn = pg_pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM users")
                stats['total_users'] = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM user_medications")
                stats['total_medications_logged'] = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM meal_logs")
                stats['total_meals_logged'] = cur.fetchone()[0]
        finally:
            pg_pool.putconn(conn)
    
    # MongoDB stats
    stats['mongodb_users'] = users_collection.count_documents({})
    stats['last_sync'] = datetime.utcnow()
    
    return { "success": True, "stats": stats }

@app.get("/api/admin/users")
async def get_all_users(request: Request):
    await verify_admin(request)
    users = []
    if pg_pool:
        conn = pg_pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, name, email, role, created_at, onboarding_complete FROM users ORDER BY created_at DESC")
                users = cur.fetchall()
        finally:
            pg_pool.putconn(conn)
    
    return { "success": True, "users": users }


# 2. Search Foods
@app.get("/api/search/foods")
def search_foods(
    q: str = Query(..., description="Search query for food"),
    limit: int = Query(10, description="Limit results")
):
    """
    Search foods table by "food_name" or "name_hindi" (case-insensitive, partial match)
    """
    try:
        pool = get_db_pool()
        if not pool:
            raise HTTPException(status_code=500, detail="Database connection setup failed")
        
        conn = pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                q_pg = f"%{q}%"
                cur.execute("""
                    SELECT id, food_name, food_group, 
                           ROUND(CAST(calories AS numeric), 2) as calories,
                           ROUND(CAST(protein AS numeric), 2) as protein,
                           ROUND(CAST(carbs AS numeric), 2) as carbs,
                           ROUND(CAST(fat AS numeric), 2) as fat,
                           ROUND(CAST(fiber AS numeric), 2) as fiber,
                           name_hindi
                    FROM foods 
                    WHERE food_name ILIKE %s OR name_hindi ILIKE %s 
                    LIMIT %s
                """, (q_pg, q_pg, limit))
                results = cur.fetchall()
                return {
                    "success": True,
                    "query": q,
                    "results": results,
                    "count": len(results),
                    "db": "postgresql"
                }
        finally:
            if 'pool' in locals() and pool and 'conn' in locals():
                pool.putconn(conn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# 3. Search Drugs
@app.get("/api/search/drugs")
def search_drugs(
    q: str = Query(..., description="Search query for drugs"),
    limit: int = Query(10, description="Limit results")
):
    """
    Search drugs table by "medicine_name" (case-insensitive, partial match)
    """
    try:
        pool = get_db_pool()
        if not pool:
            raise HTTPException(status_code=500, detail="Database connection setup failed")
            
        conn = pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                q_pg = f"%{q}%"
                cur.execute("""
                    SELECT * FROM medications 
                    WHERE medicine_name ILIKE %s 
                    LIMIT %s
                """, (q_pg, limit))
                results = cur.fetchall()
                return {
                    "success": True,
                    "query": q,
                    "results": results,
                    "count": len(results),
                    "db": "postgresql"
                }
        finally:
            if 'pool' in locals() and pool and 'conn' in locals():
                pool.putconn(conn)
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
    """
    try:
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    f_pg = f"%{food}%"
                    d_pg = f"%{drug}%"
                    cur.execute("""
                        SELECT * FROM food_drug_interactions 
                        WHERE (food_name ILIKE %s AND drug_name ILIKE %s)
                        OR (food_name ILIKE %s AND drug_name ILIKE %s)
                        ORDER BY 
                            CASE severity 
                                WHEN 'High' THEN 0 
                                WHEN 'Medium' THEN 1 
                                WHEN 'Low' THEN 2 
                                ELSE 3 
                            END
                    """, (f_pg, d_pg, food, drug))
                    results = cur.fetchall()
                    
                    severity_counts = {
                        "high": sum(1 for item in results if item.get("severity") == "High"),
                        "medium": sum(1 for item in results if item.get("severity") == "Medium"),
                        "low": sum(1 for item in results if item.get("severity") == "Low")
                    }
                    
                    risk_level = "safe"
                    if severity_counts["high"] > 0: risk_level = "danger"
                    elif severity_counts["medium"] > 0: risk_level = "warning"
                    elif severity_counts["low"] > 0: risk_level = "caution"
                    
                    return {
                        "success": True,
                        "food": food,
                        "drug": drug,
                        "has_interaction": len(results) > 0,
                        "risk_level": risk_level,
                        "interactions": results,
                        "count": len(results),
                        "severity_breakdown": severity_counts,
                        "db": "postgresql"
                    }
            finally:
                pg_pool.putconn(conn)

        raise HTTPException(status_code=404, detail="Interaction results not found in PostgreSQL")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interaction check failed: {str(e)}")


@app.get("/api/interactions/drug/{drug_name}")
def get_drug_interactions(drug_name: str):
    """
    Get all known interactions for a specific drug
    """
    try:
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM food_drug_interactions WHERE drug_name ILIKE %s", (f"%{drug_name}%",))
                    results = cur.fetchall()
                    
                    # Sort by severity
                    severity_order = {"High": 0, "Medium": 1, "Low": 2}
                    results.sort(key=lambda x: severity_order.get(x.get("severity", "Low"), 3))
                    
                    return {
                        "success": True,
                        "drug": drug_name,
                        "interactions": results,
                        "count": len(results),
                        "db": "postgresql"
                    }
            finally:
                pg_pool.putconn(conn)
        
        raise HTTPException(status_code=500, detail="PostgreSQL not available")
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
        
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    for food in foods:
                        food_interactions = []
                        highest_severity = "Low"
                        
                        for medication in medications:
                            f_pg = f"%{food}%"
                            m_pg = f"%{medication}%"
                            cur.execute("""
                                SELECT * FROM food_drug_interactions 
                                WHERE (food_name ILIKE %s AND drug_name ILIKE %s)
                                OR (food_name ILIKE %s AND drug_name ILIKE %s)
                            """, (f_pg, m_pg, food, medication))
                            interactions = cur.fetchall()
                            
                            for interaction in interactions:
                                food_interactions.append(interaction)
                                severity = interaction.get("severity", "Low")
                                if severity == "High": highest_severity = "High"
                                elif severity == "Medium" and highest_severity != "High": highest_severity = "Medium"
                        
                        if food_interactions:
                            risky_foods.add(food)
                            food_risk_map[food] = highest_severity
                            all_interactions.extend(food_interactions)
            finally:
                pg_pool.putconn(conn)
        else:
            raise HTTPException(status_code=500, detail="PostgreSQL not available")
        
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
        # --- PostgreSQL Implementation ---
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    q_prefix = f"{q}%"
                    q_any = f"%{q}%"
                    
                    if type.lower() == "drug":
                        # 1. Search in PostgreSQL Medications
                        cur.execute("""
                            (SELECT medicine_name as name, category, uses as subtext, medicine_name as raw, 1 as priority
                             FROM medications WHERE medicine_name ILIKE %s LIMIT %s)
                            UNION
                            (SELECT medicine_name as name, category, uses as subtext, medicine_name as raw, 2 as priority
                             FROM medications WHERE medicine_name ILIKE %s LIMIT %s)
                            ORDER BY priority ASC
                            LIMIT %s
                        """, (q_prefix, limit, q_any, limit, limit))
                        pg_results = cur.fetchall()
                        
                        suggestions = []
                        for r in pg_results:
                            name = r['name'].title()
                            subtext = r['subtext'] or ("Prescription Medication" if r['category'] == 'Prescription' else (r['category'] or "Health Medication"))
                            if not any(s['name'] == name for s in suggestions):
                                suggestions.append({
                                    "name": name,
                                    "raw": r['raw'],
                                    "category": "Medication",
                                    "subtext": subtext
                                })
                        
                        return { "success": True, "suggestions": suggestions[:limit], "db": "postgresql" }
                    
                    else:
                        lang_col = { "hi": "name_hindi", "ta": "name_tamil", "ml": "name_malayalam" }.get(lang.lower(), "food_name")
                        
                        # Multi-language search with priority to prefix
                        cur.execute(f"""
                            (SELECT food_name as name, food_group as category, 
                                   concat(ROUND(CAST(calories AS numeric), 2), ' kcal | ', ROUND(CAST(protein AS numeric), 2), 'g protein') as subtext,
                                   food_name as raw, 1 as priority
                             FROM foods 
                             WHERE food_name ILIKE %s OR name_hindi ILIKE %s OR name_tamil ILIKE %s OR name_malayalam ILIKE %s
                             LIMIT %s)
                            UNION
                            (SELECT food_name as name, food_group as category, 
                                   concat(ROUND(CAST(calories AS numeric), 2), ' kcal | ', ROUND(CAST(protein AS numeric), 2), 'g protein') as subtext,
                                   food_name as raw, 2 as priority
                             FROM foods 
                             WHERE food_name ILIKE %s OR name_hindi ILIKE %s OR name_tamil ILIKE %s OR name_malayalam ILIKE %s
                             LIMIT %s)
                            ORDER BY priority ASC
                            LIMIT %s
                        """, (q_prefix, q_prefix, q_prefix, q_prefix, limit, 
                              q_any, q_any, q_any, q_any, limit, limit))
                        
                        results = cur.fetchall()
                        suggestions = []
                        for r in results:
                            # Naturalize and deduplicate
                            if not any(s['name'] == r['name'] for s in suggestions):
                                suggestions.append({
                                    "name": r['name'],
                                    "subtext": r['subtext'],
                                    "category": r['category'] or "Food",
                                    "raw": r['raw']
                                })
                        
                        return { "success": True, "suggestions": suggestions[:limit], "db": "postgresql" }
            finally:
                pg_pool.putconn(conn)
        else:
            collection = foods_collection
            lang_map = {
                "hi": "name_hindi",
                "ta": "name_tamil",
                "ml": "name_malayalam",
                "en": "Food"
            }
            target_field = lang_map.get(lang.lower(), "Food")
            
            # Escape query for safe regex
            q_esc = re.escape(q)
            
            # Cross-language search
            query_obj = {
                "$or": [
                    {"Food": {"$regex": q_esc, "$options": "i"}},
                    {"name_hindi": {"$regex": q_esc, "$options": "i"}},
                    {"name_tamil": {"$regex": q_esc, "$options": "i"}},
                    {"name_malayalam": {"$regex": q_esc, "$options": "i"}}
                ]
            }
            
            # Fetch more candidates to allow meaningful deduplication
            cursor = list(collection.find(query_obj).limit(limit * 15))
            
            # --- Fallback for common foods (PRIORITIZING Kerala, TN, Karnataka) ---
            common_foods = [
                # Kerala Staples
                {"name": "Puttu (Rice & Coconut)", "cal": 230, "prot": 5, "cat": "Kerala Breakfast"},
                {"name": "Appam (Fermented Rice Pancake)", "cal": 120, "prot": 2, "cat": "Kerala Breakfast"},
                {"name": "Avial (Mixed Vegetable Kerala)", "cal": 150, "prot": 3, "cat": "Kerala Side"},
                {"name": "Matta Rice (Kerala Red Rice)", "cal": 130, "prot": 3, "cat": "Grains"},
                {"name": "Fish Curry (Kerala Style)", "cal": 180, "prot": 22, "cat": "Seafood"},
                {"name": "Kappa (Tapioca Cooked)", "cal": 160, "prot": 1.5, "cat": "Kerala Staple"},
                {"name": "Beef Fry (Nadan)", "cal": 290, "prot": 24, "cat": "Kerala Side"},
                # Tamil Nadu Staples
                {"name": "Idli (2 pieces)", "cal": 120, "prot": 4, "cat": "TN Breakfast"},
                {"name": "Dosa (Plain)", "cal": 160, "prot": 3, "cat": "TN Breakfast"},
                {"name": "Sambhar (Vegetable)", "cal": 80, "prot": 5, "cat": "TN Side"},
                {"name": "Pongal (Ven Pongal)", "cal": 210, "prot": 6, "cat": "TN Breakfast"},
                {"name": "Medu Vada (1 piece)", "cal": 95, "prot": 2.5, "cat": "TN Snack"},
                {"name": "Curd Rice (Thayir Sadam)", "cal": 190, "prot": 5, "cat": "TN Staple"},
                # Karnataka Staples
                {"name": "Ragi Mudde (Millet Ball)", "cal": 210, "prot": 7, "cat": "Karnataka Staple"},
                {"name": "Bisi Bele Bath", "cal": 280, "prot": 9, "cat": "Karnataka Staple"},
                {"name": "Akki Roti", "cal": 180, "prot": 4, "cat": "Karnataka Breakfast"},
                {"name": "Neer Dosa", "cal": 100, "prot": 2, "cat": "Karnataka Breakfast"},
                # Essential Indian
                {"name": "Dal (Cooked)", "cal": 116, "prot": 9, "cat": "Indian Staple"},
                {"name": "Chapati/Roti", "cal": 264, "prot": 9, "cat": "Indian Staple"},
                {"name": "Chicken Curry", "cal": 220, "prot": 25, "cat": "Main Course"},
                {"name": "Paneer Butter Masala", "cal": 320, "prot": 12, "cat": "Main Course"}
            ]
            
            suggestions = []
            q_clean = q.lower().strip()
            
            # 1. ALWAYS inject matching regional staples FIRST (High UX)
            for f in common_foods:
                if q_clean in f["name"].lower():
                    suggestions.append({
                        "name": f["name"],
                        "subtext": f"{f['cal']} kcal | {f['prot']}g protein per 100g",
                        "category": f["cat"],
                        "raw": f["name"]
                    })
                if len(suggestions) >= limit: break

            # Naturalization Engine
            abbrev_map = {
                "CRL": "Cereal", "JUC": "Juice", "DSSRT": "Dessert", "FRT": "Fruit",
                "W/": "with", "W/O": "without", "HP": "High Protein", "BEV": "Beverage",
                "STR": "Strained", "DRY": "Dry", "INST": "Instant", "BF": "Baby Food",
                "APPL": "Apple", "ORNG": "Orange", "CND": "Canned", "BTLD": "Bottled",
                "CNG": "Canned", "PUDD": "Pudding", "HIPROT": "High Protein", "LOFAT": "Low Fat"
            }
            
            categories = {"BABYFOOD", "BEVERAGES", "CEREALS", "FATS", "FRUITS", "GRAINS", "MEATS", "VEGETABLES", "DAIRY", "SNACKS", "SOUPS", "SPICES", "SWEETS", "CRL", "DSSRT", "JUC", "FRT", "BEV", "GERBER", "BEECH-NUT"}

            for doc in cursor:
                english = doc.get("Food")
                localized = doc.get(target_field)
                raw_name = localized if localized and localized.strip() else english
                if not raw_name: continue

                # Deep Clean and Naturalize
                parts = [p.strip() for p in raw_name.split(',')]
                clean_parts = []
                primary_labels = []
                
                for p in parts:
                    p_up = p.upper()
                    mapped = abbrev_map.get(p_up, p.title())
                    if p_up in categories:
                        primary_labels.append(mapped)
                    else:
                        clean_parts.append(mapped)

                # Find the 'Hook' (part that contains the query)
                main_title = ""
                other_details = []
                for p in clean_parts:
                    if q.lower() in p.lower() and not main_title:
                        main_title = p
                    else:
                        other_details.append(p)
                
                if not main_title and clean_parts:
                    main_title = clean_parts[0]
                    other_details = clean_parts[1:]
                
                # Consolidate labels (e.g., "Apple Babyfood")
                for label in primary_labels:
                    if label.lower() not in main_title.lower():
                        main_title = f"{main_title} {label}"
                
                final_name = main_title.strip()
                final_subtext = ", ".join(other_details).lower()

                # Deduplicate by final name to prevent "duplicate entries for same food" issue
                if not any(s['name'].lower() == final_name.lower() for s in suggestions):
                    suggestions.append({
                        "name": final_name,
                        "subtext": final_subtext,
                        "category": doc.get("food_group_nin") or "Food",
                        "raw": raw_name
                    })
                    if len(suggestions) >= limit:
                        break
        
        return {
            "success": True,
            "query": q,
            "type": type,
            "lang": lang,
            "suggestions": suggestions,
            "count": len(suggestions),
            "db": "mongodb"
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Autocomplete failed: {str(e)}")


# 6. Get Food Details
@app.get("/api/food/{food_name}")
def get_food_details(food_name: str):
    """
    Get specific food by searching across all name fields
    """
    try:
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, food_name, food_group, 
                               ROUND(CAST(calories AS numeric), 2) as calories,
                               ROUND(CAST(protein AS numeric), 2) as protein,
                               ROUND(CAST(carbs AS numeric), 2) as carbs,
                               ROUND(CAST(fat AS numeric), 2) as fat,
                               ROUND(CAST(fiber AS numeric), 2) as fiber,
                               name_hindi, name_tamil, name_malayalam
                        FROM foods 
                        WHERE food_name ILIKE %s OR name_hindi ILIKE %s OR name_tamil ILIKE %s OR name_malayalam ILIKE %s
                        LIMIT 1
                    """, (food_name, food_name, food_name, food_name))
                    doc = cur.fetchone()
                    if doc:
                        # Rename for frontend compatibility
                        doc['Food'] = doc['food_name']
                        return { "success": True, "food": doc, "db": "postgresql" }
            finally:
                pg_pool.putconn(conn)

        # Fallback to MongoDB
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
        return { "success": True, "food": serialize_doc(doc), "db": "mongodb" }
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
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM medications WHERE medicine_name ILIKE %s LIMIT 1", (medicine_name,))
                    doc = cur.fetchone()
                    if doc:
                        # Rename for frontend compatibility
                        if 'medicine_name' in doc: doc['Medicine Name'] = doc['medicine_name']
                        return { "success": True, "drug": doc, "db": "postgresql" }
            finally:
                pg_pool.putconn(conn)

        raise HTTPException(status_code=404, detail="Drug profile not found in PostgreSQL")
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
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    q_pg = f"%{q}%"
                    cur.execute("""
                        SELECT * FROM medications 
                        WHERE medicine_name ILIKE %s OR composition ILIKE %s 
                        LIMIT %s
                    """, (q_pg, q_pg, limit))
                    results = cur.fetchall()
                    return { "success": True, "query": q, "results": results, "count": len(results), "db": "postgresql" }
            finally:
                pg_pool.putconn(conn)
        raise HTTPException(status_code=500, detail="PostgreSQL not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Side effects search failed: {str(e)}")


@app.get("/api/drugs/side-effects/{drug_name}")
def get_drug_side_effects_details(drug_name: str):
    """
    Get full safety profile for a specific drug
    """
    try:
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM medications WHERE medicine_name ILIKE %s", (medicine_name,))
                    doc = cur.fetchone()
                    if doc: return { "success": True, "drug": doc }
                    raise HTTPException(status_code=404, detail="Drug safety profile not found")
            finally:
                pg_pool.putconn(conn)
        raise HTTPException(status_code=500, detail="PostgreSQL not available")
    except HTTPException: raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving drug details: {str(e)}")

# 8. Database Statistics
@app.get("/api/stats")
def get_stats():
    """
    Return count of foods, drugs, interactions and total records
    """
    try:
        counts = {}
        if pg_pool:
            conn = pg_pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM foods")
                    counts['foods'] = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM medications")
                    counts['drugs'] = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM food_drug_interactions")
                    counts['interactions'] = cur.fetchone()[0]
                    return { "success": True, "database": "PostgreSQL", "collections": counts, "total_records": sum(counts.values()) }
            finally:
                pg_pool.putconn(conn)
        raise HTTPException(status_code=500, detail="PostgreSQL not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats failed: {str(e)}")


# 9. Health Check
@app.get("/health")
def health_check():
    """
    Check if MongoDB is connected and return healthy/unhealthy status
    """
    try:
        if pg_pool:
            conn = pg_pool.getconn()
            pg_pool.putconn(conn)
            return { "status": "healthy", "database": "PostgreSQL connected", "message": "MediNutri API is fully operational" }
        return { "status": "unhealthy", "database": "PostgreSQL disconnected", "error": "Pool not initialized" }
    except Exception as e:
        return { "status": "unhealthy", "database": "disconnected", "error": str(e) }

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
            # PostgreSQL Logic for AI checks
            found_hits = 0
            if pg_pool:
                conn = pg_pool.getconn()
                try:
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                        for med in meds:
                            cur.execute("SELECT * FROM food_drug_interactions WHERE drug_name ILIKE %s LIMIT 3", (f"%{med['name']}%",))
                            drug_interactions = cur.fetchall()
                            if drug_interactions:
                                response_buffer.append(f"⚠️ **Potential alerts for {med['name']}**:\n")
                                for i in drug_interactions:
                                    severity_icon = "🔴" if i.get('severity') == 'High' else "🟡"
                                    response_buffer.append(f"{severity_icon} **{i['food_name']}**: {i.get('interaction_text', '')}\n")
                                found_hits += 1
                                found_issue = True
                finally:
                    pg_pool.putconn(conn)
            
            if found_hits == 0:
                response_buffer.append("✅ I didn't find specific food interactions for your current medication list in my database.")
            else:
                response_buffer.append("\n**Recommendation:** Review the [Check Safety](/interactions) page for details.")

    elif intent == "side_effects":
        # Extract drug name from message
        target_drug = None
        
        # Check active meds first
        active_meds = user_context.get("medications", [])
        for med in active_meds:
            if med["name"].lower() in last_message:
                target_drug = med["name"]
                break
        
        if not target_drug:
            words = last_message.split()
            if pg_pool:
                conn = pg_pool.getconn()
                try:
                    with conn.cursor() as cur:
                        for w in words:
                            clean_w = re.sub(r'[^\w]', '', w)
                            if len(clean_w) > 3:
                                cur.execute("SELECT id FROM medications WHERE medicine_name ILIKE %s LIMIT 1", (f"%{clean_w}%",))
                                if cur.fetchone():
                                    target_drug = clean_w
                                    break
                finally:
                    pg_pool.putconn(conn)
        
        if target_drug:
            if pg_pool:
                conn = pg_pool.getconn()
                try:
                    with conn.cursor(cursor_factory=RealDictCursor) as cur:
                        cur.execute("SELECT * FROM medications WHERE medicine_name ILIKE %s LIMIT 1", (f"%{target_drug}%",))
                        drug_doc = cur.fetchone()
                finally:
                    pg_pool.putconn(conn)
            
            if drug_doc:
                response_buffer.append(f"### Safety Profile for **{drug_doc.get('medicine_name')}**\n\n")
                if drug_doc.get('side_effects'):
                    response_buffer.append(f"ℹ️ **Side Effects**:\n {drug_doc.get('side_effects')}\n")
                if drug_doc.get('uses'):
                    response_buffer.append(f"\n**Commonly used for:** {drug_doc.get('uses')}")
                if drug_doc.get('composition'):
                    response_buffer.append(f"\n**Composition:** {drug_doc.get('composition')}")
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
    print("Database: PostgreSQL (active)")
    print("MongoDB: Disabled (Architecture simplified)")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
