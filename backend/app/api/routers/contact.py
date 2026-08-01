from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func

from app.db.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactRequest, ContactResponse, ContactMessageOut
from app.core.config import settings
from app.services.email_service import send_email_notification, send_email_safe
from app.services.rate_limiter import check_rate_limit, get_client_ip

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactResponse, status_code=201)
async def submit_contact(
    payload: ContactRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ContactResponse:
    client_ip = get_client_ip(request)
    check_rate_limit(client_ip)

    message = ContactMessage(
        name=payload.name,
        email=payload.email,
        details=payload.details,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    background_tasks.add_task(send_email_safe, payload.name, payload.email, payload.details)

    return ContactResponse(ok=True, message="Message received — I'll be in touch soon!")


@router.get(
    "/messages",
    response_model=list[ContactMessageOut],
    tags=["admin"],
    summary="List all contact messages (admin only)",
)
async def list_messages(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> list[ContactMessageOut]:
    api_key = request.headers.get("x-admin-key", "")
    if api_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(
        select(ContactMessage).order_by(desc(ContactMessage.created_at))
    )
    rows = result.scalars().all()
    return [ContactMessageOut.model_validate(r) for r in rows]


@router.get("/count", tags=["admin"], summary="Total number of stored contact messages")
async def message_count(db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(func.count()).select_from(ContactMessage))
    return {"count": result.scalar() or 0}


@router.get("/test-email", include_in_schema=False)
async def test_email(request: Request) -> dict:
    api_key = request.headers.get("x-admin-key", "")
    if api_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Forbidden")

    if not settings.email_enabled:
        return {
            "ok": False,
            "error": "RESEND_API_KEY not set in environment variables",
        }

    try:
        await send_email_notification(
            "Test Sender",
            settings.notify_to,
            "This is a test email from your portfolio backend. SMTP is working correctly.",
        )
        return {"ok": True, "sent_to": settings.notify_to}
    except Exception as exc:
        return {"ok": False, "error": str(exc), "smtp_host": settings.smtp_host, "smtp_user": settings.smtp_user}
