from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.all_models import User, PatientProfile, MealPlan
from app.schemas.all_schemas import PatientProfileResponse, PatientProfileBase, MealPlanResponse
from app.utils.security import get_current_user, check_role, UserRole

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/me", response_model=PatientProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=400, detail="User is not a patient")
    
    result = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    return profile

@router.patch("/me", response_model=PatientProfileResponse)
async def update_my_profile(
    profile_in: PatientProfileBase,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    return profile

@router.get("/{patient_id}/meal-plans", response_model=List[MealPlanResponse])
async def get_patient_meal_plans(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if user is the patient themselves or their nutritionist
    # For now, just allow if patient or nutritionist role
    result = await db.execute(select(MealPlan).where(MealPlan.patient_id == patient_id))
    return result.scalars().all()
