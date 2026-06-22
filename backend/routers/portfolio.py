from fastapi import APIRouter, HTTPException
from models import Project, ServiceItem, Review, Post
from data import PROJECTS, SERVICES, REVIEWS, POSTS, POSTS_BY_SLUG

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/projects", response_model=list[Project])
async def get_projects() -> list[Project]:
    return PROJECTS


@router.get("/services", response_model=list[ServiceItem])
async def get_services() -> list[ServiceItem]:
    return SERVICES


@router.get("/reviews", response_model=list[Review])
async def get_reviews() -> list[Review]:
    return REVIEWS


@router.get("/posts", response_model=list[Post])
async def get_posts() -> list[Post]:
    return POSTS


@router.get("/posts/{slug}", response_model=Post)
async def get_post(slug: str) -> Post:
    post = POSTS_BY_SLUG.get(slug)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post '{slug}' not found")
    return post
