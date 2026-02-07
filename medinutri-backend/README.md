# MediNutri - Full Stack Application

This is the complete backend and frontend integration guide for the MediNutri application.

## 📋 Project Overview

MediNutri is a health application that provides information on foods, drugs, and checks for potential food-drug interactions.
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Frontend**: Integration with Lovable (React)

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+
- MongoDB installed and running on `localhost:27017`

### 1. Database Setup
1. Ensure MongoDB is running.
2. Create a database named `medinutri`.
3. Import your data into three collections:
   - `foods`
   - `drugs`
   - `food_drug_interactions`

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
✅ Connected to MongoDB: medinutri
🚀 Starting MediNutri API Server...
... Uvicorn running on http://0.0.0.0:8000
```

### 3. API Documentation
Once running, open your browser to:
- Interactive Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🛠 API Endpoints

### Search
- **GET /api/search/foods?q=apple**: Search foods by name.
- **GET /api/search/drugs?q=aspirin**: Search drugs by name.
- **GET /api/search/interactions?food=grapefruit&drug=statin**: Check interactions.
- **GET /api/search/autocomplete?q=app&type=food**: Get search suggestions.

### Details
- **GET /api/food/{food_name}**: Get detailed food info.
- **GET /api/drug/{medicine_name}**: Get detailed drug info.

### System
- **GET /api/stats**: Database record counts.
- **GET /health**: System health status.

---

## 💻 Frontend Integration (Lovable)

Copy the code from `frontend-integration.js` into your Lovable application to connect to this backend.

### How it Works

1. **User Searches for Food**:
   - User types "apple" -> Frontend calls `searchFoods("apple")`.
   - Backend searches MongoDB "foods" collection (case-insensitive).
   - Returns result list to display.

2. **User Searches for Drug**:
   - User types "aspirin" -> Frontend calls `searchDrugs("aspirin")`.
   - Backend searches "drugs" collection.
   - Returns full details including side effects and reviews.

3. **Check Interaction**:
   - User selects a food and a drug -> `checkInteractions(food, drug)` is called.
   - Backend checks for matches in `food_drug_interactions`.
   - Returns warning if interaction exists (e.g., High Severity).

4. **Autocomplete**:
   - As user types, `getAutocompleteSuggestions` is called.
   - Backend performs a fast prefix search (`^query`) to return suggestions immediately.

---

## 🧪 Testing Instructions

1. **Start MongoDB**: Ensure `mongod` is running.
2. **Import Data**: Use MongoDB Compass to import your CSV/JSON datasets.
3. **Run Backend**: Execute `python main.py`.
4. **Browser Test**: Go to `http://localhost:8000/api/search/foods?q=apple`.
   - *Expected*: JSON response with food data.
5. **Frontend Test**: Use the `FoodSearchComponent` from `frontend-integration.js` to verify UI updates.

---

## ☁️ Deployment Notes (Production)

1. **Database**: Use a cloud provider like MongoDB Atlas.
2. **Configuration**: Update `.env` with your production connection string:
   ```env
   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/medinutri
   ```
3. **CORS**: Update `allow_origins` in `main.py` to allow only your production frontend domain.
4. **Hosting**: Deploy this FastAPI app to Render, Railway, or standard VPS.
5. **Frontend**: Update `API_URL` in your JS code to point to the deployed backend.

