from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.campaign.models import Campaign
from src.campaign.schemas import CampaignCreate, CampaignUpdate


async def get_campaign_by_id(db: AsyncSession, campaign_id: int) -> Campaign | None:
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    return result.scalars().first()


async def get_campaigns_for_brand_profile(
    db: AsyncSession,
    brand_profile_id: int,
    skip: int = 0,
    limit: int = 50,
) -> list[Campaign]:
    result = await db.execute(
        select(Campaign)
        .where(Campaign.brand_profile_id == brand_profile_id)
        .order_by(Campaign.date_posted.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_published_campaigns(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
) -> list[Campaign]:
    # import here to avoid circulars
    from src.campaign.enums import CampaignStatus

    result = await db.execute(
        select(Campaign)
        .where(Campaign.status == CampaignStatus.PUBLISHED)
        .order_by(Campaign.date_posted.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def create_campaign(
    db: AsyncSession,
    brand_profile_id: int,
    data: CampaignCreate,
) -> Campaign:
    campaign = Campaign(
        brand_profile_id=brand_profile_id,
        title=data.title,
        description=data.description,
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        # status + date_posted handled by defaults
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return campaign


async def update_campaign(
    db: AsyncSession,
    campaign: Campaign,
    data: CampaignUpdate,
) -> Campaign:
    payload = data.model_dump(exclude_unset=True)
    for k, v in payload.items():
        setattr(campaign, k, v)

    await db.commit()
    await db.refresh(campaign)
    return campaign


async def delete_campaign(db: AsyncSession, campaign: Campaign) -> None:
    await db.delete(campaign)
    await db.commit()