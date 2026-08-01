from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from app.core.config import settings
from typing import AsyncGenerator


def _build_engine():
    url = settings.database_url
    if not url.startswith("postgresql"):
        return create_async_engine(url, echo=False)
    parsed = urlparse(url)
    params = {k: v[0] for k, v in parse_qs(parsed.query).items() if k != "sslmode"}
    clean_url = urlunparse(parsed._replace(query=urlencode(params)))
    if not clean_url.startswith("postgresql+asyncpg"):
        clean_url = clean_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return create_async_engine(clean_url, echo=False, connect_args={"ssl": "require"})


engine = _build_engine()
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
