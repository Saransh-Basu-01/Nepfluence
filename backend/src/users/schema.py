from pydantic import BaseModel,ConfigDict,Field,EmailStr
from datetime import datetime 
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    INFLUENCER = "influencer"
    BRAND = "brand"

class UserBase(BaseModel):
    username:str=Field(min_length=1,max_length=50)
    email:EmailStr=Field(max_length=120)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    country: Optional[str] = Field(default=None, max_length=100)
    company_email: Optional[EmailStr] = Field(default=None, max_length=120)
    company_website: Optional[str] = Field(default=None, max_length=255)
    role: UserRole = Field(default=UserRole.BRAND)

class UserCreate(UserBase):
    password:str=Field(min_length=8)

class UserPublic(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:int
    username:str
    phone_number: Optional[str] = None
    country: Optional[str] = None
    image_file:str|None
    image_path:str
    role: UserRole
    is_active: bool
    date_joined: datetime
    last_login: Optional[datetime] = None
    updated_at: datetime


class UserPrivate(UserPublic):
    email:EmailStr

class UserUpdate(BaseModel):
    username:str|None=Field(default=None,min_length=1,max_length=100)
    email:EmailStr|None=Field(default=None,max_length=120)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    country: Optional[str] = Field(default=None, max_length=100)

class Token(BaseModel):
    access_token:str
    token_type:str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(max_length=120)

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)
