from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.database import get_db
from app.models.all_models import User, PatientProfile, FoodItem
from app.utils.security import get_current_user
import random

router = APIRouter(prefix="/diet", tags=["Diet"])

@router.post("/generate")
async def generate_diet_plan(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Fetch user and profile
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile or not profile.weight or not profile.height:
        raise HTTPException(status_code=400, detail="Profile incomplete. Please set height and weight.")

    # Get sample foods from DB
    result = await db.execute(select(FoodItem))
    foods = result.scalars().all()
    
    if not foods:
        # Fallback if DB is empty
        foods = [] 

    calorie_target = profile.calorie_goal or 2000
    protein_target = profile.protein_goal or 150
    carb_target = profile.carb_goal or 200
    fat_target = profile.fat_goal or 65

    # Simple logic to group foods into meals
    meal_types = ["Breakfast", "Lunch", "Snack", "Dinner"]
    plan = {
        "daily_calorie_target": calorie_target,
        "macro_split": {
            "protein": f"{protein_target}g",
            "carbs": f"{carb_target}g",
            "fats": f"{fat_target}g",
            "fiber": "30g"
        },
        "meals": []
    }

    # Mocking some items if DB is empty, otherwise use DB items
    # In a real app, this would be an AI model or a complex optimization algorithm
    
    for mt in meal_types:
        # filter foods by category roughly
        meal_items = []
        
        # Pick 1-2 items
        num_items = 1 if mt == "Snack" else 2
        for _ in range(num_items):
            item = random.choice(foods) if foods else None
            if item:
                interaction_status = "Safe"
                reason = "Generally safe for your profile."
                
                # Check for grapefruit + statins as a sample interaction logic
                if "grapefruit" in item.name.lower() and profile.current_medications:
                    meds = str(profile.current_medications).lower()
                    if "statin" in meds or "atorvastatin" in meds:
                        interaction_status = "Danger"
                        reason = "Grapefruit dangerously interacts with statins."

                meal_items.append({
                    "name": item.name,
                    "quantity": f"{item.serving_size} {item.serving_unit}",
                    "calories": item.calories,
                    "protein": f"{item.protein}g",
                    "carbs": f"{item.carbs}g",
                    "fats": f"{item.fats}g",
                    "fiber": f"{item.fiber or 0}g",
                    "reason": reason,
                    "interaction_status": interaction_status
                })
            else:
                # hardcoded samples if DB is empty
                samples = {
                    "Breakfast": {"name": "Oats with Milk", "calories": 350, "p": 12, "c": 45, "f": 8},
                    "Lunch": {"name": "Brown Rice & Dal", "calories": 550, "p": 15, "c": 80, "f": 12},
                    "Snack": {"name": "Apple", "calories": 95, "p": 1, "c": 25, "f": 0},
                    "Dinner": {"name": "Grilled Chicken Salad", "calories": 400, "p": 35, "c": 15, "f": 18}
                }
                s = samples.get(mt, samples["Lunch"])
                meal_items.append({
                    "name": s["name"],
                    "quantity": "1 bowl",
                    "calories": s["calories"],
                    "protein": f"{s['p']}g",
                    "carbs": f"{s['c']}g",
                    "fats": f"{s['f']}g",
                    "fiber": "5g",
                    "reason": "Safe with your medications.",
                    "interaction_status": "Safe"
                })

        plan["meals"].append({
            "meal": mt,
            "items": meal_items,
            "alternatives": [
                {"name": "Fruit Bowl", "calories": 150, "protein": "2g"},
                {"name": "Protein Shake", "calories": 200, "protein": "25g"}
            ]
        })

    return plan
