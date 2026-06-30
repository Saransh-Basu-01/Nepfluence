import logging
import logging.config
import sys
from src.config import settings

# ✅ Logging configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        # ✅ Simple format for console
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        },
        # ✅ Detailed format for file
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        },
        # ✅ JSON format for production (for log aggregation)
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
        }
    },
    "handlers": {
        # ✅ Console (stdout)
        "console": {
            "class": "logging.StreamHandler",
            "level": settings.LOG_LEVEL,
            "formatter": "default",
            "stream": "ext://sys.stdout"
        },
        # ✅ File handler
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "level": settings.LOG_LEVEL,
            "formatter": "detailed",
            "filename": "logs/nepfluence.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,  # Keep 5 backup files
        },
        # ✅ Error file handler (errors only)
        "error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "level": "ERROR",
            "formatter": "detailed",
            "filename": "logs/errors.log",
            "maxBytes": 10485760,
            "backupCount": 5,
        },
    },
    "loggers": {
        # ✅ Root logger (catches all)
        "": {
            "level": settings.LOG_LEVEL,
            "handlers": ["console", "file", "error_file"],
        },
        # ✅ SQLAlchemy logger (less verbose in production)
        "sqlalchemy.engine": {
            "level": "WARNING" if settings.ENVIRONMENT == "production" else "INFO",
            "handlers": ["console", "file"],
            "propagate": False,
        },
        # ✅ FastAPI logger
        "fastapi": {
            "level": settings.LOG_LEVEL,
            "handlers": ["console", "file"],
            "propagate": False,
        }
    }
}

def setup_logging():
    """Initialize logging configuration"""
    # Create logs directory if it doesn't exist
    import os
    os.makedirs("logs", exist_ok=True)
    
    # Apply configuration
    logging.config.dictConfig(LOGGING_CONFIG)
    
    # Get root logger
    logger = logging.getLogger()
    logger.info(f" Logging initialized - Level: {settings.LOG_LEVEL}, Environment: {settings.ENVIRONMENT}")
    return logger