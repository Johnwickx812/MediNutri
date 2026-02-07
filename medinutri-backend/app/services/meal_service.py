from app.database import db
from app.models.meal_plan import MealPlanModel
from app.schemas.meal_plan import MealPlanCreate, MealPlanUpdate
from bson import ObjectId
from typing import List
from pymongo.collection import Collection

class MealService:
    @property
    def collection(self) -> Collection:
        return db.get_db()["meal_plans"]

    def _calculate_totals(self, meal_plan_dict: dict) -> dict:
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0

        meals = ["breakfast", "lunch", "dinner"]
        for meal in meals:
            if meal_plan_dict.get(meal):
                item = meal_plan_dict[meal]
                total_calories += item.get("calories", 0)
                total_protein += item.get("protein", 0)
                total_carbs += item.get("carbs", 0)
                total_fat += item.get("fat", 0)
        
        for snack in meal_plan_dict.get("snacks", []):
            total_calories += snack.get("calories", 0)
            total_protein += snack.get("protein", 0)
            total_carbs += snack.get("carbs", 0)
            total_fat += snack.get("fat", 0)

        meal_plan_dict["total_calories"] = total_calories
        meal_plan_dict["total_protein"] = total_protein
        meal_plan_dict["total_carbs"] = total_carbs
        meal_plan_dict["total_fat"] = total_fat
        return meal_plan_dict

    async def create_meal_plan(self, meal_plan: MealPlanCreate, user_id: str) -> MealPlanModel:
        plan_dict = meal_plan.model_dump()
        plan_dict["user_id"] = user_id
        plan_dict = self._calculate_totals(plan_dict)
        
        # Check if plan exists for date
        # existing = await self.collection.find_one({"user_id": user_id, "date": str(plan_dict["date"])})
        # If we want to prevent duplicates per day, uncomment above.
        # Requirement doesn't explicitly forbid multiple plans per day, but usually it's one.
        # I'll convert date to string as per Requirement "date" field in model
        plan_dict["date"] = str(plan_dict["date"])

        new_plan = await self.collection.insert_one(plan_dict)
        created_plan = await self.collection.find_one({"_id": new_plan.inserted_id})
        return MealPlanModel(**created_plan)

    async def get_user_meal_plans(self, user_id: str) -> List[MealPlanModel]:
        plans = await self.collection.find({"user_id": user_id}).to_list(1000)
        return [MealPlanModel(**plan) for plan in plans]

    async def get_meal_plan(self, plan_id: str, user_id: str) -> MealPlanModel:
        if not ObjectId.is_valid(plan_id):
            return None
        plan = await self.collection.find_one({"_id": ObjectId(plan_id), "user_id": user_id})
        if plan:
            return MealPlanModel(**plan)
        return None

    async def update_meal_plan(self, plan_id: str, user_id: str, plan_update: MealPlanUpdate) -> MealPlanModel:
        current_plan = await self.collection.find_one({"_id": ObjectId(plan_id), "user_id": user_id})
        if not current_plan:
            return None

        update_data = plan_update.model_dump(exclude_unset=True)
        if not update_data:
            return MealPlanModel(**current_plan)

        # We need to recalculate totals if meals changed. 
        # Merging update_data into current_plan to recalc
        merged_plan = {**current_plan, **update_data}
        # Be careful not to merge _id or non-meal fields in a way that breaks _calculate_totals if it expected dict structure
        # My _calculate_totals works on dict with keys.
        
        # If snacks are updated, we use new snacks. If not, old snacks.
        # But wait, model_dump(exclude_unset=True) means we only have changed fields.
        # If only breakfast changed, we need old lunch/dinner to calc totals?
        # Yes.
        
        # Strategy: update the document in DB? No, to calc totals we need full view.
        # Or just update the fields and then re-read and calc?
        # Better: Construct the new state in memory, calc totals, then save.
        
        # Convert date to string if present
        if "date" in update_data:
            update_data["date"] = str(update_data["date"])

        # Create a dict from current model
        # Actually current_plan is a dict from mongo.
        
        # Update current_plan dict with update_data
        current_plan.update(update_data)
        
        # Recalculate
        current_plan = self._calculate_totals(current_plan)
        
        # Remove _id from update payload
        update_payload = {k: v for k, v in current_plan.items() if k != "_id"}
        
        await self.collection.update_one(
            {"_id": ObjectId(plan_id)},
            {"$set": update_payload}
        )
        
        return MealPlanModel(**current_plan)

    async def delete_meal_plan(self, plan_id: str, user_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(plan_id), "user_id": user_id})
        return result.deleted_count > 0

meal_service = MealService()
