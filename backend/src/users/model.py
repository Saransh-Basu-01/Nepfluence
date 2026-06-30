from __future__ import annotations
from datetime import UTC, datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func, Enum, Boolean
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import List, Optional, TYPE_CHECKING
import enum
from src.database import Base

if TYPE_CHECKING:
    from src.brand_profile.models import BrandProfile
    from src.influencer_profile.models import InfluencerProfile
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    INFLUENCER="influencer"
    BRAND="brand"
        
class User(Base):
    __tablename__="users"
    id:Mapped[int]=mapped_column(Integer,primary_key=True,index=True)

    username:Mapped[str]=mapped_column(String(50),unique=True,nullable=False,index=True)

    email:Mapped[str]=mapped_column(String(120),unique=True,nullable=False,index=True)

    password_hash:Mapped[str]=mapped_column(String(200),nullable=True,index=True)

    google_sub: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)
    
    phone_number: Mapped[Optional[str]] = mapped_column(String, unique=True, index=True, nullable=True)

    country: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    image_file:Mapped[str|None]=mapped_column(String(200),nullable=True,default=None)

    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.BRAND, nullable=False, index=True)
    
    date_joined: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now(),
    nullable=False
    )
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    reset_tokens:Mapped[list[PasswordResetToken]]=relationship(
        back_populates="user",
        cascade="all,delete-orphan",
    )
    
    brand_profile: Mapped["BrandProfile"] = relationship(
    "BrandProfile",
    back_populates="user",
    uselist=False,
    cascade="all, delete-orphan",
    )
    
    influencer_profile: Mapped["InfluencerProfile"] = relationship(
        "InfluencerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    
    @property
    def image_path(self)->str:
        if self.image_file:
            return f"/media/profile_pics/{self.image_file}"
        return "kei xaina"
    

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    user: Mapped[User] = relationship(back_populates="reset_tokens")
