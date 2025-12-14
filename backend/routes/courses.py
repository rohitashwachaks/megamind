# =============================================================================
# Course Routes
# =============================================================================
# 
# Course API Design:
# - GET /courses - List all courses (public catalog or enriched with user data if authenticated)
# - GET /courses/<id> - Get single course (public catalog or enriched with user data if authenticated)
# - POST /courses - Create new course in catalog (admin/authenticated)
# - PATCH /courses/<id> - Update course catalog metadata (admin/authenticated)
# - DELETE /courses/<id> - Delete course from catalog (admin/authenticated)
#
# User Course Enrollment:
# - POST /courses/<id>/enroll - Enroll in a course (creates UserCourseData)
# - PATCH /courses/<id>/user-data - Update user-specific course data (status, notes)
# - PATCH /courses/<id>/lectures/<lid>/user-data - Update user-specific lecture data
# - PATCH /courses/<id>/assignments/<aid>/user-data - Update user-specific assignment data
# =============================================================================
import logging
from typing import Dict, Any, Optional
from flask import g, Blueprint

from backend.settings.auth import optional_token
from backend.common.utils import sanitize_html, sanitize_text, parse_json, get_course
from backend.contracts.api_response import ApiResponse

courses_blueprint = Blueprint("courses", __name__)
courses_logger = logging.getLogger("courses")


@courses_blueprint.route("/", methods=["GET"])
@optional_token
def list_courses():
    """
    Get all courses.
    - Public: Returns course catalog without user-specific data
    - Authenticated: Returns courses enriched with user progress and notes
    """

    def _list_courses():
        try:
            # Get user_id from g if authenticated, otherwise None
            user_id = getattr(g, 'user_id', None)
            courses = g.db.get_enriched_courses(user_id)
            return ApiResponse(courses).to_flask()
        except Exception as e:
            courses_logger.error(f"Error fetching courses: {e}")
            return ApiResponse("Failed to fetch courses", status=500, error=True, code="server_error").to_flask()

    return _list_courses()


def validate_course_payload(payload: Dict[str, Any], *, is_update: bool = False) -> Optional[ApiResponse]:
    fields: Dict[str, str] = {}
    if not is_update:
        if not payload.get("title"):
            fields["title"] = "required"
        if not payload.get("source"):
            fields["source"] = "required"
        elif not validate_url(payload["source"]):
            fields["source"] = "must be an http(s) URL"

    if "source" in payload and payload.get("source") and not validate_url(payload["source"]):
        fields["source"] = "must be an http(s) URL"

    if "status" in payload and payload["status"] not in CourseStatus:
        fields["status"] = f"must be one of {', '.join(CourseStatus)}"

    if fields:
        return ApiResponse("Invalid course payload", status=400, error=True, code="invalid_fields", fields=fields)
    return None


@courses_blueprint.route("/courses", methods=["POST"])
def create_course():
    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_course_payload(payload)
    if validation_error:
        return validation_error.to_flask()

    # Sanitize text inputs
    created_at = now_iso()
    new_course = {
        "id": str(uuid.uuid4()),
        "title": sanitize_text(payload["title"]),
        "description": sanitize_text(payload.get("description", "")),
        "source": payload["source"],  # URLs are validated, not sanitized
        "status": "active",
        "notes": sanitize_html(payload.get("notes", "")),
        "tags": [sanitize_text(tag) for tag in payload.get("tags", [])],
        "lectures": [],
        "assignments": [],
        "createdAt": created_at,
        "updatedAt": created_at
    }
    created_course = g.db.create_course(new_course)
    return ApiResponse(created_course, status=201).to_flask()


@courses_blueprint.route("/courses/<course_id>", methods=["GET"])
def get_course_detail(course_id: str):
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()
    return ApiResponse(deepcopy(course)).to_flask()


@courses_blueprint.route("/courses/<course_id>", methods=["DELETE"])
def delete_course(course_id: str):
    """Delete a course and all its associated lectures and assignments."""
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    g.db.delete_course_cascading(course_id)
    return ApiResponse(None, status=204).to_flask()


@courses_blueprint.route("/courses/<course_id>", methods=["PATCH"])
def update_course(course_id: str):
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_course_payload(payload, is_update=True)
    if validation_error:
        return validation_error.to_flask()

    updates = {}
    for field in ("title", "description", "source", "status", "notes", "tags"):
        if field in payload:
            # Sanitize text inputs
            if field in ("title", "description"):
                updates[field] = sanitize_text(payload[field])
            elif field == "notes":
                updates[field] = sanitize_html(payload[field])
            elif field == "tags":
                updates[field] = [sanitize_text(tag) for tag in payload[field]]
            else:
                updates[field] = payload[field]
    updated_course = g.db.update_course(course_id, updates)
    return ApiResponse(updated_course).to_flask()


def validate_lecture_payload(payload: Dict[str, Any], *, is_update: bool = False) -> Optional[ApiResponse]:
    fields: Dict[str, str] = {}

    if not is_update:
        if not payload.get("title"):
            fields["title"] = "required"
        if not payload.get("videoUrl"):
            fields["videoUrl"] = "required"
        elif not validate_url(payload["videoUrl"]):
            fields["videoUrl"] = "must be an http(s) URL"
        if "order" not in payload:
            fields["order"] = "required"
        elif not isinstance(payload.get("order"), int) or payload["order"] < 1:
            fields["order"] = "must be a positive integer"

    if "status" in payload and payload["status"] not in LectureStatus:
        fields["status"] = f"must be one of {', '.join(LectureStatus)}"

    if "durationMinutes" in payload and payload.get("durationMinutes") is not None:
        if not isinstance(payload.get("durationMinutes"), int) or payload["durationMinutes"] < 1:
            fields["durationMinutes"] = "must be a positive integer"

    if is_update:
        if "videoUrl" in payload and payload.get("videoUrl") and not validate_url(payload["videoUrl"]):
            fields["videoUrl"] = "must be an http(s) URL"
        if "order" in payload and (not isinstance(payload.get("order"), int) or payload["order"] < 1):
            fields["order"] = "must be a positive integer"

    if fields:
        return ApiResponse("Invalid lecture payload", status=400, error=True, code="invalid_fields", fields=fields)
    return None


@courses_blueprint.route("/courses/<course_id>/lectures", methods=["POST"])
def create_lecture(course_id: str):
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_lecture_payload(payload)
    if validation_error:
        return validation_error.to_flask()

    # Sanitize text inputs
    created_at = now_iso()
    lecture = {
        "id": str(uuid.uuid4()),
        "courseId": course_id,
        "title": sanitize_text(payload["title"]),
        "order": int(payload["order"]),
        "videoUrl": payload["videoUrl"],  # URLs are validated
        "status": payload.get("status", "not_started"),
        "durationMinutes": payload.get("durationMinutes"),
        "note": sanitize_html(payload.get("note", "")),
        "createdAt": created_at,
        "updatedAt": created_at
    }
    created_lecture = g.db.create_lecture(course_id, lecture)
    return ApiResponse(created_lecture, status=201).to_flask()


@courses_blueprint.route("/courses/<course_id>/lectures/<lecture_id>", methods=["DELETE"])
def delete_lecture(course_id: str, lecture_id: str):
    """Delete a lecture."""
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    g.db.delete_lecture(course_id, lecture_id)
    return ApiResponse(None, status=204).to_flask()


@courses_blueprint.route("/courses/<course_id>/lectures/<lecture_id>", methods=["PATCH"])
def update_lecture(course_id: str, lecture_id: str):
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_lecture_payload(payload, is_update=True)
    if validation_error:
        return validation_error.to_flask()

    updates = {}
    for field in ("title", "videoUrl", "note", "order", "durationMinutes", "status"):
        if field in payload:
            # Sanitize text inputs
            if field == "title":
                updates[field] = sanitize_text(payload[field])
            elif field == "note":
                updates[field] = sanitize_html(payload[field])
            else:
                updates[field] = payload[field]
    updated_lecture = g.db.update_lecture(course_id, lecture_id, updates)
    return ApiResponse(updated_lecture).to_flask()


def validate_assignment_payload(payload: Dict[str, Any], *, is_update: bool = False) -> Optional[ApiResponse]:
    fields: Dict[str, str] = {}
    if not is_update and not payload.get("title"):
        fields["title"] = "required"

    if "status" in payload and payload["status"] not in AssignmentStatus:
        fields["status"] = f"must be one of {', '.join(AssignmentStatus)}"

    if "dueDate" in payload and payload.get("dueDate"):
        try:
            datetime.strptime(payload["dueDate"], "%Y-%m-%d")
        except ValueError:
            fields["dueDate"] = "must use YYYY-MM-DD"

    if fields:
        return ApiResponse("Invalid assignment payload", status=400, error=True, code="invalid_fields", fields=fields)
    return None


@courses_blueprint.route("/courses/<course_id>/assignments", methods=["POST"])
def create_assignment(course_id: str):
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_assignment_payload(payload)
    if validation_error:
        return validation_error.to_flask()

    # Sanitize text inputs
    created_at = now_iso()
    assignment = {
        "id": str(uuid.uuid4()),
        "courseId": course_id,
        "title": sanitize_text(payload["title"]),
        "status": payload.get("status", "not_started"),
        "dueDate": payload.get("dueDate"),
        "link": payload.get("link"),  # URLs are validated if present
        "note": sanitize_html(payload.get("note", "")),
        "createdAt": created_at,
        "updatedAt": created_at
    }
    created_assignment = g.db.create_assignment(course_id, assignment)
    return ApiResponse(created_assignment, status=201).to_flask()


@courses_blueprint.route("/courses/<course_id>/assignments/<assignment_id>", methods=["DELETE"])
def delete_assignment(course_id: str, assignment_id: str):
    """Delete an assignment."""
    course = get_course(course_id)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    g.db.delete_assignment(course_id, assignment_id)
    return ApiResponse(None, status=204).to_flask()


@courses_blueprint.route("/courses/<course_id>/assignments/<assignment_id>", methods=["PATCH"])
def update_assignment(course_id: str, assignment_id: str):
    try:
        course = get_course(course_id)
    except Exception as e:
        course = None
        courses_logger.error("Course not found", e)
    if not course:
        return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

    payload, error = parse_json()
    if error:
        return error.to_flask()

    validation_error = validate_assignment_payload(payload, is_update=True)
    if validation_error:
        return validation_error.to_flask()

    updates = {}
    for field in ("title", "dueDate", "link", "note", "status"):
        if field in payload:
            # Sanitize text inputs
            if field == "title":
                updates[field] = sanitize_text(payload[field])
            elif field == "note":
                updates[field] = sanitize_html(payload[field])
            else:
                updates[field] = payload[field]
    updated_assignment = g.db.update_assignment(course_id, assignment_id, updates)
    return ApiResponse(updated_assignment).to_flask()
