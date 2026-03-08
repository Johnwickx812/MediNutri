from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from app.models.all_models import MealPlan, Meal, MealIngredient, FoodItem
from app.schemas.all_schemas import MealPlanCreate, MealPlanUpdate
from typing import List, Optional
from datetime import date

class MealService:
    async def create_meal_plan(self, db: AsyncSession, plan_in: MealPlanCreate) -> MealPlan:
        # 1. Create the MealPlan header
        new_plan = MealPlan(
            patient_id=plan_in.patient_id,
            nutritionist_id=plan_in.nutritionist_id,
            plan_name=plan_in.plan_name,
            start_date=plan_in.start_date,
            end_date=plan_in.end_date,
            daily_calorie_target=plan_in.daily_calorie_target,
            macro_distribution=plan_in.macro_distribution,
            status=plan_in.status
        )
        db.add(new_plan)
        await db.flush() # Get plan ID

        # 2. Add Meals
        for meal_in in plan_in.meals:
            new_meal = Meal(
                meal_plan_id=new_plan.id,
                meal_type=meal_in.meal_type,
                name=meal_in.name,
                description=meal_in.description,
                instructions=meal_in.instructions,
                prep_time=meal_in.prep_time,
                total_calories=meal_in.total_calories
            )
            db.add(new_meal)
            await db.flush() # Get meal ID

            # 3. Add Ingredients
            for ing_in in meal_in.ingredients:
                new_ing = MealIngredient(
                    meal_id=new_meal.id,
                    food_item_id=ing_in.food_item_id,
                    quantity=ing_in.quantity,
                    unit=ing_in.unit
                )
                db.add(new_ing)
        
        await db.commit()
        await db.refresh(new_plan)
        
        # Reload with relationships
        result = await db.execute(
            select(MealPlan)
            .where(MealPlan.id == new_plan.id)
            .options(selectinload(MealPlan.meals).selectinload(Meal.ingredients))
        )
        return result.scalar_one()

    async def get_user_meal_plans(self, db: AsyncSession, patient_id: int) -> List[MealPlan]:
        result = await db.execute(
            select(MealPlan)
            .where(MealPlan.patient_id == patient_id)
            .options(selectinload(MealPlan.meals).selectinload(Meal.ingredients))
        )
        return result.scalars().all()

    async def get_meal_plan(self, db: AsyncSession, plan_id: int) -> Optional[MealPlan]:
        result = await db.execute(
            select(MealPlan)
            .where(MealPlan.id == plan_id)
            .options(selectinload(MealPlan.meals).selectinload(Meal.ingredients))
        )
        return result.scalar_one_or_none()

    async def delete_meal_plan(self, db: AsyncSession, plan_id: int) -> bool:
        plan = await self.get_meal_plan(db, plan_id)
        if not plan:
            return False
        
        await db.delete(plan)
        await db.commit()
        return True

meal_service = MealService()
