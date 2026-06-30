from datetime import UTC, datetime, timedelta
import jwt
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import hashlib
import secrets
from src.config import settings  
from src.database import get_db   
from src.users import model  

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES  
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY.get_secret_value(),  
        algorithm=settings.ALGORITHM  
    )
    return encoded_jwt

def verify_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY.get_secret_value(),  
            algorithms=[settings.ALGORITHM],  
            options={"require": ['exp', 'sub']}
        )
    except jwt.InvalidTokenError:
        return None
    else:
        return payload.get("sub")

def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)

def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> model.User:  
    user_id = verify_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    result = await db.execute(
        select(model.User).where(model.User.id == user_id_int)  
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user

CurrentUser = Annotated[model.User, Depends(get_current_user)]  
