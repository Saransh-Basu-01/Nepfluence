from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List

from src.influencer_profile.enums import InfluencerNiche, SocialPlatform


# ----------------------------
# Influencer Profile Schemas
# ----------------------------

class InfluencerProfileBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    bio: Optional[str] = None
    niche: InfluencerNiche
    availability: bool = True


class InfluencerProfileCreate(InfluencerProfileBase):
    pass


class InfluencerProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    bio: Optional[str] = None
    niche: Optional[InfluencerNiche] = None
    availability: Optional[bool] = None


class InfluencerProfilePublic(InfluencerProfileBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int


# ----------------------------
# Social Account Schemas (DB identifiers only)
# ----------------------------

class SocialAccountCreate(BaseModel):
    platform: SocialPlatform = SocialPlatform.youtube
    youtube_channel_id: str = Field(min_length=1, max_length=200)
    youtube_handle: Optional[str] = Field(default=None, max_length=120)


class SocialAccountUpdate(BaseModel):
    platform: Optional[SocialPlatform] = None
    youtube_channel_id: Optional[str] = Field(default=None, min_length=1, max_length=200)
    youtube_handle: Optional[str] = Field(default=None, max_length=120)


class SocialAccountPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    influencer_id: int
    platform: SocialPlatform
    youtube_channel_id: str
    youtube_handle: Optional[str] = None


# ----------------------------
# Live YouTube stats (computed, not stored)
# ----------------------------

class YouTubeStatsPublic(BaseModel):
    channel_id: str
    channel_name: Optional[str] = None
    subscribers: Optional[int] = None
    total_views: Optional[int] = None
    total_videos: Optional[int] = None
    average_views: Optional[int] = None
    engagement_rate: Optional[float] = None
    highest_view_video: Optional[dict] = None


class InfluencerProfileWithSocialsAndStatsPublic(InfluencerProfilePublic):
    social_accounts: List[SocialAccountPublic] = []
    youtube_stats: List[YouTubeStatsPublic] = []