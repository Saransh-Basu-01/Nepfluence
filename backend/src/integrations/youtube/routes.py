from __future__ import annotations

from fastapi import APIRouter, Query
from src.integrations.youtube import service

router = APIRouter(prefix="/api/youtube", tags=["youtube"])


@router.get("/search-creators")
async def search_creators(
    niche: str = Query(..., min_length=2, max_length=80),
    limit: int = Query(10, ge=1, le=50),
):
    return await service.search_creators(niche=niche, limit=limit)


@router.get("/channel/{channel_id}")
async def channel_stats(channel_id: str):
    return await service.get_channel_stats(channel_id)