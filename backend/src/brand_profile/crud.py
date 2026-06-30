from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.brand_profile.models import BrandProfile
from src.brand_profile.schemas import BrandProfileCreate, BrandProfileUpdate


async def get_by_user_id(db: AsyncSession, user_id: int) -> BrandProfile | None:
    result = await db.execute(
        select(BrandProfile).where(BrandProfile.user_id == user_id)
    )
    return result.scalars().first()


async def create_for_user(
    db: AsyncSession,
    user_id: int,
    data: BrandProfileCreate,
) -> BrandProfile:
    brand_profile = BrandProfile(
        user_id=user_id,
        company_name=data.company_name,
        website=data.website,
        description=data.description,
        industry=data.industry,
        company_size=data.company_size,
        # is_verified stays default False
    )
    db.add(brand_profile)
    await db.commit()
    await db.refresh(brand_profile)
    return brand_profile


async def update_for_user(
    db: AsyncSession,
    brand_profile: BrandProfile,
    data: BrandProfileUpdate,
) -> BrandProfile:
    payload = data.model_dump(exclude_unset=True)

    for key, value in payload.items():
        setattr(brand_profile, key, value)

    await db.commit()
    await db.refresh(brand_profile)
    return brand_profile


async def delete_for_user(db: AsyncSession, brand_profile: BrandProfile) -> None:
    await db.delete(brand_profile)
    await db.commit()