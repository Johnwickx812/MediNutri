from datetime import datetime, date
from typing import List, Optional, Dict, Any
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, 
    ForeignKey, Enum, Table, JSON, Text, CheckConstraint
)
from sqlalchemy.orm import Relationship, Mapped, mapped_column
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    PATIENT = "patient"
    NUTRITIONIST = "nutritionist"
    ADMIN = "admin"

class MealType(str, enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class Status(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Junction Table for Meal and FoodItem (MealIngredient)
class MealIngredient(Base):
    __tablename__ = "meal_ingredients"
    
    meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"), primary_key=True)
    food_item_id: Mapped[int] = mapped_column(ForeignKey("food_items.id"), primary_key=True)
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(50))

    # Relationships
    meal: Mapped["Meal"] = Relationship(back_populates="ingredients")
    food_item: Mapped["FoodItem"] = Relationship()

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.PATIENT)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    patient_profile: Mapped[Optional["PatientProfile"]] = Relationship(back_populates="user", cascade="all, delete-orphan")
    nutritionist_profile: Mapped[Optional["NutritionistProfile"]] = Relationship(back_populates="user", cascade="all, delete-orphan")

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    height: Mapped[Optional[float]] = mapped_column(Float) # in cm
    weight: Mapped[Optional[float]] = mapped_column(Float) # in kg
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    medical_conditions: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON)
    allergies: Mapped[List[str]] = mapped_column(JSON, default=[])
    dietary_restrictions: Mapped[List[str]] = mapped_column(JSON, default=[])
    health_goals: Mapped[Optional[str]] = mapped_column(Text)
    target_weight: Mapped[Optional[float]] = mapped_column(Float)
    activity_level: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    user: Mapped["User"] = Relationship(back_populates="patient_profile")
    meal_plans: Mapped[List["MealPlan"]] = Relationship(back_populates="patient")
    food_logs: Mapped[List["FoodLogEntry"]] = Relationship(back_populates="patient")
    health_metrics: Mapped[List["HealthMetric"]] = Relationship(back_populates="patient")
    appointments: Mapped[List["Appointment"]] = Relationship(back_populates="patient")

class NutritionistProfile(Base):
    __tablename__ = "nutritionist_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    credentials: Mapped[str] = mapped_column(Text)
    specializations: Mapped[List[str]] = mapped_column(JSON, default=[])
    license_number: Mapped[str] = mapped_column(String(100), unique=True)
    experience_years: Mapped[int] = mapped_column(Integer)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    consultation_fee: Mapped[float] = mapped_column(Float)
    rating: Mapped[float] = mapped_column(Float, default=0.0)

    # Relationships
    user: Mapped["User"] = Relationship(back_populates="nutritionist_profile")
    meal_plans: Mapped[List["MealPlan"]] = Relationship(back_populates="nutritionist")
    appointments: Mapped[List["Appointment"]] = Relationship(back_populates="nutritionist")

class FoodItem(Base):
    __tablename__ = "food_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[str] = mapped_column(String(100))
    brand: Mapped[Optional[str]] = mapped_column(String(100))
    serving_size: Mapped[float] = mapped_column(Float)
    serving_unit: Mapped[str] = mapped_column(String(50))
    calories: Mapped[float] = mapped_column(Float)
    protein: Mapped[float] = mapped_column(Float)
    carbs: Mapped[float] = mapped_column(Float)
    fats: Mapped[float] = mapped_column(Float)
    fiber: Mapped[Optional[float]] = mapped_column(Float)
    vitamins: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON)
    minerals: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON)
    allergens: Mapped[List[str]] = mapped_column(JSON, default=[])
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"))
    nutritionist_id: Mapped[int] = mapped_column(ForeignKey("nutritionist_profiles.id"))
    plan_name: Mapped[str] = mapped_column(String(255))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    daily_calorie_target: Mapped[float] = mapped_column(Float)
    macro_distribution: Mapped[Dict[str, Any]] = mapped_column(JSON) # e.g., {"protein": 30, "carbs": 40, "fats": 30}
    status: Mapped[Status] = mapped_column(Enum(Status), default=Status.ACTIVE)

    # Relationships
    patient: Mapped["PatientProfile"] = Relationship(back_populates="meal_plans")
    nutritionist: Mapped["NutritionistProfile"] = Relationship(back_populates="meal_plans")
    meals: Mapped[List["Meal"]] = Relationship(back_populates="meal_plan", cascade="all, delete-orphan")

class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True)
    meal_plan_id: Mapped[int] = mapped_column(ForeignKey("meal_plans.id"))
    meal_type: Mapped[MealType] = mapped_column(Enum(MealType))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    instructions: Mapped[Optional[str]] = mapped_column(Text)
    prep_time: Mapped[Optional[int]] = mapped_column(Integer) # in minutes
    total_calories: Mapped[float] = mapped_column(Float, default=0.0)

    # Relationships
    meal_plan: Mapped["MealPlan"] = Relationship(back_populates="meals")
    ingredients: Mapped[List["MealIngredient"]] = Relationship(back_populates="meal", cascade="all, delete-orphan")

class FoodLogEntry(Base):
    __tablename__ = "food_log_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"))
    food_item_id: Mapped[int] = mapped_column(ForeignKey("food_items.id"))
    consumed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    meal_type: Mapped[MealType] = mapped_column(Enum(MealType))
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(50))
    calculated_calories: Mapped[float] = mapped_column(Float)
    calculated_macros: Mapped[Dict[str, Any]] = mapped_column(JSON)

    # Relationships
    patient: Mapped["PatientProfile"] = Relationship(back_populates="food_logs")
    food_item: Mapped["FoodItem"] = Relationship()

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"))
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    weight: Mapped[Optional[float]] = mapped_column(Float)
    bmi: Mapped[Optional[float]] = mapped_column(Float)
    blood_pressure: Mapped[Optional[str]] = mapped_column(String(20)) # e.g., "120/80"
    blood_sugar: Mapped[Optional[float]] = mapped_column(Float)
    notes: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    patient: Mapped["PatientProfile"] = Relationship(back_populates="health_metrics")

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"))
    nutritionist_id: Mapped[int] = mapped_column(ForeignKey("nutritionist_profiles.id"))
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    duration: Mapped[int] = mapped_column(Integer, default=30) # in minutes
    status: Mapped[AppointmentStatus] = mapped_column(Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    consultation_notes: Mapped[Optional[str]] = mapped_column(Text)
    next_appointment: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    patient: Mapped["PatientProfile"] = Relationship(back_populates="appointments")
    nutritionist: Mapped["NutritionistProfile"] = Relationship(back_populates="appointments")
