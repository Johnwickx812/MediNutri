from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.models.user import UserModel
from app.services.user_service import user_service
from app.routes.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    return await user_service.create_user(user)

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[UserModel, Depends(get_current_user)]):
    return current_user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str, 
    user_update: UserUpdate,
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
        
    updated_user = await user_service.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
        
    success = await user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None
