from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class MealItemModel(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class MealPlanModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    date: str
    breakfast: Optional[MealItemModel] = None
    lunch: Optional[MealItemModel] = None
    dinner: Optional[MealItemModel] = None
    snacks: List[MealItemModel] = []
    
    calorie_goal: Optional[float] = None
    protein_goal: Optional[float] = None
    
    total_calories: float = 0
    total_protein: float = 0
    total_carbs: float = 0
    total_fat: float = 0

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
