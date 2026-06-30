import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text

from src.database import engine
from src.config import settings
from src.logging_config import setup_logging
from src.middleware import LoggingMiddleware

# ✅ Setup logging first
setup_logging()
logger = logging.getLogger(__name__)

from src.users import router as users_router
from src.brand_profile.routes import router as brand_router
from src.influencer_profile.routes import router as influencer_router
from src.campaign.routes import router as campaign_router
from src.campaign_proposal.routes import router as campaign_proposal_router
from src.google_auth import router as google_auth_router
from src.integrations.youtube.routes import router as youtube_router
from src.marketplace.routes import router as marketplace_router
from src.contact.routes import router as contact_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ ON STARTUP - Just log, Alembic handles DB schema
    logger.info("Application started - Database managed by Alembic")
    
    yield
    
    # ✅ ON SHUTDOWN
    await engine.dispose()
    logger.info("Database connection closed")


app = FastAPI(
    title="Nepfluence2.0 API",
    description="API for Nepfluence2.0 Application",
    version="0.1.0",
    lifespan=lifespan,
)

# ✅ Add logging middleware FIRST (catches all requests)
app.add_middleware(LoggingMiddleware)

# ✅ CORS - Environment aware
if settings.ENVIRONMENT == "development":
    allowed_origins = [
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
else:
    allowed_origins = [settings.FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY.get_secret_value(),
)

# Routers
app.include_router(google_auth_router, tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(brand_router)
app.include_router(influencer_router)
app.include_router(campaign_router)
app.include_router(campaign_proposal_router)
app.include_router(youtube_router)
app.include_router(marketplace_router)
app.include_router(contact_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Nepfluence2.0 API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """Health check with database connection verification"""
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }, 503