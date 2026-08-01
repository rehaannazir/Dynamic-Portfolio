from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request

_rate_store: dict[str, list[datetime]] = {}
_WINDOW = timedelta(hours=1)
_MAX_REQUESTS = 5


def get_client_ip(request: Request) -> str:
    # Render (and most proxies) pass the real IP in X-Forwarded-For.
    # request.client.host returns the proxy IP, not the visitor's IP.
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(ip: str) -> None:
    now = datetime.now(timezone.utc)
    timestamps = [t for t in _rate_store.get(ip, []) if now - t < _WINDOW]
    if len(timestamps) >= _MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Please wait before trying again.",
        )
    timestamps.append(now)
    _rate_store[ip] = timestamps
