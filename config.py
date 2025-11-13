"""Application configuration module."""

from __future__ import annotations

import os


class Config:
    """Base configuration."""

    # Flask settings
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "change-me")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "0") == "1"
    HOST: str = os.getenv("FLASK_HOST", "127.0.0.1")
    PORT: int = int(os.getenv("FLASK_PORT", "5000"))

    # Database settings (placeholders)
    DB_SERVER: str = os.getenv("DB_SERVER", "")
    DB_NAME: str = os.getenv("DB_NAME", "")
    DB_USERNAME: str = os.getenv("DB_USERNAME", "")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")


