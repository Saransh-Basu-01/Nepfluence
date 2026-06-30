from pydantic import SecretStr,Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    # JWT Settings
    SECRET_KEY: SecretStr = SecretStr("change-this-local-dev-secret-at-least-32-bytes")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:password@localhost:5432/nepfluence",
        description="PostgreSQL connection string"
    )
    ENVIRONMENT: str = Field(default="development", description="dev, staging, or prod")

    YOUTUBE_API_KEY: str = ""
    
    # File Upload
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024
    
    # Pagination
    POSTS_PER_PAGE: int = 10
    
    # Password Reset
    RESET_TOKEN_EXPIRE_MIN: int = 60
    
    # Email Settings (Mailtrap)
    MAIL_SERVER: str = "sandbox.smtp.mailtrap.io"
    MAIL_PORT: int = 2525
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: SecretStr = SecretStr("")
    MAIL_FROM: str = "noreply@nepfluence.com"
    MAIL_USE_TLS: bool = True

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://127.0.0.1:8000/auth/google/callback"
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3000"
    LOG_LEVEL: str = Field(default="INFO", description="DEBUG, INFO, WARNING, ERROR, CRITICAL")

settings = Settings()
