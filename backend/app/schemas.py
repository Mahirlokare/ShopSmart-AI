from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ProductIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(default="", max_length=2000)
    price: float = Field(gt=0)
    category: str = Field(default="General", max_length=60)
    image_url: str = ""
    stock: int = Field(default=0, ge=0)

class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
