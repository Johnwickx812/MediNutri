from app.database import db
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import get_password_hash, verify_password
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.collection import Collection

class UserService:
    @property
    def collection(self) -> Collection:
        return db.get_db()["users"]

    async def create_user(self, user: UserCreate) -> UserModel:
        existing_user = await self.collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_dict = user.model_dump()
        hashed_password = get_password_hash(user_dict.pop("password"))
        user_dict["hashed_password"] = hashed_password
        
        new_user = await self.collection.insert_one(user_dict)
        created_user = await self.collection.find_one({"_id": new_user.inserted_id})
        return UserModel(**created_user)

    async def get_user_by_email(self, email: str) -> UserModel:
        user = await self.collection.find_one({"email": email})
        if user:
            return UserModel(**user)
        return None

    async def get_user_by_id(self, user_id: str) -> UserModel:
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserModel(**user)
        return None

    async def update_user(self, user_id: str, user_update: UserUpdate) -> UserModel:
        update_data = user_update.model_dump(exclude_unset=True)
        if not update_data:
            return await self.get_user_by_id(user_id)
            
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return await self.get_user_by_id(user_id)

    async def delete_user(self, user_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def authenticate_user(self, email: str, password: str) -> UserModel:
        user = await self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user_service = UserService()
