from __future__ import annotations

from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile
from fastapi.concurrency import run_in_threadpool
from PIL import UnidentifiedImageError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import CurrentUser
from src.database import get_db
from src.users.model import UserRole
from src.brand_profile.models import BrandProfile
from src.campaign import crud
from src.campaign.enums import CampaignStatus
from src.campaign.schemas import CampaignCreate, CampaignPublic, CampaignUpdate
from src.config import settings
from src.campaign.image_utils import process_campaign_image, delete_campaign_image

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


def _validate_budget(minv: int, maxv: int) -> None:
    if minv > maxv:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="budget_min cannot be greater than budget_max",
        )


async def _get_my_brand_profile(
    db: AsyncSession,
    current_user: CurrentUser,
) -> BrandProfile:
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brand users can manage campaigns",
        )

    result = await db.execute(
        select(BrandProfile).where(BrandProfile.user_id == current_user.id)
    )
    brand_profile = result.scalars().first()
    if not brand_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Create brand profile first",
        )
    return brand_profile


# -----------------------
# Brand (me) routes FIRST
# -----------------------
@router.get("/me", response_model=List[CampaignPublic])
async def list_my_campaigns(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    brand_profile = await _get_my_brand_profile(db, current_user)
    return await crud.get_campaigns_for_brand_profile(
        db, brand_profile.id, skip=skip, limit=limit
    )


@router.post("/me", response_model=CampaignPublic, status_code=status.HTTP_201_CREATED)
async def create_my_campaign(
    payload: CampaignCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)
    _validate_budget(payload.budget_min, payload.budget_max)
    return await crud.create_campaign(db, brand_profile.id, payload)


@router.patch("/me/{campaign_id}", response_model=CampaignPublic)
async def update_my_campaign(
    campaign_id: int,
    payload: CampaignUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    new_min = payload.budget_min if payload.budget_min is not None else campaign.budget_min
    new_max = payload.budget_max if payload.budget_max is not None else campaign.budget_max
    _validate_budget(new_min, new_max)

    return await crud.update_campaign(db, campaign, payload)


@router.post("/me/{campaign_id}/publish", response_model=CampaignPublic)
async def publish_my_campaign(
    campaign_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign.status = CampaignStatus.PUBLISHED
    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.post("/me/{campaign_id}/close", response_model=CampaignPublic)
async def close_my_campaign(
    campaign_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign.status = CampaignStatus.CLOSED
    await db.commit()
    await db.refresh(campaign)
    return campaign


@router.delete("/me/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_campaign(
    campaign_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    await crud.delete_campaign(db, campaign)
    return None


@router.patch("/me/{campaign_id}/picture", response_model=CampaignPublic)
async def upload_campaign_picture(
    campaign_id: int,
    file: UploadFile,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_BYTES//(1024*1024)}MB",
        )

    try:
        new_filename = await run_in_threadpool(process_campaign_image, content)
    except UnidentifiedImageError as err:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file. Please upload a valid image",
        ) from err

    old_filename = campaign.image_file
    campaign.image_file = new_filename

    await db.commit()
    await db.refresh(campaign)

    if old_filename:
        delete_campaign_image(old_filename)

    return campaign


@router.delete("/me/{campaign_id}/picture", response_model=CampaignPublic)
async def delete_campaign_picture(
    campaign_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    old_filename = campaign.image_file
    if old_filename is None:
        raise HTTPException(status_code=400, detail="No campaign picture to delete")

    campaign.image_file = None
    await db.commit()
    await db.refresh(campaign)

    delete_campaign_image(old_filename)
    return campaign


# -----------------------
# Public routes AFTER /me
# -----------------------
@router.get("/", response_model=List[CampaignPublic])
async def list_published_campaigns(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    return await crud.get_published_campaigns(db, skip=skip, limit=limit)


@router.get("/{campaign_id}", response_model=CampaignPublic)
async def get_published_campaign(
    campaign_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    campaign = await crud.get_campaign_by_id(db, campaign_id)
    if not campaign or campaign.status != CampaignStatus.PUBLISHED:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
