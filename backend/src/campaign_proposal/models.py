from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, Text, func, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.campaign_proposal.enums import ProposalStatus

if TYPE_CHECKING:
    from src.campaign.models import Campaign
    from src.influencer_profile.models import InfluencerProfile


class CampaignProposal(Base):
    __tablename__ = "campaign_proposals"
    __table_args__ = (
        UniqueConstraint("campaign_id", "influencer_profile_id", name="uq_campaign_influencer_proposal"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    campaign_id: Mapped[int] = mapped_column(
        ForeignKey("campaigns.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    influencer_profile_id: Mapped[int] = mapped_column(
        ForeignKey("influencer_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    proposed_budget: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    status: Mapped[ProposalStatus] = mapped_column(
        Enum(ProposalStatus),
        default=ProposalStatus.PENDING,
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="proposals")
    influencer_profile: Mapped["InfluencerProfile"] = relationship("InfluencerProfile", back_populates="proposals")