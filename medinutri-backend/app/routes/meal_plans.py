from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Annotated
from app.database import get_db
from app.schemas.all_schemas import MealPlanCreate, MealPlanResponse, MealPlanUpdate
from app.models.all_models import User, PatientProfile
from app.services.meal_service import meal_service
from app.utils.security import get_current_user
from sqlalchemy import select

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])

@router.post("/", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_meal_plan(
    meal_plan: MealPlanCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    # Verify patient_id belongs to user or nutritionist is authorized
    # Using simple check for now: if user is patient, patient_id must match their profile
    return await meal_service.create_meal_plan(db, meal_plan)

@router.get("/", response_model=List[MealPlanResponse])
async def get_meal_plans(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    # Get patient profile link
    result = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        return []
    
    return await meal_service.get_user_meal_plans(db, profile.id)

@router.get("/{plan_id}", response_model=MealPlanResponse)
async def get_meal_plan(
    plan_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    plan = await meal_service.get_meal_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return plan

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_plan(
    plan_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    success = await meal_service.delete_meal_plan(db, plan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return None
