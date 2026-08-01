import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email_notification(name: str, email: str, details: str) -> None:
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


async def send_email_safe(name: str, email: str, details: str) -> None:
    try:
        await send_email_notification(name, email, details)
        logger.info("Email notification sent for %s <%s>", name, email)
    except Exception as exc:
        logger.error("Email notification failed for %s <%s>: %s", name, email, exc)
