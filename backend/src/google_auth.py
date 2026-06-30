# src/auth_google.py
from __future__ import annotations

from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import create_access_token
from src.config import settings
from src.database import get_db
from src.users import crud
from src.users.model import UserRole

try:
    from authlib.integrations.starlette_client import OAuth
except ModuleNotFoundError:
    OAuth = None

router = APIRouter(tags=["auth"])

google_configured = bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)
oauth = OAuth() if OAuth and google_configured else None
if oauth:
    oauth.register(
        name="google",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


@router.get("/auth/google")
async def auth_google(request: Request):
    if oauth is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google auth requires the authlib package",
        )
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


@router.get("/auth/google/callback")
async def google_callback(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    if oauth is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google auth requires the authlib package",
        )

    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to authorize with Google",
        )

    user_info = token.get("userinfo") or {}
    email = user_info.get("email")
    google_sub = user_info.get("sub")

    if not email or not google_sub:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google did not return required user info (email/sub).",
        )

    # Prefer linking by google_sub first
    user = await crud.get_by_google_sub(db, google_sub)

    # If not found, try by email and attach google_sub
    if not user:
        user = await crud.get_by_email(db, email)
        if user:
            user.google_sub = google_sub
            await db.commit()
            await db.refresh(user)

    # Create user if still not found
    if not user:
        username = (email.split("@")[0])[:50]
        user = await crud.create_google_user(
            db,
            email=email,
            username=username,
            google_sub=google_sub,
            role=UserRole.INFLUENCER,  # default role for Google signups
        )

    # IMPORTANT: sub must be user.id (int) for your CurrentUser dependency
    access_token = create_access_token(
        {"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": access_token, "token_type": "bearer"}
