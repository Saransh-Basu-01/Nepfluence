from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.auth import CurrentUser
from src.users.model import UserRole
from src.brand_profile import crud
from src.brand_profile.schemas import (
    BrandProfileCreate,
    BrandProfileUpdate,
    BrandProfilePublic,
)

router = APIRouter(prefix="/brand-profile", tags=["brand_profile"])


def _require_brand_user(current_user: CurrentUser) -> None:
    # Only BRAND users can create/update/delete.
    # Admin should NOT be allowed (per your requirement).
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brand users can manage a brand profile",
        )


@router.get("/me", response_model=BrandProfilePublic)
async def get_my_brand_profile(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_brand_user(current_user)

    brand_profile = await crud.get_by_user_id(db, current_user.id)
    if not brand_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found",
        )
    return brand_profile


@router.post("/me", response_model=BrandProfilePublic, status_code=status.HTTP_201_CREATED)
async def create_my_brand_profile(
    payload: BrandProfileCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_brand_user(current_user)

    existing = await crud.get_by_user_id(db, current_user.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brand profile already exists for this user",
        )

    return await crud.create_for_user(db, current_user.id, payload)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_brand_profile(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_brand_user(current_user)

    brand_profile = await crud.get_by_user_id(db, current_user.id)
    if not brand_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found",
        )

    await crud.delete_for_user(db, brand_profile)
    return None


@router.patch("/me", response_model=BrandProfilePublic)
async def update_my_brand_profile(
    payload: BrandProfileUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_brand_user(current_user)

    brand_profile = await crud.get_by_user_id(db, current_user.id)
    if not brand_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found",
        )

    return await crud.update_for_user(db, brand_profile, payload)
