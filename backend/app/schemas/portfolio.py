from pydantic import BaseModel
from typing import List, Optional


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
