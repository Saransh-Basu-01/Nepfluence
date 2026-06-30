from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from src.config import settings

# ✅ Create async engine
# PostgreSQL will be detected by the "postgresql+asyncpg://" prefix
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True to see SQL queries (debug)
    pool_size=20,  # Max connections in pool
    max_overflow=10,  # Extra connections if pool is full
    pool_pre_ping=True,  # Test connection before using
    future=True,  # Use SQLAlchemy 2.0 style
)

# ✅ Session factory for async operations
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# ✅ Base class for all models
Base = declarative_base()


# ✅ Dependency for routes to get database session
async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

from src.users.model import User, PasswordResetToken
from src.brand_profile.models import BrandProfile
from src.influencer_profile.models import InfluencerProfile, SocialAccount
from src.campaign.models import Campaign
from src.campaign_proposal.models import CampaignProposal
