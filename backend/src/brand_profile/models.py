from __future__ import annotations
from datetime import UTC,datetime
from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
    Enum,
    Boolean
)
from sqlalchemy.orm import mapped_column,Mapped,relationship
from typing import List,Optional,TYPE_CHECKING
import enum

from src.database import Base

if TYPE_CHECKING:
    from src.users.model import User
    from src.campaign.models import Campaign
class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    company_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    industry: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    company_size: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    is_verified: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="brand_profile",
        uselist=False
    )
    posts:Mapped[list[Campaign]]=relationship("Campaign",back_populates="brand_profile",cascade="all,delete-orphan")
