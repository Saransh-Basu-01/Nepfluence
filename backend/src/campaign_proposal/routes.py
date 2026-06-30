from __future__ import annotations

from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import CurrentUser
from src.database import get_db
from src.users.model import UserRole
from src.brand_profile import crud as brand_crud
from src.influencer_profile import crud as influencer_crud
from src.campaign.models import Campaign

from src.campaign_proposal import crud
from src.campaign_proposal.enums import ProposalStatus
from src.campaign_proposal.schemas import ProposalCreate, ProposalPublic

router = APIRouter(prefix="/proposals", tags=["campaign_proposals"])


async def _get_my_brand_profile(db: AsyncSession, current_user: CurrentUser):
    if current_user.role != UserRole.BRAND:
        raise HTTPException(status_code=403, detail="Only brand users can do this")
    bp = await brand_crud.get_by_user_id(db, current_user.id)
    if not bp:
        raise HTTPException(status_code=400, detail="Create brand profile first")
    return bp


async def _get_my_influencer_profile(db: AsyncSession, current_user: CurrentUser):
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(status_code=403, detail="Only influencer users can do this")
    ip = await influencer_crud.get_by_user_id(db, current_user.id)
    if not ip:
        raise HTTPException(status_code=400, detail="Create influencer profile first")
    return ip


# ---------- Influencer endpoints ----------
@router.post("/campaigns/{campaign_id}", response_model=ProposalPublic, status_code=status.HTTP_201_CREATED)
async def send_proposal(
    campaign_id: int,
    payload: ProposalCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    influencer_profile = await _get_my_influencer_profile(db, current_user)

    campaign = await db.get(Campaign, campaign_id)
    if not campaign or campaign.status != "PUBLISHED":
        raise HTTPException(status_code=404, detail="Campaign not found")

    existing = await crud.get_by_campaign_and_influencer(db, campaign_id, influencer_profile.id)
    if existing:
        raise HTTPException(status_code=400, detail="You already sent a proposal for this campaign")

    return await crud.create(db, campaign_id, influencer_profile.id, payload)


@router.get("/me", response_model=List[ProposalPublic])
async def list_my_proposals(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    influencer_profile = await _get_my_influencer_profile(db, current_user)
    return await crud.list_for_influencer(db, influencer_profile.id)


@router.post("/{proposal_id}/withdraw", response_model=ProposalPublic)
async def withdraw_proposal(
    proposal_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    influencer_profile = await _get_my_influencer_profile(db, current_user)

    proposal = await crud.get_by_id(db, proposal_id)
    if not proposal or proposal.influencer_profile_id != influencer_profile.id:
        raise HTTPException(status_code=404, detail="Proposal not found")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending proposals can be withdrawn")

    # Simple approach: mark withdrawn (keeps history). Resend will still be blocked by unique.
    # If you want resend, we can DELETE instead.
    return await crud.set_status(db, proposal, ProposalStatus.WITHDRAWN)


# ---------- Brand endpoints ----------
@router.get("/campaigns/{campaign_id}", response_model=List[ProposalPublic])
async def list_campaign_proposals(
    campaign_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    campaign = await db.get(Campaign, campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return await crud.list_for_campaign(db, campaign_id)


@router.post("/{proposal_id}/accept", response_model=ProposalPublic)
async def accept_proposal(
    proposal_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    proposal = await crud.get_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    campaign = await db.get(Campaign, proposal.campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending proposals can be accepted")

    return await crud.set_status(db, proposal, ProposalStatus.ACCEPTED)


@router.post("/{proposal_id}/reject", response_model=ProposalPublic)
async def reject_proposal(
    proposal_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    brand_profile = await _get_my_brand_profile(db, current_user)

    proposal = await crud.get_by_id(db, proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    campaign = await db.get(Campaign, proposal.campaign_id)
    if not campaign or campaign.brand_profile_id != brand_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending proposals can be rejected")

    return await crud.set_status(db, proposal, ProposalStatus.REJECTED)
