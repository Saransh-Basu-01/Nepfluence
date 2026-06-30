from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

from src.campaign_proposal.enums import ProposalStatus


class ProposalBase(BaseModel):
    message: Optional[str] = None
    proposed_budget: Optional[int] = Field(default=None, ge=0)


class ProposalCreate(ProposalBase):
    pass


class ProposalPublic(ProposalBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    campaign_id: int
    influencer_profile_id: int
    status: ProposalStatus
    created_at: datetime
    updated_at: datetime