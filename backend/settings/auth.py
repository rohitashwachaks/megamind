"""
JWT Authentication module for Phase-2
Handles user registration, login, and token management.
"""

import os
import logging
from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Optional, Dict, Any

import jwt
from flask import request, g
from werkzeug.security import generate_password_hash, check_password_hash

logger = logging.getLogger(__name__)

# Get JWT configuration from environment
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))  # 1 hour default


def generate_token(user_id: str) -> str:
    """Generate a JWT token for a user."""
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=JWT_EXPIRATION),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        return None


def hash_password(password: str) -> str:
    """Hash a password using werkzeug's secure method."""
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash."""
    return check_password_hash(password_hash, password)


def token_required(f):
    """
    Decorator to protect routes that require authentication.
    Extracts user_id from JWT token and adds it to flask's g object.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        if not token:
            from app import ApiResponse
            return ApiResponse(
                "Authentication token is missing",
                status=401,
                error=True,
                code="unauthorized"
            ).to_flask()
        
        # Decode and validate token
        payload = decode_token(token)
        if not payload:
            from app import ApiResponse
            return ApiResponse(
                "Invalid or expired token",
                status=401,
                error=True,
                code="unauthorized"
            ).to_flask()
        
        # Add user_id to g for use in the route
        g.user_id = payload.get("user_id")
        
        return f(*args, **kwargs)
    
    return decorated


def optional_token(f):
    """
    Decorator for routes that work with or without authentication.
    If token is present and valid, adds user_id to g, otherwise continues without it.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        if token:
            payload = decode_token(token)
            if payload:
                g.user_id = payload.get("user_id")
        
        return f(*args, **kwargs)
    
    return decorated
