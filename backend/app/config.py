from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "sqlite:///./nova.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ]

    # Backward‑compatible alias used by the FastAPI app
    @property
    def cors_origins(self) -> List[str]:
        return self.CORS_ORIGINS

    # AI (placeholder keys – will be read from .env in production)
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "openai/gpt-3.5-turbo"
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama3-70b-8192"
    DEEPSEEK_API_KEY: Optional[str] = None
    DEEPSEEK_MODEL: str = "deepseek-chat"

    # Server configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    # Pydantic configuration – load .env, ignore extra vars
    model_config = ConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    # Backward‑compatible property names expected by other modules
    @property
    def database_url(self) -> str:
        return self.DATABASE_URL

    @property
    def api_host(self) -> str:
        return self.API_HOST

    @property
    def api_port(self) -> int:
        return self.API_PORT

    @property
    def debug(self) -> bool:
        return self.DEBUG

    def get_ai_provider(self) -> dict:
        """Prefer DeepSeek, then OpenRouter, then Groq for older .env files."""
        if settings.deepseek_api_key:
            return PROVIDERS["deepseek"]
        if settings.openrouter_api_key:
            return PROVIDERS["openrouter"]
        if settings.groq_api_key:
            return PROVIDERS["groq"]
        return PROVIDERS["deepseek"]

    def validate_production(self) -> None:
        """Run sanity checks for a production deployment.
        Raises ``ValueError`` if required settings are missing or insecure.
        """
        if "sqlite" in self.DATABASE_URL:
            print("⚠️  WARNING: Using SQLite – not recommended for production!")
        if not (self.OPENROUTER_API_KEY or self.GROQ_API_KEY or self.DEEPSEEK_API_KEY):
            raise ValueError("❌ OPENROUTER_API_KEY, GROQ_API_KEY, or DEEPSEEK_API_KEY is required for ASTRA")
        if self.SECRET_KEY == "your-secret-key-change-in-production":
            raise ValueError("❌ SECRET_KEY must be changed from the default in production")

# Export a singleton instance
settings = Settings()
