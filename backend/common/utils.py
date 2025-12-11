from datetime import datetime, timezone
from typing import Tuple, Optional, Dict, Any

from backend.contracts.api_response import ApiResponse


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def get_course(course_id: str) -> Optional[Dict[str, Any]]:
    return g.db.get_course(course_id)


def validate_url(value: str) -> bool:
    return isinstance(value, str) and value.startswith(("http://", "https://"))


def sanitize_html(text: str, allow_tags: list = None) -> str:
    """
  Sanitize HTML content to prevent XSS attacks.
  By default, strips all HTML tags. Pass allow_tags for basic formatting.
  """
    if not text or not isinstance(text, str):
        return text

    if allow_tags is None:
        # For notes, allow basic formatting tags
        allow_tags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a']

    allowed_attrs = {'a': ['href', 'title']}
    return bleach.clean(text, tags=allow_tags, attributes=allowed_attrs, strip=True)


def sanitize_text(text: str) -> str:
    """Sanitize plain text fields (titles, names, etc.) - strips all HTML."""
    if not text or not isinstance(text, str):
        return text
    return bleach.clean(text, tags=[], strip=True)


def parse_json() -> Tuple[Dict[str, Any], Optional[ApiResponse]]:
    try:
        return request.get_json(force=True) or {}, None
    except Exception:
        return {}, ApiResponse("Invalid JSON payload", status=400, error=True, code="invalid_body")
