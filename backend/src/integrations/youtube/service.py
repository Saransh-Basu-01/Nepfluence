from __future__ import annotations

from googleapiclient.discovery import build
from src.config import settings

MAX_LIMIT = 50


def get_youtube_client():
    return build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)


async def get_channel_stats(channel_id: str) -> dict:
    youtube = get_youtube_client()

    channels_response = youtube.channels().list(
        part="snippet,statistics",
        id=channel_id,
        maxResults=1,
    ).execute()

    items = channels_response.get("items", [])
    if not items:
        return {
            "channel_id": channel_id,
            "channel_name": None,
            "subscribers": None,
            "total_views": None,
            "total_videos": None,
            "average_views": None,
            "engagement_rate": None,
            "highest_view_video": None,
        }

    channel = items[0]
    snippet = channel.get("snippet") or {}
    stats = channel.get("statistics") or {}

    return {
        "channel_id": channel_id,
        "channel_name": snippet.get("title"),
        "subscribers": int(stats.get("subscriberCount", 0) or 0),
        "total_views": int(stats.get("viewCount", 0) or 0),
        "total_videos": int(stats.get("videoCount", 0) or 0),
        "average_views": None,
        "engagement_rate": None,
        "highest_view_video": None,
    }


async def search_creators(niche: str, limit: int = 10):
    limit = min(limit, MAX_LIMIT)
    youtube = get_youtube_client()

    search_response = youtube.search().list(
        q=niche,
        part="snippet",
        type="video",
        maxResults=50,
    ).execute()

    channel_ids_set: set[str] = set()
    for item in search_response.get("items", []):
        snippet = item.get("snippet") or {}
        channel_id = snippet.get("channelId")
        if channel_id:
            channel_ids_set.add(channel_id)

    channel_ids = list(channel_ids_set)[:limit]
    if not channel_ids:
        return []

    channels_response = youtube.channels().list(
        part="snippet,statistics",
        id=",".join(channel_ids),
        maxResults=len(channel_ids),
    ).execute()

    creators_data = []
    for channel in channels_response.get("items", []):
        snippet = channel.get("snippet") or {}
        stats = channel.get("statistics") or {}

        creators_data.append(
            {
                "channel_id": channel.get("id"),
                "channel_name": snippet.get("title"),
                "subscribers": int(stats.get("subscriberCount", 0) or 0),
                "total_views": int(stats.get("viewCount", 0) or 0),
                "total_videos": int(stats.get("videoCount", 0) or 0),
            }
        )

    return creators_data