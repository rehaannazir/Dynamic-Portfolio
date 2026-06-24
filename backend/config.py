from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    cors_origins: str = "http://localhost:5173,http://localhost:4173"
    admin_api_key: str = "change-me-before-deploy"
    database_url: str = "sqlite+aiosqlite:///./portfolio.db"

    resend_api_key: str = ""
    notify_to: str = "rehaan689nazir@gmail.com"

    # Legacy SMTP fields kept so old .env files don't break
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_pass: str = ""

    @property
    def allowed_origins(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def email_enabled(self) -> bool:
        return bool(self.resend_api_key)


settings = Settings()
