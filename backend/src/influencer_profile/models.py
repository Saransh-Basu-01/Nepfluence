from __future__ import annotations

from sqlalchemy import (
    String,
    Integer,
    Numeric,
    Text,
    Boolean,
    ForeignKey,
    Enum as SAEnum,
    BigInteger
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING

from src.database import Base
from src.influencer_profile.enums import InfluencerNiche, SocialPlatform

if TYPE_CHECKING:
    from src.users.model import User
    from src.campaign_proposal.models import CampaignProposal

class InfluencerProfile(Base):
    __tablename__ = "influencer_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(String(150), nullable=False)

    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    niche: Mapped[InfluencerNiche] = mapped_column(
        SAEnum(InfluencerNiche, name="influencer_niche"),
        nullable=False,
        index=True,
    )

    availability: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="influencer_profile", uselist=False)

    # Social accounts (one-to-many)
    social_accounts: Mapped[List["SocialAccount"]] = relationship(
        "SocialAccount",
        back_populates="influencer",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    proposals: Mapped[list["CampaignProposal"]] = relationship(
    "CampaignProposal",
    back_populates="influencer_profile",
    cascade="all,delete-orphan",
)



class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id: Mapped[int] = mapped_column(primary_key=True)

    influencer_id: Mapped[int] = mapped_column(
        ForeignKey("influencer_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    platform: Mapped[SocialPlatform] = mapped_column(
        SAEnum(SocialPlatform, name="social_platform"),
        nullable=False,
        index=True,
    )

    youtube_channel_id: Mapped[str] = mapped_column(
        String(200),
        unique=True,
        nullable=False,
        index=True,
    )

    youtube_handle: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    youtube_channel_name: Mapped[str] = mapped_column(
        String(200),
        nullable=True,
    )

    subscribers_count: Mapped[int] = mapped_column(
        BigInteger,
        default=0,
        nullable=True,
    )

    total_views: Mapped[int] = mapped_column(
        BigInteger,
        default=0,
        nullable=True,
    )

    total_videos: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=True,
    )

    average_views: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    engagement_rate: Mapped[float | None] = mapped_column(
        Numeric(5, 2), 
        nullable=True,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    influencer = relationship("InfluencerProfile", back_populates="social_accounts")
