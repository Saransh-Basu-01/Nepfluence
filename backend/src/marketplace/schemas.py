from typing import Literal

from pydantic import BaseModel, Field


CampaignStatus = Literal["DRAFT", "OPEN", "PAUSED", "CLOSED", "COMPLETED"]
ApplicationStatus = Literal["PENDING", "ACCEPTED", "REJECTED"]
EscrowStatus = Literal["NOT_REQUIRED", "PENDING", "HELD", "RELEASED"]
CollaborationState = Literal["ESCROW_PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED"]
Country = Literal["NP", "IN"]
Sender = Literal["brand", "creator"]


class DeliverableChecklist(BaseModel):
    briefMatched: bool = True
    usageRights: bool = True
    noCopyrightMusic: bool = True


class DeliverableSubmission(BaseModel):
    videoUrl: str
    postUrl: str = ""
    caption: str = ""
    notes: str = ""
    aspectRatio: str = "9:16"
    duration: str = "30s"
    submittedAt: str
    checklist: DeliverableChecklist = Field(default_factory=DeliverableChecklist)


class MarketplaceCampaign(BaseModel):
    id: int
    brand: str
    title: str
    niche: str
    budget: int
    country: Country
    platform: str
    status: CampaignStatus
    applications: int = 0
    accepted: int = 0
    reach: int = 0
    deadline: str
    brief: str


class MarketplaceApplication(BaseModel):
    id: int
    creator: str
    handle: str
    country: Country
    niche: str
    followers: str
    match: int = 90
    status: ApplicationStatus = "PENDING"
    campaignId: int


class MarketplaceCollaboration(BaseModel):
    id: int
    campaign: str
    campaignId: int
    brand: str
    creator: str
    state: CollaborationState
    escrow: EscrowStatus
    deliverable: str
    payout: int
    submission: DeliverableSubmission | None = None


class MarketplaceMessage(BaseModel):
    id: int
    roomId: int
    sender: Sender
    senderName: str
    body: str
    createdAt: str


class CreatorDiscoveryDecision(BaseModel):
    handle: str
    creator: str
    status: Literal["SELECTED", "REJECTED"]
    decidedAt: str


class MarketplaceState(BaseModel):
    campaigns: list[MarketplaceCampaign]
    applications: list[MarketplaceApplication]
    collaborations: list[MarketplaceCollaboration]
    messages: list[MarketplaceMessage]
    discoveryDecisions: list[CreatorDiscoveryDecision] = Field(default_factory=list)
