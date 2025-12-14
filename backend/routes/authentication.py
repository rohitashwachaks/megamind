# =============================================================================
# Authentication Routes (Phase 2)
# =============================================================================
import logging
import uuid

from flask import Blueprint, g

from backend.extensions import limiter
from backend.common.utils import parse_json, now_iso, sanitize_text
from backend.contracts.api_response import ApiResponse
from backend.settings.auth import verify_password, hash_password, generate_token

auth_blueprint = Blueprint("auth", __name__)
auth_logger = logging.getLogger("auth")


@auth_blueprint.route("/api/v1/auth/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    """Register a new user account."""
    payload, error = parse_json()
    if error:
        return error.to_flask()

    # Validate input
    email = payload.get("email")
    password = payload.get("password")
    confirm_password = payload.get("confirmPassword")
    display_name = payload.get("displayName", "")

    fields = {}
    if not email or not isinstance(email, str) or "@" not in email:
        fields["email"] = "valid email required"
    if not password or not isinstance(password, str) or len(password) < 8:
        fields["password"] = "minimum 8 characters required"
    if password != confirm_password:
        fields["confirmPassword"] = "passwords do not match"

    if fields:
        return ApiResponse("Invalid registration data", status=400, error=True, code="invalid_fields",
                           fields=fields).to_flask()

    # Check if user already exists
    existing_user = g.db.get_user_by_email(email)
    if existing_user:
        return ApiResponse("Email already registered", status=409, error=True, code="email_exists").to_flask()

    # Create new user
    created_at = now_iso()
    user_data = {
        "id": str(uuid.uuid4()),
        "email": sanitize_text(email.lower()),
        "passwordHash": hash_password(password),
        "displayName": sanitize_text(display_name) or email.split("@")[0],
        "focusCourseId": None,
        "createdAt": created_at,
        "updatedAt": created_at
    }

    try:
        created_user = g.db.create_user(user_data)
        # Generate token
        token = generate_token(created_user["id"])

        # Remove password hash from response
        created_user.pop("passwordHash", None)

        return ApiResponse({
            "user": created_user,
            "token": token
        }, status=201).to_flask()
    except Exception as e:
        auth_logger.error(f"Error creating user: {e}")
        return ApiResponse("Failed to create user", status=500, error=True, code="server_error").to_flask()


@auth_blueprint.route("/api/v1/auth/login", methods=["POST"])
@limiter.limit("20 per hour")
def login():
    """Login with email and password."""

    payload, error = parse_json()
    if error:
        return error.to_flask()

    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return ApiResponse("Email and password required", status=400, error=True, code="invalid_credentials").to_flask()

    # Find user
    user = g.db.get_user_by_email(email.lower())
    if not user or not verify_password(password, user.get("passwordHash", "")):
        return ApiResponse("Invalid email or password", status=401, error=True, code="invalid_credentials").to_flask()

    # Generate token
    token = generate_token(user["id"])

    # Remove password hash from response
    user.pop("passwordHash", None)

    return ApiResponse({
        "user": user,
        "token": token
    }).to_flask()
