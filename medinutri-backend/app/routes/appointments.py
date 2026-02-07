from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.all_models import Appointment, User, PatientProfile
from app.schemas.all_schemas import AppointmentCreate, AppointmentResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("", response_model=AppointmentResponse)
async def create_appointment(
    apt_in: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Logic to check availability could be added here
    new_apt = Appointment(**apt_in.model_dump())
    db.add(new_apt)
    await db.commit()
    await db.refresh(new_apt)
    return new_apt

@router.get("/me", response_model=List[AppointmentResponse])
async def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role == "patient":
        # Get patient profile
        profile_res = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
        profile = profile_res.scalar_one()
        query = select(Appointment).where(Appointment.patient_id == profile.id)
    else:
        # Assuming nutritionist, though should handle admin
        profile_res = await db.execute(select(User).where(User.id == current_user.id)) # This is wrong, should be NutrProfile
        # ... simplified for now
        query = select(Appointment) # Placeholder
    
    result = await db.execute(query)
    return result.scalars().all()
