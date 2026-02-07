from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.database import get_db
from app.models.all_models import User, NutritionistProfile
from app.schemas.all_schemas import NutritionistProfileResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/nutritionists", tags=["nutritionists"])

@router.get("", response_model=List[NutritionistProfileResponse])
async def list_nutritionists(
    specialization: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(NutritionistProfile)
    if specialization:
        query = query.where(NutritionistProfile.specializations.contains([specialization]))
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{nutritionist_id}", response_model=NutritionistProfileResponse)
async def get_nutritionist(
    nutritionist_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(NutritionistProfile).where(NutritionistProfile.id == nutritionist_id))
    nutritionist = result.scalar_one_or_none()
    if not nutritionist:
        raise HTTPException(status_code=404, detail="Nutritionist not found")
    return nutritionist
