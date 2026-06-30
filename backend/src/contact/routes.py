from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field

from src.auth import CurrentUser
from src.email_utils import send_email

router = APIRouter(prefix="/api/contact", tags=["contact"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
OUTREACH_FILE = DATA_DIR / "email_outreach.json"


class CreatorEmailRequest(BaseModel):
    creator_name: str = Field(min_length=1, max_length=150)
    creator_handle: str = Field(min_length=1, max_length=120)
    to_email: EmailStr | None = None
    subject: str = Field(min_length=1, max_length=180)
    message: str = Field(min_length=1, max_length=4000)


class CreatorEmailResponse(BaseModel):
    message: str
    delivery: str


def _append_outreach(payload: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    existing = []
    if OUTREACH_FILE.exists():
        with OUTREACH_FILE.open("r", encoding="utf-8") as file:
            existing = json.load(file)

    existing.append(payload)
    with OUTREACH_FILE.open("w", encoding="utf-8") as file:
        json.dump(existing, file, indent=2)


@router.post("/creator-email", response_model=CreatorEmailResponse)
async def send_creator_email(
    payload: CreatorEmailRequest,
    current_user: CurrentUser,
):
    now = datetime.now(UTC).isoformat()
    _append_outreach(
        {
            "created_at": now,
            "brand_user_id": current_user.id,
            "creator_name": payload.creator_name,
            "creator_handle": payload.creator_handle,
            "to_email": str(payload.to_email) if payload.to_email else None,
            "subject": payload.subject,
            "message": payload.message,
        }
    )

    if payload.to_email:
        await send_email(
            to_email=str(payload.to_email),
            subject=payload.subject,
            plain_text=payload.message,
        )
        return CreatorEmailResponse(message="Creator email queued.", delivery="email")

    return CreatorEmailResponse(
        message="Creator outreach saved. Add a creator email to send externally.",
        delivery="saved",
    )
