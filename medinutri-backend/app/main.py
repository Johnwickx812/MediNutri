from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, patients, nutritionists, food_logs, health_metrics, appointments, ai

app = FastAPI(
    title="MediNutri Backend",
    description="Medical Nutrition Platform API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(nutritionists.router, prefix="/api")
app.include_router(food_logs.router, prefix="/api")
app.include_router(health_metrics.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

from app.data_manager import data_manager

# ... existing code ...

@app.get("/api/search")
async def search_data(q: str):
    return data_manager.search(q)

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": "MediNutri Backend"}
