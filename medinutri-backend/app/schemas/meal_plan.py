from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated
from datetime import date

PyObjectId = Annotated[str, BeforeValidator(str)]

class MealItem(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class MealPlanBase(BaseModel):
    date: date
    breakfast: Optional[MealItem] = None
    lunch: Optional[MealItem] = None
    dinner: Optional[MealItem] = None
    snacks: List[MealItem] = []
    calorie_goal: Optional[float] = None
    protein_goal: Optional[float] = None

class MealPlanCreate(MealPlanBase):
    pass

class MealPlanUpdate(BaseModel):
    breakfast: Optional[MealItem] = None
    lunch: Optional[MealItem] = None
    dinner: Optional[MealItem] = None
    snacks: Optional[List[MealItem]] = None
    calorie_goal: Optional[float] = None
    protein_goal: Optional[float] = None

class MealPlanResponse(MealPlanBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    total_calories: float = 0
    total_protein: float = 0
    total_carbs: float = 0
    total_fat: float = 0

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
