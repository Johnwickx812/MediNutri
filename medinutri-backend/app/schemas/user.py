from pydantic import BaseModel, EmailStr, Field, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    email: EmailStr
    name: str
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    dietary_preferences: List[str] = []
    health_conditions: List[str] = []
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    dietary_preferences: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    fitness_goal: Optional[str] = None
    activity_level: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
