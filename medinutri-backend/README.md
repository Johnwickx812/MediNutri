# MediNutri - Full Stack Application

This is the complete backend and frontend integration guide for the MediNutri application.

## 📋 Project Overview

MediNutri is a health application that provides information on foods, drugs, and checks for potential food-drug interactions.
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (SQLAlchemy / Psycopg2)
- **Frontend**: React (Vite)

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+
- PostgreSQL database instance (local or hosted)

### 1. Database Setup
1. Ensure PostgreSQL is running.
2. Create a database named `medinutri`.
3. Set your `DATABASE_URL` in the `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/medinutri
   ```
4. Run migrations/table creation:
   ```bash
   cd medinutri-backend
   python app/create_db.py
   ```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd medinutri-backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python main.py
```

You should see:
```
🚀 Starting MediNutri API Server...
... Uvicorn running on http://0.0.0.0:8000
```

### 3. API Documentation
Once running, open your browser to:
- Interactive Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🛠 API Endpoints

### Food & Drug Search
- **GET /api/search/foods?q=apple**: Search foods by name.
- **GET /api/search/drugs?q=aspirin**: Search drugs by name.
- **GET /api/search/interactions?food=grapefruit&drug=statin**: Check interactions.
- **GET /api/search/autocomplete?q=app&type=food**: Get search suggestions.

### User Data & Sync
- **POST /api/user/sync**: Sync local medication and diet data to cloud.
- **GET /api/user/data**: Retrieve cloud-synced user data.

### Drug Safety
- **GET /api/drugs/side-effects/search?q=drugname**: Get comprehensive safety profiles and side effects.

---

## 💻 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd medinutri-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment Notes (Production)

1. **Database**: Use a cloud provider like Render PostgreSQL, Supabase, or AWS RDS.
2. **Environment**: Ensure `SECRET_KEY` and `DATABASE_URL` are set in production environment variables.
3. **CORS**: Update `origins` list in `main.py` if deploying to a custom domain.

---
*Verified for PostgreSQL migration - 2026-02-27*
