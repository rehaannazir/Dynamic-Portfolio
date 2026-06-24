import logging
import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import datetime, timezone, timedelta

from database import ContactMessage, get_db
from models import ContactRequest, ContactResponse, ContactMessageOut
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])

_rate_store: dict[str, list[datetime]] = {}
_WINDOW = timedelta(hours=1)
_MAX_REQUESTS = 3


def _check_rate_limit(ip: str) -> None:
    now = datetime.now(timezone.utc)
    timestamps = [t for t in _rate_store.get(ip, []) if now - t < _WINDOW]
    if len(timestamps) >= _MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Please wait before trying again.",
        )
    timestamps.append(now)
    _rate_store[ip] = timestamps


async def _send_email_notification(name: str, email: str, details: str) -> None:
    if not settings.email_enabled:
        return

    html = f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#07070d;font-family:'Inter',sans-serif;color:#cbd5e1">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#0f0f1a;border-radius:16px;border:1px solid rgba(139,92,246,0.3);overflow:hidden">
        <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:28px 32px">
          <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7)">rehan.nazir portfolio</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff">New project inquiry</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:10px 10px 0 0;border:1px solid rgba(255,255,255,0.08);border-bottom:none">
              <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Name</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#f1f5f9">{name}</p>
            </td></tr>
            <tr><td style="padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-bottom:none">
              <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Email</p>
              <a href="mailto:{email}" style="margin:0;font-size:15px;font-weight:600;color:#818cf8;text-decoration:none">{email}</a>
            </td></tr>
            <tr><td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 10px 10px;border:1px solid rgba(255,255,255,0.08)">
              <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Project details</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;white-space:pre-wrap">{details}</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px">
            <tr><td align="center">
              <a href="mailto:{email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-weight:600;font-size:14px;border-radius:10px;text-decoration:none">Reply to {name} →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06)">
          <p style="margin:0;font-size:11px;color:#334155;text-align:center">Sent from your portfolio contact form · rehan.nazir()</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    plain = f"New message from your portfolio.\n\nName: {name}\nEmail: {email}\nDetails:\n{details}"

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json={
                "from": "Rehan Portfolio <onboarding@resend.dev>",
                "to": [settings.notify_to],
                "reply_to": email,
                "subject": f"New contact from {name} — Portfolio",
                "html": html,
                "text": plain,
            },
        )
        resp.raise_for_status()


async def _send_email_safe(name: str, email: str, details: str) -> None:
    try:
        await _send_email_notification(name, email, details)
        logger.info("Email notification sent for %s <%s>", name, email)
    except Exception as exc:
        logger.error("Email notification failed for %s <%s>: %s", name, email, exc)


@router.post("", response_model=ContactResponse, status_code=201)
async def submit_contact(
    payload: ContactRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ContactResponse:
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)

    message = ContactMessage(
        name=payload.name,
        email=payload.email,
        details=payload.details,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    background_tasks.add_task(_send_email_safe, payload.name, payload.email, payload.details)

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
        await _send_email_notification(
            "Test Sender",
            settings.notify_to,
            "This is a test email from your portfolio backend. SMTP is working correctly.",
        )
        return {"ok": True, "sent_to": settings.notify_to}
    except Exception as exc:
        return {"ok": False, "error": str(exc), "smtp_host": settings.smtp_host, "smtp_user": settings.smtp_user}
