# =============================================================================
# User Routes
# =============================================================================

import logging
import uuid
from typing import Optional

from flask import g, Blueprint

from backend.settings.auth import token_required
from backend.contracts.api_response import ApiResponse

from backend.common.utils import parse_json, sanitize_text, now_iso

users_blueprint = Blueprint("users", __name__)
users_logger = logging.getLogger("user")


@users_blueprint.route("/api/v1/users/me", methods=["GET"])
@token_required
def get_current_user():
    """Get current user profile (requires authentication)."""
    try:
        user = g.db.get_user(g.user_id)
        if not user:
            return ApiResponse("User not found", status=404, error=True, code="user_not_found").to_flask()

        # Remove password hash from response
        user.pop("passwordHash", None)
        response = ApiResponse(user)
    except Exception as e:
        users_logger.error(f"Error fetching user: {e}")
        response = ApiResponse("Failed to fetch user", status=500, error=True, code="server_error")

    return response.to_flask()


@users_blueprint.route("/api/v1/users/me", methods=["PATCH"])
@token_required
def update_profile():
    """Update user profile (requires authentication)."""
    payload, error = parse_json()
    if error:
        return error.to_flask()

    name = payload.get("displayName")
    if not name or not isinstance(name, str):
        return ApiResponse("displayName is required", status=400, error=True, code="invalid_fields",
                           fields={"displayName": "required"}).to_flask()

    # Sanitize user input
    name = sanitize_text(name)
    updated_user = g.db.update_user_profile(g.user_id, name)
    if not updated_user:
        return ApiResponse("Failed to update user", status=500, error=True, code="server_error").to_flask()

    # Remove password hash from response
    updated_user.pop("passwordHash", None)
    return ApiResponse(updated_user).to_flask()


@users_blueprint.route("/api/v1/users/me/focus-course", methods=["PATCH"])
@token_required
def set_focus_course():
    """Set user's focus course (requires authentication)."""
    payload, error = parse_json()
    if error:
        return error.to_flask()

    course_id = payload.get("courseId")
    if course_id is not None and not get_course(course_id):
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    updated_user = g.db.set_focus_course(g.user_id, course_id)
    if not updated_user:
        return ApiResponse("Failed to update focus course", status=500, error=True, code="server_error").to_flask()

    # Remove password hash from response
    updated_user.pop("passwordHash", None)
    return ApiResponse(updated_user).to_flask()


@users_blueprint.route("/api/v1/users/me/export", methods=["GET"])
@token_required
def export_user_data():
    """Export all user data as JSON for backup (requires authentication)."""
    try:
        user = g.db.get_user(g.user_id)
        if not user:
            return ApiResponse("User not found", status=404, error=True, code="user_not_found").to_flask()

        # Get enriched courses with user data
        courses = g.db.get_enriched_courses(g.user_id)

        # Remove password hash from user data
        user.pop("passwordHash", None)

        export_data = {
            "user": user,
            "courses": courses,
            "exportedAt": now_iso(),
            "version": "2.0"
        }

        return ApiResponse(export_data).to_flask()
    except Exception as e:
        users_logger.error(f"Error exporting user data: {e}")
        return ApiResponse("Failed to export data", status=500, error=True, code="server_error").to_flask()
