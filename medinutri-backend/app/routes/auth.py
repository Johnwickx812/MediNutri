from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.all_models import User, UserRole, PatientProfile, NutritionistProfile
from app.schemas.all_schemas import UserCreate, UserResponse, Token
from app.utils.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func
    # Check if user exists (case-insensitive)
    result = await db.execute(select(User).where(func.lower(User.email) == func.lower(user_in.email)))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        phone=user_in.phone,
        date_of_birth=user_in.date_of_birth
    )
    db.add(new_user)
    await db.flush() # Get user ID
    
    # Create associated profile based on role
    if user_in.role == UserRole.PATIENT:
        profile = PatientProfile(user_id=new_user.id)
        db.add(profile)
    elif user_in.role == UserRole.NUTRITIONIST:
        profile = NutritionistProfile(
            user_id=new_user.id,
            credentials="",
            license_number=f"PENDING_{new_user.id}",
            experience_years=0,
            consultation_fee=0.0
        )
        db.add(profile)
    
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import func
    result = await db.execute(select(User).where(func.lower(User.email) == func.lower(form_data.username)))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}
