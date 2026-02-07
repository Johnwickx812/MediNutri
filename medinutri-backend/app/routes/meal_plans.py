from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from app.schemas.meal_plan import MealPlanCreate, MealPlanResponse, MealPlanUpdate
from app.models.user import UserModel
from app.services.meal_service import meal_service
from app.routes.auth import get_current_user

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])

@router.post("/", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_meal_plan(
    meal_plan: MealPlanCreate,
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    return await meal_service.create_meal_plan(meal_plan, str(current_user.id))

@router.get("/", response_model=List[MealPlanResponse])
async def get_meal_plans(
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    return await meal_service.get_user_meal_plans(str(current_user.id))

@router.put("/{plan_id}", response_model=MealPlanResponse)
async def update_meal_plan(
    plan_id: str,
    plan_update: MealPlanUpdate,
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    updated_plan = await meal_service.update_meal_plan(plan_id, str(current_user.id), plan_update)
    if not updated_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return updated_plan

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_plan(
    plan_id: str,
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    success = await meal_service.delete_meal_plan(plan_id, str(current_user.id))
    if not success:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return None
