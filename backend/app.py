import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

from flask import Flask, g, jsonify, request
from flask_cors import CORS

from db.factory import get_db_connector


@dataclass
class ApiResponse:
    """Simple response envelope aligned with docs/rest_api_common_schemas.md."""

    payload: Any
    status: int = 200
    error: bool = False
    code: str = "ok"
    fields: Optional[Dict[str, str]] = None

    def to_flask(self):
        trace_id = str(uuid.uuid4())
        if self.error:
            body = {"error": {"code": self.code, "message": self.payload}, "meta": {"traceId": trace_id}}
            if self.fields:
                body["error"]["fields"] = self.fields
            return jsonify(body), self.status
        return jsonify({"data": self.payload, "meta": {"traceId": trace_id}}), self.status


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.before_request
def before_request():
    g.db = get_db_connector("mongo")
    g.db.connect()


@app.teardown_request
def teardown_request(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


COURSE_STATUSES = {"active", "completed", "parked"}
LECTURE_STATUSES = {"not_started", "in_progress", "completed"}
ASSIGNMENT_STATUSES = {"not_started", "in_progress", "submitted", "skipped"}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def get_course(course_id: str) -> Optional[Dict[str, Any]]:
    return g.db.get_course(course_id)



def validate_url(value: str) -> bool:
  return isinstance(value, str) and value.startswith(("http://", "https://"))


def parse_json() -> Tuple[Dict[str, Any], Optional[ApiResponse]]:
  try:
    return request.get_json(force=True) or {}, None
  except Exception:
    return {}, ApiResponse("Invalid JSON payload", status=400, error=True, code="invalid_body")


@app.route("/api/v1/health", methods=["GET"])
def health():
  return ApiResponse({"status": "ok"}).to_flask()


@app.route("/api/v1/users/me", methods=["GET"])
def get_current_user():
  return ApiResponse(g.db.get_user()).to_flask()


@app.route("/api/v1/users/me", methods=["PATCH"])
def update_profile():
  payload, error = parse_json()
  if error:
    return error.to_flask()

  name = payload.get("displayName")
  if not name or not isinstance(name, str):
    return ApiResponse("displayName is required", status=400, error=True, code="invalid_fields", fields={"displayName": "required"}).to_flask()

  updated_user = g.db.update_user_profile(name)
  return ApiResponse(updated_user).to_flask()


@app.route("/api/v1/users/me/focus-course", methods=["PATCH"])
def set_focus_course():
  payload, error = parse_json()
  if error:
    return error.to_flask()

  course_id = payload.get("courseId")
  if course_id is not None and not get_course(course_id):
    return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()

  updated_user = g.db.set_focus_course(course_id)
  return ApiResponse(updated_user).to_flask()


@app.route("/api/v1/courses", methods=["GET"])
def list_courses():
  return ApiResponse(g.db.get_courses()).to_flask()


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

  if "status" in payload and payload["status"] not in COURSE_STATUSES:
    fields["status"] = f"must be one of {', '.join(COURSE_STATUSES)}"

  if fields:
    return ApiResponse("Invalid course payload", status=400, error=True, code="invalid_fields", fields=fields)
  return None


@app.route("/api/v1/courses", methods=["POST"])
def create_course():
  payload, error = parse_json()
  if error:
    return error.to_flask()

  validation_error = validate_course_payload(payload)
  if validation_error:
    return validation_error.to_flask()

  created_at = now_iso()
  new_course = {
    "id": str(uuid.uuid4()),
    "title": payload["title"],
    "description": payload.get("description", ""),
    "source": payload["source"],
    "status": "active",
    "notes": payload.get("notes", ""),
    "tags": payload.get("tags", []),
    "lectures": [],
    "assignments": [],
    "createdAt": created_at,
    "updatedAt": created_at
  }
  created_course = g.db.create_course(new_course)
  return ApiResponse(created_course, status=201).to_flask()


@app.route("/api/v1/courses/<course_id>", methods=["GET"])
def get_course_detail(course_id: str):
  course = get_course(course_id)
  if not course:
    return ApiResponse("Course not found", status=404, error=True, code="course_not_found").to_flask()
  return ApiResponse(deepcopy(course)).to_flask()


@app.route("/api/v1/courses/<course_id>", methods=["PATCH"])
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

  if "status" in payload and payload["status"] not in LECTURE_STATUSES:
    fields["status"] = f"must be one of {', '.join(LECTURE_STATUSES)}"

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


@app.route("/api/v1/courses/<course_id>/lectures", methods=["POST"])
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

  created_at = now_iso()
  lecture = {
    "id": str(uuid.uuid4()),
    "courseId": course_id,
    "title": payload["title"],
    "order": int(payload["order"]),
    "videoUrl": payload["videoUrl"],
    "status": payload.get("status", "not_started"),
    "durationMinutes": payload.get("durationMinutes"),
    "note": payload.get("note", ""),
    "createdAt": created_at,
    "updatedAt": created_at
  }
  created_lecture = g.db.create_lecture(course_id, lecture)
  return ApiResponse(created_lecture, status=201).to_flask()


@app.route("/api/v1/courses/<course_id>/lectures/<lecture_id>", methods=["PATCH"])
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
          updates[field] = payload[field]
  updated_lecture = g.db.update_lecture(course_id, lecture_id, updates)
  return ApiResponse(updated_lecture).to_flask()


def validate_assignment_payload(payload: Dict[str, Any], *, is_update: bool = False) -> Optional[ApiResponse]:
  fields: Dict[str, str] = {}
  if not is_update and not payload.get("title"):
    fields["title"] = "required"

  if "status" in payload and payload["status"] not in ASSIGNMENT_STATUSES:
    fields["status"] = f"must be one of {', '.join(ASSIGNMENT_STATUSES)}"

  if "dueDate" in payload and payload.get("dueDate"):
    try:
      datetime.strptime(payload["dueDate"], "%Y-%m-%d")
    except ValueError:
      fields["dueDate"] = "must use YYYY-MM-DD"

  if fields:
    return ApiResponse("Invalid assignment payload", status=400, error=True, code="invalid_fields", fields=fields)
  return None


@app.route("/api/v1/courses/<course_id>/assignments", methods=["POST"])
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

  created_at = now_iso()
  assignment = {
    "id": str(uuid.uuid4()),
    "courseId": course_id,
    "title": payload["title"],
    "status": payload.get("status", "not_started"),
    "dueDate": payload.get("dueDate"),
    "link": payload.get("link"),
    "note": payload.get("note", ""),
    "createdAt": created_at,
    "updatedAt": created_at
  }
  created_assignment = g.db.create_assignment(course_id, assignment)
  return ApiResponse(created_assignment, status=201).to_flask()


@app.route("/api/v1/courses/<course_id>/assignments/<assignment_id>", methods=["PATCH"])
def update_assignment(course_id: str, assignment_id: str):
  course = get_course(course_id)
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
          updates[field] = payload[field]
  updated_assignment = g.db.update_assignment(course_id, assignment_id, updates)
  return ApiResponse(updated_assignment).to_flask()

@app.route('/')
def home():
  return "Hello, World!"


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8000, debug=True)
