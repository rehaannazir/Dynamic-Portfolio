from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime


# ── Contact ──────────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    details: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        if len(v) > 100:
            raise ValueError("Name must be 100 characters or fewer")
        return v

    @field_validator("details")
    @classmethod
    def details_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Project details cannot be empty")
        if len(v) > 500:
            raise ValueError("Details must be 500 characters or fewer")
        return v


class ContactResponse(BaseModel):
    ok: bool
    message: str


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    details: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Portfolio data ─────────────────────────────────────────────────────────────

class Project(BaseModel):
    n: str
    cat: str
    title: str
    desc: str
    role: str
    stack: List[str]


class ServiceItem(BaseModel):
    title: str
    desc: str
    points: List[str]


class Review(BaseModel):
    name: str
    role: str
    rating: int
    text: str


class Post(BaseModel):
    slug: str
    title: str
    cat: str
    date: str
    read: str
    excerpt: str
    featured: Optional[bool] = False
