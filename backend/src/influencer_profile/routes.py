from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.auth import CurrentUser
from src.users.model import UserRole
from src.influencer_profile import crud
from src.influencer_profile.schemas import (
    InfluencerProfileCreate,
    InfluencerProfileUpdate,
    InfluencerProfilePublic,
    InfluencerProfileWithSocialsAndStatsPublic,
)
from src.integrations.youtube.service import get_channel_stats

router = APIRouter(prefix="/influencer-profile", tags=["influencer_profile"])


def _require_influencer_user(current_user: CurrentUser) -> None:
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only influencer users can manage an influencer profile",
        )


@router.get("/me", response_model=InfluencerProfileWithSocialsAndStatsPublic)
async def get_my_influencer_profile(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_influencer_user(current_user)

    influencer_profile = await crud.get_by_user_id(db, current_user.id)
    if not influencer_profile:
        raise HTTPException(status_code=404, detail="Influencer profile not found")

    social_accounts = influencer_profile.social_accounts or []

    youtube_stats = []
    for acc in social_accounts:
        platform_value = getattr(acc.platform, "value", acc.platform)
        if platform_value == "youtube" and acc.youtube_channel_id:
            youtube_stats.append(await get_channel_stats(acc.youtube_channel_id))

    # Return dict to attach computed youtube_stats
    return {
        "id": influencer_profile.id,
        "user_id": influencer_profile.user_id,
        "full_name": influencer_profile.full_name,
        "bio": influencer_profile.bio,
        "niche": influencer_profile.niche,
        "availability": influencer_profile.availability,
        "social_accounts": social_accounts,
        "youtube_stats": youtube_stats,
    }


@router.post("/me", response_model=InfluencerProfilePublic, status_code=status.HTTP_201_CREATED)
async def create_my_influencer_profile(
    payload: InfluencerProfileCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_influencer_user(current_user)

    existing = await crud.get_by_user_id(db, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="Influencer profile already exists for this user")

    return await crud.create_for_user(db, current_user.id, payload)


@router.patch("/me", response_model=InfluencerProfilePublic)
async def update_my_influencer_profile(
    payload: InfluencerProfileUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_influencer_user(current_user)

    influencer_profile = await crud.get_by_user_id(db, current_user.id)
    if not influencer_profile:
        raise HTTPException(status_code=404, detail="Influencer profile not found")

    return await crud.update_for_user(db, influencer_profile, payload)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_influencer_profile(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    _require_influencer_user(current_user)

    influencer_profile = await crud.get_by_user_id(db, current_user.id)
    if not influencer_profile:
        raise HTTPException(status_code=404, detail="Influencer profile not found")

    await crud.delete_for_user(db, influencer_profile)
    return None