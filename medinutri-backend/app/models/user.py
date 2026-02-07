from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    hashed_password: str
    name: str
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    dietary_preferences: List[str] = []
    health_conditions: List[str] = []
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
