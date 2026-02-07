from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from app.models.all_models import UserRole, MealType, Status, AppointmentStatus

# Base Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Patient Profile Schemas
class PatientProfileBase(BaseModel):
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    medical_conditions: Optional[Dict[str, Any]] = None
    allergies: List[str] = []
    dietary_restrictions: List[str] = []
    health_goals: Optional[str] = None
    target_weight: Optional[float] = None
    activity_level: Optional[str] = None

class PatientProfileCreate(PatientProfileBase):
    user_id: int

class PatientProfileResponse(PatientProfileBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Nutritionist Profile Schemas
class NutritionistProfileBase(BaseModel):
    credentials: str
    specializations: List[str] = []
    license_number: str
    experience_years: int
    bio: Optional[str] = None
    consultation_fee: float

class NutritionistProfileCreate(NutritionistProfileBase):
    user_id: int

class NutritionistProfileResponse(NutritionistProfileBase):
    id: int
    user_id: int
    rating: float

    class Config:
        from_attributes = True

# Food Item Schemas
class FoodItemBase(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    serving_size: float
    serving_unit: str
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: Optional[float] = None
    vitamins: Optional[Dict[str, Any]] = None
    minerals: Optional[Dict[str, Any]] = None
    allergens: List[str] = []
    is_verified: bool = False

class FoodItemCreate(FoodItemBase):
    pass

class FoodItemResponse(FoodItemBase):
    id: int

    class Config:
        from_attributes = True

# Meal Ingredient Schema
class MealIngredientBase(BaseModel):
    food_item_id: int
    quantity: float
    unit: str

class MealIngredientResponse(MealIngredientBase):
    food_item: FoodItemResponse
    
    class Config:
        from_attributes = True

# Meal Schemas
class MealBase(BaseModel):
    meal_type: MealType
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    prep_time: Optional[int] = None
    total_calories: float = 0.0

class MealCreate(MealBase):
    ingredients: List[MealIngredientBase]

class MealResponse(MealBase):
    id: int
    ingredients: List[MealIngredientResponse]

    class Config:
        from_attributes = True

# Meal Plan Schemas
class MealPlanBase(BaseModel):
    plan_name: str
    start_date: date
    end_date: date
    daily_calorie_target: float
    macro_distribution: Dict[str, Any]
    status: Status = Status.ACTIVE

class MealPlanCreate(MealPlanBase):
    patient_id: int
    nutritionist_id: int
    meals: List[MealCreate]

class MealPlanResponse(MealPlanBase):
    id: int
    patient_id: int
    nutritionist_id: int
    meals: List[MealResponse]

    class Config:
        from_attributes = True

# Food Log Schemas
class FoodLogEntryBase(BaseModel):
    food_item_id: int
    consumed_at: datetime = Field(default_factory=datetime.utcnow)
    meal_type: MealType
    quantity: float
    unit: str

class FoodLogEntryCreate(FoodLogEntryBase):
    patient_id: int

class FoodLogEntryResponse(FoodLogEntryBase):
    id: int
    patient_id: int
    calculated_calories: float
    calculated_macros: Dict[str, Any]

    class Config:
        from_attributes = True

# Health Metric Schemas
class HealthMetricBase(BaseModel):
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[str] = None
    blood_sugar: Optional[float] = None
    notes: Optional[str] = None

class HealthMetricCreate(HealthMetricBase):
    patient_id: int

class HealthMetricResponse(HealthMetricBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    scheduled_at: datetime
    duration: int = 30
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    consultation_notes: Optional[str] = None
    next_appointment: Optional[datetime] = None

class AppointmentCreate(AppointmentBase):
    patient_id: int
    nutritionist_id: int

class AppointmentResponse(AppointmentBase):
    id: int
    patient_id: int
    nutritionist_id: int

    class Config:
        from_attributes = True
