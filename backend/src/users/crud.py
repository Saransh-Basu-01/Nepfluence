from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import delete as sql_delete
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import hash_password, hash_reset_token
from src.config import settings
from src.users import model
from src.users import schema 


# ---------- Helpers ----------
async def get_by_id(db: AsyncSession, user_id: int) -> model.User | None:
    result = await db.execute(
        select(model.User).where(model.User.id == user_id)
    )
    return result.scalars().first()


async def get_by_email(db: AsyncSession, email: str) -> model.User | None:
    result = await db.execute(
        select(model.User).where(func.lower(model.User.email) == email.lower())
    )
    return result.scalars().first()


async def get_by_username(db: AsyncSession, username: str) -> model.User | None:
    result = await db.execute(
        select(model.User).where(
            func.lower(model.User.username) == username.lower()
        )
    )
    return result.scalars().first()


async def get_by_phone(db: AsyncSession, phone_number: str) -> model.User | None:
    result = await db.execute(
        select(model.User).where(model.User.phone_number == phone_number)
    )
    return result.scalars().first()


async def get_by_google_sub(db: AsyncSession, google_sub: str) -> model.User | None:
    result = await db.execute(
        select(model.User).where(model.User.google_sub == google_sub)
    )
    return result.scalars().first()


# ---------- List ----------
async def list_users(db: AsyncSession, *, skip: int = 0, limit: int = 100) -> list[model.User]:
    result = await db.execute(
        select(model.User)
        .offset(skip)
        .limit(limit)
        .order_by(model.User.id)
    )
    return list(result.scalars().all())


# ---------- Create ----------
async def create_user(db: AsyncSession, data: schema.UserCreate) -> model.User:
    new_user = model.User(
        username=data.username,
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        phone_number=data.phone_number,
        country=data.country,
        role=data.role,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def create_google_user(
    db: AsyncSession,
    *,
    email: str,
    username: str,
    google_sub: str,
    role: model.UserRole,
) -> model.User:
    new_user = model.User(
        username=username,
        email=email.lower(),
        password_hash="",
        google_sub=google_sub,
        role=role,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# ---------- Update ----------
async def update_user_self(
    db: AsyncSession,
    *,
    user: model.User,
    data: schema.UserUpdate,
) -> model.User:
    # Only update fields that are present
    if data.username is not None:
        user.username = data.username
    if data.email is not None:
        user.email = data.email.lower()
    if data.phone_number is not None:
        user.phone_number = data.phone_number
    if data.country is not None:
        user.country = data.country

    await db.commit()
    await db.refresh(user)
    return user


# ---------- Delete ----------
async def delete_user(db: AsyncSession, user: model.User) -> None:
    await db.delete(user)
    await db.commit()


# ---------- Password reset flow ----------
async def create_password_reset_token_for_user(
    db: AsyncSession,
    *,
    user: model.User,
    raw_token: str,
) -> None:
    # delete existing tokens
    await db.execute(
        sql_delete(model.PasswordResetToken).where(
            model.PasswordResetToken.user_id == user.id
        )
    )

    token_hash = hash_reset_token(raw_token)
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MIN)

    reset_token = model.PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(reset_token)
    await db.commit()


async def get_reset_token_row(
    db: AsyncSession,
    *,
    raw_token: str,
) -> model.PasswordResetToken | None:
    token_hash = hash_reset_token(raw_token)
    result = await db.execute(
        select(model.PasswordResetToken).where(
            model.PasswordResetToken.token_hash == token_hash
        )
    )
    return result.scalars().first()


async def delete_all_reset_tokens_for_user(db: AsyncSession, user_id: int) -> None:
    await db.execute(
        sql_delete(model.PasswordResetToken).where(
            model.PasswordResetToken.user_id == user_id
        )
    )
    await db.commit()


async def set_user_password(db: AsyncSession, *, user: model.User, new_password: str) -> None:
    user.password_hash = hash_password(new_password)
    await db.commit()
    await db.refresh(user)
