from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.all_models import HealthMetric, User, PatientProfile
from app.schemas.all_schemas import HealthMetricCreate, HealthMetricResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/health-metrics", tags=["health-metrics"])

@router.post("", response_model=HealthMetricResponse)
async def create_metric(
    metric_in: HealthMetricCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_metric = HealthMetric(**metric_in.model_dump())
    db.add(new_metric)
    await db.commit()
    await db.refresh(new_metric)
    return new_metric

@router.get("/progress")
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get patient profile
    profile_res = await db.execute(select(PatientProfile).where(PatientProfile.user_id == current_user.id))
    profile = profile_res.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=400, detail="User is not a patient")
    
    # Get metrics ordered by date
    result = await db.execute(
        select(HealthMetric)
        .where(HealthMetric.patient_id == profile.id)
        .order_by(HealthMetric.recorded_at.asc())
    )
    metrics = result.scalars().all()
    
    # Calculate some progress stats
    if not metrics:
        return {"metrics": [], "summary": "No data yet"}
    
    initial_weight = metrics[0].weight
    current_weight = metrics[-1].weight
    weight_change = current_weight - initial_weight if initial_weight and current_weight else 0
    
    return {
        "metrics": metrics,
        "summary": {
            "initial_weight": initial_weight,
            "current_weight": current_weight,
            "weight_change": weight_change,
            "target_weight": profile.target_weight,
            "remaining_to_goal": (current_weight - profile.target_weight) if current_weight and profile.target_weight else None
        }
    }
