import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from config import settings
from database import init_db
from routers.contact import router as contact_router
from routers.portfolio import router as portfolio_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    try:
        await init_db()
        logger.info("Database initialised successfully")
    except Exception as e:
        logger.error("Database init failed: %s", e)
        raise
    yield


app = FastAPI(
    title="Rehan Nazir — Portfolio API",
    description="Backend for rehan.nazir portfolio. Serves project data and handles contact form submissions.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(portfolio_router)
app.include_router(contact_router)


@app.get("/", include_in_schema=False)
async def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.get("/api/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok", "service": "rehan-portfolio-api"}
