import asyncio
from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session_maker, engine, Base
from app.models.all_models import (
    User, UserRole, PatientProfile, NutritionistProfile, 
    FoodItem, MealType, Status
)
from app.utils.security import get_password_hash

async def seed_data():
    async with async_session_maker() as session:
        async with session.begin():
            # 1. Create Users
            admin = User(
                email="admin@medinutri.com",
                hashed_password=get_password_hash("admin123"),
                first_name="System",
                last_name="Admin",
                role=UserRole.ADMIN
            )
            
            nutritionist_user = User(
                email="dr.smith@medinutri.com",
                hashed_password=get_password_hash("doctor123"),
                first_name="John",
                last_name="Smith",
                role=UserRole.NUTRITIONIST
            )
            
            patient_user = User(
                email="alice@example.com",
                hashed_password=get_password_hash("alice123"),
                first_name="Alice",
                last_name="Johnson",
                role=UserRole.PATIENT,
                date_of_birth=date(1995, 5, 20)
            )
            
            session.add_all([admin, nutritionist_user, patient_user])
            await session.flush()
            
            # 2. Create Profiles
            nut_profile = NutritionistProfile(
                user_id=nutritionist_user.id,
                credentials="PhD in Clinical Nutrition, RD",
                specializations=["Diabetes Management", "Weight Loss"],
                license_number="RD123456",
                experience_years=10,
                consultation_fee=150.0,
                bio="Experienced clinical nutritionist focusing on metabolic health."
            )
            
            patient_profile = PatientProfile(
                user_id=patient_user.id,
                height=165.0,
                weight=70.0,
                gender="female",
                medical_conditions={"diabetes": "type 2"},
                allergies=["peanuts"],
                dietary_restrictions=["vegetarian"],
                health_goals="Lose 5kg and manage blood sugar levels",
                target_weight=65.0,
                activity_level="moderate"
            )
            
            session.add_all([nut_profile, patient_profile])
            
            # 3. Create Sample Food Items
            foods = [
                FoodItem(
                    name="Oatmeal",
                    category="Grains",
                    serving_size=40,
                    serving_unit="g",
                    calories=150,
                    protein=5,
                    carbs=27,
                    fats=3,
                    fiber=4,
                    is_verified=True
                ),
                FoodItem(
                    name="Greek Yogurt",
                    category="Dairy",
                    serving_size=170,
                    serving_unit="g",
                    calories=100,
                    protein=18,
                    carbs=6,
                    fats=0,
                    is_verified=True
                ),
                FoodItem(
                    name="Grilled Chicken Breast",
                    category="Proteins",
                    serving_size=100,
                    serving_unit="g",
                    calories=165,
                    protein=31,
                    carbs=0,
                    fats=3.6,
                    is_verified=True
                ),
                FoodItem(
                    name="Brown Rice",
                    category="Grains",
                    serving_size=150,
                    serving_unit="g",
                    calories=170,
                    protein=3.5,
                    carbs=35,
                    fats=1.5,
                    fiber=2,
                    is_verified=True
                )
            ]
            session.add_all(foods)
            
        print("Seed data created successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
