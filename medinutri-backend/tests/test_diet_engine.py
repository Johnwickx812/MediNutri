import pytest
from app.services.diet_engine import DietEngine
from app.models.all_models import PatientProfile

def test_calculate_bmr_male():
    # Mifflin-St Jeor: (10 * 80) + (6.25 * 180) - (5 * 30) + 5 = 800 + 1125 - 150 + 5 = 1780
    bmr = DietEngine.calculate_bmr(weight=80, height=180, age=30, gender="male")
    assert bmr == 1780

def test_calculate_bmr_female():
    # Mifflin-St Jeor: (10 * 60) + (6.25 * 160) - (5 * 25) - 161 = 600 + 1000 - 125 - 161 = 1314
    bmr = DietEngine.calculate_bmr(weight=60, height=160, age=25, gender="female")
    assert bmr == 1314

def test_calculate_tdee():
    bmr = 1500
    # Moderate: 1.55 * 1500 = 2325
    tdee = DietEngine.calculate_tdee(bmr, "moderate")
    assert tdee == 2325

@pytest.mark.asyncio
async def test_get_diet_targets_kidney_patient():
    engine = DietEngine()
    profile = PatientProfile(
        weight=70.0,
        height=170.0,
        gender="male",
        activity_level="sedentary",
        health_goals="Weight maintenance",
        medical_conditions={"kidney_disease": True}
    )
    # BMR: (10*70) + (6.25*170) - (5*40) + 5 = 700 + 1062.5 - 200 + 5 = 1567.5
    # TDEE (sedentary 1.2): 1567.5 * 1.2 = 1881
    # Kidney protein ratio: 0.12
    # Target Cal: 1881
    # Protein: (1881 * 0.12) / 4 = 56.43 -> round 56g
    
    targets = await engine.get_diet_targets(profile, age=40)
    
    assert targets["target_calories"] == 1881
    assert targets["macros"]["protein"] == 56
    # Carbs: 1.0 - 0.12 - 0.25 = 0.63
    # Carbs: (1881 * 0.63) / 4 = 296.2575 -> round 296
    assert targets["macros"]["carbs"] == 296

@pytest.mark.asyncio
async def test_get_diet_targets_diabetes():
    engine = DietEngine()
    profile = PatientProfile(
        weight=80.0,
        height=175.0,
        gender="male",
        activity_level="moderate",
        health_goals="diabetes management",
        medical_conditions={"diabetes": True}
    )
    targets = await engine.get_diet_targets(profile, age=50)
    assert targets["restrictions"]["sugar"] == "25g"
