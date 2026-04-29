from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


LOCAL_CORS_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}


class Settings(BaseSettings):
    app_name: str = "Smart Notes API"
    environment: str = "development"
    database_url: str = Field(..., alias="DATABASE_URL")
    frontend_url: str = Field("http://localhost:5173", alias="FRONTEND_URL")
    cors_origins: str = Field("", alias="CORS_ORIGINS")
    secret_key: str = Field("change-this-local-secret", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(60 * 24, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("database_url")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @property
    def allowed_origins(self) -> list[str]:
        origins = {
            origin.strip().rstrip("/")
            for origin in self.cors_origins.split(",")
            if origin.strip()
        }
        if self.frontend_url:
            origins.add(str(self.frontend_url).rstrip("/"))
        if self.environment == "development":
            origins.update(LOCAL_CORS_ORIGINS)
        return sorted(origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()
