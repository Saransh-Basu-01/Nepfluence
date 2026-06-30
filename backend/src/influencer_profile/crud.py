from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.influencer_profile.models import InfluencerProfile
from src.influencer_profile.schemas import InfluencerProfileCreate, InfluencerProfileUpdate


async def get_by_user_id(db: AsyncSession, user_id: int) -> InfluencerProfile | None:
    result = await db.execute(
        select(InfluencerProfile)
        .options(selectinload(InfluencerProfile.social_accounts))  # ✅ load socials
        .where(InfluencerProfile.user_id == user_id)
    )
    return result.scalars().first()


async def create_for_user(
    db: AsyncSession,
    user_id: int,
    data: InfluencerProfileCreate,
) -> InfluencerProfile:
    influencer_profile = InfluencerProfile(
        user_id=user_id,
        full_name=data.full_name,
        bio=data.bio,
        niche=data.niche,
        availability=data.availability,
    )
    db.add(influencer_profile)
    await db.commit()
    await db.refresh(influencer_profile)
    return influencer_profile


async def update_for_user(
    db: AsyncSession,
    influencer_profile: InfluencerProfile,
    data: InfluencerProfileUpdate,
) -> InfluencerProfile:
    payload = data.model_dump(exclude_unset=True)

    for key, value in payload.items():
        setattr(influencer_profile, key, value)

    await db.commit()
    await db.refresh(influencer_profile)
    return influencer_profile


async def delete_for_user(db: AsyncSession, influencer_profile: InfluencerProfile) -> None:
    await db.delete(influencer_profile)
    await db.commit()