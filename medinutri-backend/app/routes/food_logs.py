from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models.all_models import User, FoodLogEntry, FoodItem, PatientProfile
from app.schemas.all_schemas import FoodLogEntryCreate, FoodLogEntryResponse
from app.utils.security import get_current_user, UserRole

router = APIRouter(prefix="/food-logs", tags=["food-logs"])

@router.post("", response_model=FoodLogEntryResponse)
async def create_food_log(
    log_in: FoodLogEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get food item to calculate calories/macros
    food_result = await db.execute(select(FoodItem).where(FoodItem.id == log_in.food_item_id))
    food = food_result.scalar_one_or_none()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    # Simple calculation (assuming quantity is multiple of serving_size)
    ratio = log_in.quantity / food.serving_size
    
    calculated_calories = food.calories * ratio
    calculated_macros = {
        "protein": food.protein * ratio,
        "carbs": food.carbs * ratio,
        "fats": food.fats * ratio
    }
    
    new_log = FoodLogEntry(
        **log_in.model_dump(),
        calculated_calories=calculated_calories,
        calculated_macros=calculated_macros
    )
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/daily-summary")
async def get_daily_summary(
    date_str: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=400, detail="Only patients can view their logs")
    
    target_date = date.fromisoformat(date_str) if date_str else date.today()
    
    # Get patient profile id
    profile_result = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
    profile = profile_result.scalar_one()
    
    # Query logs for the day
    result = await db.execute(
        select(FoodLogEntry)
        .where(FoodLogEntry.patient_id == profile.id)
        .where(func.date(FoodLogEntry.consumed_at) == target_date)
    )
    logs = result.scalars().all()
    
    total_calories = sum(log.calculated_calories for log in logs)
    total_protein = sum(log.calculated_macros.get("protein", 0) for log in logs)
    total_carbs = sum(log.calculated_macros.get("carbs", 0) for log in logs)
    total_fats = sum(log.calculated_macros.get("fats", 0) for log in logs)
    
    return {
        "date": target_date,
        "total_calories": total_calories,
        "macros": {
            "protein": total_protein,
            "carbs": total_carbs,
            "fats": total_fats
        },
        "logs": logs
    }
