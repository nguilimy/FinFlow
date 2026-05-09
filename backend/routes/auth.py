import os
from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext
from models.user import RegisterRequest, UserLogin, Token
from utils.jwt import create_access_token
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db = client.finflow
users_collection = db.users

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

from datetime import datetime

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user: RegisterRequest):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "password_hash": hashed_password,
        "created_at": datetime.utcnow().isoformat(),
        "is_verified": False,
        "account_level": 1
    }
    
    result = await users_collection.insert_one(new_user)
    
    user_data = {
        "user_id": str(result.inserted_id),
        "full_name": user.full_name,
        "email": user.email
    }
    
    access_token = create_access_token(data={"sub": user.email, "id": str(result.inserted_id)})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    user_data = {
        "id": str(db_user["_id"]),
        "email": db_user["email"],
        "full_name": db_user.get("full_name")
    }
    
    access_token = create_access_token(data={"sub": db_user["email"], "id": str(db_user["_id"])})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@router.post("/google")
async def google_login(token: dict):
    google_token = token.get("token")
    if not google_token:
        raise HTTPException(status_code=400, detail="Token is missing")
    
    return {"message": "Google OAuth endpoint - to be implemented"}
