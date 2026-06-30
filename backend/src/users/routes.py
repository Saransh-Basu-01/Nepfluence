from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Annotated, List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import (
    CurrentUser,
    create_access_token,
    generate_reset_token,
    verify_password,
)
from src.config import settings
from src.database import get_db
from src.email_utils import send_password_reset_email
from src.users import crud
from src.users import schema

router = APIRouter()


# ============= REGISTER / CREATE USER =============
@router.post("/register", response_model=schema.UserPrivate, status_code=status.HTTP_201_CREATED)
async def register_user(
    user: schema.UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Check unique constraints
    if await crud.get_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")

    if await crud.get_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    if user.phone_number and await crud.get_by_phone(db, user.phone_number):
        raise HTTPException(status_code=400, detail="Phone number already exists")

    return await crud.create_user(db, user)


# ============= LOGIN / TOKEN =============
@router.post("/login", response_model=schema.Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    user = await crud.get_by_email(db, form_data.username)

    # IMPORTANT: password_hash can be None for Google users
    if (not user) or (not user.password_hash) or (not verify_password(form_data.password, user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires,
    )

    return schema.Token(access_token=access_token, token_type="bearer")


# ============= GET CURRENT USER (ME) =============
@router.get("/me", response_model=schema.UserPrivate)
async def get_me(current_user: CurrentUser):
    return current_user


# ============= GET ALL USERS (Public) =============
@router.get("/", response_model=List[schema.UserPublic])
async def get_users(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    return await crud.list_users(db, skip=skip, limit=limit)


# ============= GET SINGLE USER (Public) =============
@router.get("/{user_id}", response_model=schema.UserPublic)
async def get_user(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    user = await crud.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ============= UPDATE USER (Protected) =============
@router.patch("/{user_id}", response_model=schema.UserPrivate)
async def update_user(
    user_id: int,
    user_update: schema.UserUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    # Uniqueness checks only when changing
    if user_update.username and user_update.username.lower() != current_user.username.lower():
        if await crud.get_by_username(db, user_update.username):
            raise HTTPException(status_code=400, detail="Username already exists")

    if user_update.email and user_update.email.lower() != current_user.email.lower():
        if await crud.get_by_email(db, user_update.email):
            raise HTTPException(status_code=400, detail="Email already exists")

    # Optional: phone uniqueness check (you didn't have it in update before; keep same behavior)
    # If you want it, tell me and I’ll add it.

    return await crud.update_user_self(db, user=current_user, data=user_update)


# ============= DELETE USER (Protected) =============
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")

    await crud.delete_user(db, current_user)
    return None


# ============= FORGOT PASSWORD =============
@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    request_data: schema.ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    user = await crud.get_by_email(db, request_data.email)

    if user:
        token = generate_reset_token()
        await crud.create_password_reset_token_for_user(db, user=user, raw_token=token)

        background_tasks.add_task(
            send_password_reset_email,
            to_email=user.email,
            username=user.username,
            token=token,
        )

    return {
        "message": "If an account exists with this email, you will receive password reset instructions"
    }


# ============= RESET PASSWORD =============
@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request_data: schema.ResetPasswordRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    reset_row = await crud.get_reset_token_row(db, raw_token=request_data.token)

    if not reset_row:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if reset_row.expires_at.replace(tzinfo=UTC) < datetime.now(UTC):
        # cleanup
        await db.delete(reset_row)
        await db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = await crud.get_by_id(db, reset_row.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    await crud.set_user_password(db, user=user, new_password=request_data.new_password)
    await crud.delete_all_reset_tokens_for_user(db, user_id=user.id)

    return {"message": "Password reset successfully. You can now log in with your new password."}


# ============= CHANGE PASSWORD (Authenticated) =============
@router.patch("/me/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: schema.ChangePasswordRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # IMPORTANT: password_hash can be None for Google users
    if (not current_user.password_hash) or (not verify_password(password_data.current_password, current_user.password_hash)):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    await crud.set_user_password(db, user=current_user, new_password=password_data.new_password)
    await crud.delete_all_reset_tokens_for_user(db, user_id=current_user.id)

    return {"message": "Password changed successfully"}
