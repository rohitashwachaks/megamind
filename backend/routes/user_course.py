
"""
User Course Data Routes

These endpoints manage user-specific course data (enrollment, progress, notes).
Separate from course catalog management.
"""
import logging
import uuid
from flask import g, Blueprint

from ..auth import token_required
from ..contracts.api_response import ApiResponse
from ..common.utils import now_iso, parse_json, sanitize_html

user_course_blueprint = Blueprint("user_course_routes", __name__)
user_course_logger = logging.getLogger("user_course_routes")


@user_course_blueprint.route("/<course_id>/enroll", methods=["POST"])
def enroll_in_course(course_id: str):
    """
    Enroll user in a course (creates UserCourseData record).
    Requires authentication.
    """

    @token_required
    def _enroll():
        try:
            # Check if course exists in catalog
            course = g.db.get_course(course_id)
            if not course:
                return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

            # Check if already enrolled
            existing = g.db.get_user_course_data(g.user_id, course_id)
            if existing:
                return ApiResponse("Already enrolled in this course", status=409, error=True,
                                   code="already_enrolled").to_flask()

            # Create user course data
            created_at = now_iso()
            user_course_data = {
                "id": str(uuid.uuid4()),
                "userId": g.user_id,
                "courseId": course_id,
                "status": "active",
                "notes": "",
                "lectures": [],
                "assignments": [],
                "createdAt": created_at,
                "updatedAt": created_at
            }

            created = g.db.create_user_course_data(user_course_data)
            return ApiResponse(created, status=201).to_flask()
        except Exception as e:
            user_course_logger.error(f"Error enrolling in course: {e}")
            return ApiResponse("Failed to enroll in course", status=500, error=True, code="server_error").to_flask()

    return _enroll()


@user_course_blueprint.route("/<course_id>/user-data", methods=["PATCH"])
def update_user_course_data(course_id: str):
    """
    Update user-specific course data (status, notes).
    Requires authentication.
    """

    @token_required
    def _update():
        payload, error = parse_json()
        if error:
            return error.to_flask()

        # Check if enrolled
        user_course = g.db.get_user_course_data(g.user_id, course_id)
        if not user_course:
            return ApiResponse("Not enrolled in this course", status=404, error=True,
                               code="not_enrolled").to_flask()

        # Build updates
        updates = {}
        if "status" in payload:
            valid_statuses = {"active", "completed", "parked"}
            if payload["status"] not in valid_statuses:
                return ApiResponse(f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
                                   status=400, error=True, code="invalid_status").to_flask()
            updates["status"] = payload["status"]

        if "notes" in payload:
            updates["notes"] = sanitize_html(payload["notes"])

        if not updates:
            return ApiResponse("No valid fields to update", status=400, error=True, code="no_updates").to_flask()

        updated = g.db.update_user_course_data(g.user_id, course_id, updates)
        return ApiResponse(updated).to_flask()

    return _update()


@user_course_blueprint.route("/<course_id>/lectures/<lecture_id>/user-data", methods=["PATCH"])
def update_user_lecture_data(course_id: str, lecture_id: str):
    """
    Update user-specific lecture data (status, notes).
    Requires authentication. Auto-enrolls if not already enrolled.
    """

    @token_required
    def _update():
        payload, error = parse_json()
        if error:
            return error.to_flask()

        # Check if course exists
        course = g.db.get_course(course_id)
        if not course:
            return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

        # Check if lecture exists in catalog
        lecture_exists = any(l["id"] == lecture_id for l in course.get("lectures", []))
        if not lecture_exists:
            return ApiResponse("Lecture not found", status=404, error=True, code="lecture_not_found").to_flask()

        # Auto-enroll if not enrolled
        user_course = g.db.get_user_course_data(g.user_id, course_id)
        if not user_course:
            created_at = now_iso()
            user_course_data = {
                "id": str(uuid.uuid4()),
                "userId": g.user_id,
                "courseId": course_id,
                "status": "active",
                "notes": "",
                "lectures": [],
                "assignments": [],
                "createdAt": created_at,
                "updatedAt": created_at
            }
            g.db.create_user_course_data(user_course_data)

        # Build updates
        updates = {}
        if "status" in payload:
            valid_statuses = {"not_started", "in_progress", "completed"}
            if payload["status"] not in valid_statuses:
                return ApiResponse(f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
                                   status=400, error=True, code="invalid_status").to_flask()
            updates["status"] = payload["status"]

        if "note" in payload:
            updates["note"] = sanitize_html(payload["note"])

        if not updates:
            return ApiResponse("No valid fields to update", status=400, error=True, code="no_updates").to_flask()

        updated = g.db.update_user_lecture_data(g.user_id, course_id, lecture_id, updates)
        return ApiResponse(updated).to_flask()

    return _update()


@user_course_blueprint.route("/<course_id>/assignments/<assignment_id>/user-data", methods=["PATCH"])
def update_user_assignment_data(course_id: str, assignment_id: str):
    """
    Update user-specific assignment data (status, notes, custom due date).
    Requires authentication. Auto-enrolls if not already enrolled.
    """

    @token_required
    def _update():
        payload, error = parse_json()
        if error:
            return error.to_flask()

        # Check if course exists
        course = g.db.get_course(course_id)
        if not course:
            return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

        # Check if assignment exists in catalog
        assignment_exists = any(a["id"] == assignment_id for a in course.get("assignments", []))
        if not assignment_exists:
            return ApiResponse("Assignment not found", status=404, error=True,
                               code="assignment_not_found").to_flask()

        # Auto-enroll if not enrolled
        user_course = g.db.get_user_course_data(g.user_id, course_id)
        if not user_course:
            created_at = now_iso()
            user_course_data = {
                "id": str(uuid.uuid4()),
                "userId": g.user_id,
                "courseId": course_id,
                "status": "active",
                "notes": "",
                "lectures": [],
                "assignments": [],
                "createdAt": created_at,
                "updatedAt": created_at
            }
            g.db.create_user_course_data(user_course_data)

        # Build updates
        updates = {}
        if "status" in payload:
            valid_statuses = {"not_started", "in_progress", "submitted", "skipped"}
            if payload["status"] not in valid_statuses:
                return ApiResponse(f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
                                   status=400, error=True, code="invalid_status").to_flask()
            updates["status"] = payload["status"]

        if "note" in payload:
            updates["note"] = sanitize_html(payload["note"])

        if "dueDate" in payload:
            if payload["dueDate"]:
                # Validate date format
                from datetime import datetime
                try:
                    datetime.strptime(payload["dueDate"], "%Y-%m-%d")
                    updates["dueDate"] = payload["dueDate"]
                except ValueError:
                    return ApiResponse("Invalid date format. Use YYYY-MM-DD",
                                       status=400, error=True, code="invalid_date").to_flask()
            else:
                updates["dueDate"] = ""

        if not updates:
            return ApiResponse("No valid fields to update", status=400, error=True, code="no_updates").to_flask()

        updated = g.db.update_user_assignment_data(g.user_id, course_id, assignment_id, updates)
        return ApiResponse(updated).to_flask()

    return _update()
