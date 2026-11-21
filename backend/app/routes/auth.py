from fastapi import APIRouter, HTTPException
from ..database import db
from ..schemas import RegisterIn, LoginIn
from ..security import hash_password, verify_password, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(data: RegisterIn):
    email = data.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(409, "Email already registered")
    result = await db.users.insert_one({
        "name": data.name, "email": email,
        "password": hash_password(data.password), "role": "customer"
    })
    return {"access_token": create_token(str(result.inserted_id)), "token_type": "bearer"}

@router.post("/login")
async def login(data: LoginIn):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Incorrect email or password")
    return {"access_token": create_token(str(user["_id"])), "token_type": "bearer"}
