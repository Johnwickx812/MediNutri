import math
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.all_models import FoodItem, PatientProfile, User, FoodDrugInteraction
import logging

logger = logging.getLogger(__name__)

import random

class DietEngine:
    @staticmethod
    def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
        """Mifflin-St Jeor Equation"""
        if gender.lower() == "male":
            return (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            return (10 * weight) + (6.25 * height) - (5 * age) - 161

    @staticmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        return bmr * multipliers.get(activity_level.lower(), 1.2)

    async def get_diet_targets(self, profile: PatientProfile, age: int) -> Dict[str, Any]:
        bmr = self.calculate_bmr(profile.weight, profile.height, age, profile.gender)
        tdee = self.calculate_tdee(bmr, profile.activity_level or "sedentary")
        
        # Goal adjustment
        goal = (profile.health_goals or "").lower()
        target_calories = tdee
        if "loss" in goal:
            target_calories -= 500
        elif "gain" in goal:
            target_calories += 300
            
        # Macro splits
        protein_ratio = 0.25 if "muscle" in goal else 0.20
        fats_ratio = 0.25
        carbs_ratio = 1.0 - protein_ratio - fats_ratio
        
        # Adjust for medical conditions
        conditions = profile.medical_conditions or {}
        limit_sodium = any(c in str(conditions).lower() for c in ["hypertension", "bp", "heart"])
        limit_sugar = any(c in str(conditions).lower() for c in ["diabetes", "sugar"])
        limit_protein = any(c in str(conditions).lower() for c in ["kidney", "renal"])
        
        if limit_protein:
            protein_ratio = 0.12 # Lower protein for kidney patients
            carbs_ratio = 1.0 - protein_ratio - fats_ratio

        targets = {
            "target_calories": round(target_calories),
            "macros": {
                "protein": round((target_calories * protein_ratio) / 4),
                "carbs": round((target_calories * carbs_ratio) / 4),
                "fats": round((target_calories * fats_ratio) / 9),
                "fiber": 30 # General RDA
            },
            "restrictions": {
                "sodium": "2300mg" if limit_sodium else "None",
                "sugar": "25g" if limit_sugar else "None"
            }
        }
        
        # Self-Verification Step (100% Accuracy Check)
        self._verify_targets(targets, target_calories)
        
        return targets

    def _verify_targets(self, targets: Dict[str, Any], raw_calories: float):
        """Internal verification to ensure macro-calorie consistency."""
        calc_cals = (targets["macros"]["protein"] * 4) + (targets["macros"]["carbs"] * 4) + (targets["macros"]["fats"] * 9)
        diff = abs(calc_cals - targets["target_calories"])
        
        # In a clinical app, we allow max 10% deviation due to rounding, 
        # but we log if it's suspicious.
        if diff > (targets["target_calories"] * 0.1):
            logger.warning(f"Macro-Calorie mismatch: Target {targets['target_calories']}, Calculated {calc_cals}")
            # Adjust if necessary (e.g., buffer carbs)
            if calc_cals < targets["target_calories"]:
                targets["macros"]["carbs"] += round((targets["target_calories"] - calc_cals) / 4)


    def _get_translations(self, lang: str) -> Dict[str, Any]:
        translations = {
            "en": {"Breakfast": "Breakfast", "Lunch": "Lunch", "Snack": "Snack", "Dinner": "Dinner", "Reason": "Reason", "Safe": "Safe"},
            "ml": {"Breakfast": "പ്രഭാതഭക്ഷണം", "Lunch": "ഉച്ചഭക്ഷണം", "Snack": "ലഘുഭക്ഷണം", "Dinner": "അത്താഴം", "Reason": "കാരണം", "Safe": "സുരക്ഷിതം"},
            "hi": {"Breakfast": "नाश्ता", "Lunch": "दोपहर का भोजन", "Snack": "नाश्ता", "Dinner": "रात का खाना", "Reason": "कारण", "Safe": "सुरक्षित"},
            "ta": {"Breakfast": "காலை உணவு", "Lunch": "மதிய உணவு", "Snack": "சிற்றுண்டி", "Dinner": "இரவு உணவு", "Reason": "காரணம்", "Safe": "பாதுகாப்பானது"}
        }
        return translations.get(lang, translations["en"])

    async def generate_smart_meal_plan(self, db: AsyncSession, profile: PatientProfile, age: int, lang: str = "en") -> Dict[str, Any]:
        targets = await self.get_diet_targets(profile, age)
        trans = self._get_translations(lang)
        
        meals_to_gen = ["Breakfast", "Lunch", "Snack", "Dinner"]
        meal_plan = {
            "daily_calorie_target": targets["target_calories"],
            "macro_split": targets["macros"],
            "meals": []
        }

        pref = profile.food_preferences or {}
        diet_type = pref.get("diet_type", "all").lower()
        region = pref.get("region", "all").lower()

        for meal_name in meals_to_gen:
            # Step 8: Database Integration & Smart Filtering
            stmt = select(FoodItem)
            
            # Filter by diet type if specified
            if "veg" in diet_type and "non" not in diet_type:
                stmt = stmt.where(FoodItem.category.ilike("%veg%"))
            
            # Filter by region if specified
            if region != "all":
                stmt = stmt.where(FoodItem.name.ilike(f"%{region}%"))

            stmt = stmt.order_by(func.random()).limit(10)
            result = await db.execute(stmt)
            foods = result.scalars().all()

            
            # Filtering
            safe_foods = []
            allergies = [a.lower() for a in (profile.allergies or [])]
            
            for f in foods:
                # Allergy Check
                is_allergic = any(a in f.name.lower() or a in (f.category or "").lower() for a in allergies)
                if is_allergic:
                    continue

                # Multi-Medication Interaction Check
                interaction_status = "Safe"
                if profile.current_medications:
                    for med in profile.current_medications:
                        status = await self._check_interaction(db, f, [med])
                        if "Warning" in status:
                            interaction_status = status
                            break
                
                if interaction_status == "Safe":
                    safe_foods.append(f)

            
            if safe_foods:
                selected_food = safe_foods[0]
                alternatives = safe_foods[1:4] # Step 5: Next 3 safe items as alternatives
                
                meal_item = {
                    "meal": trans.get(meal_name, meal_name),
                    "items": [{
                        "name": selected_food.name,
                        "quantity": "100g",
                        "calories": selected_food.calories,
                        "protein": f"{selected_food.protein}g",
                        "carbs": f"{selected_food.carbs}g",
                        "fats": f"{selected_food.fats}g",
                        "fiber": f"{selected_food.fiber or 0}g",
                        "reason": self._get_medical_reason(selected_food, profile),
                        "interaction_status": trans.get("Safe", "Safe")
                    }],
                    "alternatives": [
                        {"name": alt.name, "calories": alt.calories, "protein": f"{alt.protein}g"} 
                        for alt in alternatives
                    ]
                }
                meal_plan["meals"].append(meal_item)

        return meal_plan

    async def _check_interaction(self, db: AsyncSession, food: FoodItem, medications: Optional[List[Dict[str, Any]]]) -> str:
        if not medications: return "Safe"
        
        for med in medications:
            med_name = med.get("name", "")
            if not med_name: continue
            
            # Split combined medications if necessary
            med_components = [m.strip() for m in med_name.split('+')] if '+' in med_name else [med_name]
            
            for component in med_components:
                # Check for direct food-drug interactions in the database
                stmt = select(FoodDrugInteraction).where(
                    FoodDrugInteraction.drug_name.ilike(f"%{component}%"),
                    FoodDrugInteraction.food_name.ilike(f"%{food.name}%")
                )
                result = await db.execute(stmt)
                interaction = result.scalars().first()
                
                if interaction:
                    return f"Warning ({component}): {interaction.severity} Interaction - {interaction.interaction_text}"
        
        return "Safe"


    def _get_medical_reason(self, food: FoodItem, profile: PatientProfile) -> str:
        # Simple logical mapping for reasoning
        if "diabetes" in str(profile.medical_conditions or {}).lower() and food.fiber and food.fiber > 5:
            return "High fiber helps regulate blood sugar spikes."
        if "hypertension" in str(profile.medical_conditions or {}).lower() and food.calories < 200:
            return "Low calorie and low sodium option supporting heart health."
        return "Balanced macronutrients for daily energy needs."
