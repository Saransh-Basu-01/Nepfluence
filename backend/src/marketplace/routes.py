from __future__ import annotations

import json
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends

from src.auth import CurrentUser
from src.marketplace.schemas import MarketplaceState

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_FILE = DATA_DIR / "marketplace_state.json"

INITIAL_STATE = {
    "campaigns": [
        {
            "id": 1,
            "brand": "Himal Glow",
            "title": "Himal Glow winter launch",
            "niche": "Beauty",
            "budget": 120000,
            "country": "NP",
            "platform": "Instagram Reels",
            "status": "OPEN",
            "applications": 18,
            "accepted": 2,
            "reach": 284000,
            "deadline": "2026-06-12",
            "brief": "Short UGC videos for a skincare launch with local creator voiceover.",
        },
        {
            "id": 2,
            "brand": "8848 Momo House",
            "title": "8848 Momo House reels",
            "niche": "Food",
            "budget": 78000,
            "country": "NP",
            "platform": "TikTok",
            "status": "DRAFT",
            "applications": 0,
            "accepted": 0,
            "reach": 0,
            "deadline": "2026-06-18",
            "brief": "Creator visit and food reaction reels for new menu.",
        },
        {
            "id": 3,
            "brand": "Trail Tea",
            "title": "Trail Tea creator stories",
            "niche": "Lifestyle",
            "budget": 95000,
            "country": "IN",
            "platform": "Instagram Stories",
            "status": "PAUSED",
            "applications": 9,
            "accepted": 1,
            "reach": 124000,
            "deadline": "2026-06-22",
            "brief": "Lifestyle story campaign for tea bundles.",
        },
    ],
    "applications": [
        {
            "id": 1,
            "creator": "Aarati Rai",
            "handle": "@aaratiugc",
            "country": "NP",
            "niche": "Beauty UGC",
            "followers": "42K",
            "match": 96,
            "status": "PENDING",
            "campaignId": 1,
        },
        {
            "id": 2,
            "creator": "Mira Shrestha",
            "handle": "@miraskin",
            "country": "NP",
            "niche": "Skincare",
            "followers": "31K",
            "match": 91,
            "status": "PENDING",
            "campaignId": 1,
        },
        {
            "id": 3,
            "creator": "Kabir Rao",
            "handle": "@kabircreates",
            "country": "IN",
            "niche": "Lifestyle",
            "followers": "103K",
            "match": 84,
            "status": "PENDING",
            "campaignId": 3,
        },
    ],
    "collaborations": [
        {
            "id": 1,
            "campaign": "Himal Glow winter launch",
            "campaignId": 1,
            "brand": "Himal Glow",
            "creator": "Aarati Rai",
            "state": "IN_PROGRESS",
            "escrow": "HELD",
            "deliverable": "First draft due in 2 days",
            "payout": 45000,
        },
        {
            "id": 2,
            "campaign": "Trail Tea creator stories",
            "campaignId": 3,
            "brand": "Trail Tea",
            "creator": "Kabir Rao",
            "state": "ESCROW_PENDING",
            "escrow": "PENDING",
            "deliverable": "Chat locked until escrow deposit",
            "payout": 35000,
        },
    ],
    "messages": [
        {
            "id": 1,
            "roomId": 1,
            "sender": "brand",
            "senderName": "Himal Glow",
            "body": "Please keep the product close-up in the first 3 seconds.",
            "createdAt": "2026-05-29T08:15:00.000Z",
        },
        {
            "id": 2,
            "roomId": 1,
            "sender": "creator",
            "senderName": "Aarati Rai",
            "body": "Sure, I will submit the first video draft with the product hook today.",
            "createdAt": "2026-05-29T08:20:00.000Z",
        },
    ],
    "discoveryDecisions": [],
}


def _read_state() -> MarketplaceState:
    if not DATA_FILE.exists():
        return MarketplaceState.model_validate(INITIAL_STATE)

    with DATA_FILE.open("r", encoding="utf-8") as file:
        return MarketplaceState.model_validate(json.load(file))


def _write_state(state: MarketplaceState) -> MarketplaceState:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(state.model_dump(mode="json"), file, indent=2)
    return state


@router.get("/state", response_model=MarketplaceState)
async def get_marketplace_state(current_user: CurrentUser):
    return _read_state()


@router.put("/state", response_model=MarketplaceState)
async def replace_marketplace_state(
    state: MarketplaceState,
    current_user: CurrentUser,
):
    return _write_state(state)


@router.post("/reset", response_model=MarketplaceState)
async def reset_marketplace_state(current_user: CurrentUser):
    return _write_state(MarketplaceState.model_validate(INITIAL_STATE))
