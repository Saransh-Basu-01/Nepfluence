from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class BrandProfileBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=150)
    website: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=100)
    company_size: Optional[str] = Field(default=None, max_length=50)


class BrandProfileCreate(BrandProfileBase):
    pass


class BrandProfileUpdate(BaseModel):
    # all optional for PATCH
    company_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    website: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=100)
    company_size: Optional[str] = Field(default=None, max_length=50)


class BrandProfilePublic(BrandProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    is_verified: bool