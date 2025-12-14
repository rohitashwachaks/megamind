# =============================================================================
# Flask Extensions Configuration
# =============================================================================
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Configure rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[os.getenv("RATE_LIMIT", "200 per day, 50 per hour")],
    storage_uri=os.getenv("RATE_LIMIT_STORAGE", "memory://")
)
