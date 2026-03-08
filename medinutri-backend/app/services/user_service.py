from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.all_models import User
from app.schemas.all_schemas import UserCreate, UserUpdate
from app.utils.security import get_password_hash, verify_password
from fastapi import HTTPException, status
from typing import Optional

class UserService:
    async def create_user(self, db: AsyncSession, user: UserCreate) -> User:
        # Check if user exists (case-insensitive)
        from sqlalchemy import func
        result = await db.execute(select(User).where(func.lower(User.email) == func.lower(user.email)))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_dict = user.model_dump()
        password = user_dict.pop("password")
        hashed_password = get_password_hash(password)
        
        new_user = User(
            email=user.email,
            hashed_password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            phone=user.phone,
            date_of_birth=user.date_of_birth
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    async def get_user_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        from sqlalchemy import func
        result = await db.execute(select(User).where(func.lower(User.email) == func.lower(email)))
        return result.scalar_one_or_none()

    async def get_user_by_id(self, db: AsyncSession, user_id: int) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def update_user(self, db: AsyncSession, user_id: int, user_update: UserUpdate) -> Optional[User]:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return None
            
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
            
        await db.commit()
        await db.refresh(user)
        return user

    async def delete_user(self, db: AsyncSession, user_id: int) -> bool:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            return False
        
        await db.delete(user)
        await db.commit()
        return True

    async def authenticate_user(self, db: AsyncSession, email: str, password: str) -> Optional[User]:
        user = await self.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user_service = UserService()
