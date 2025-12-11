from flask import Blueprint

from .authentication import auth_blueprint
from .courses import courses_blueprint
from .user_course import user_course_blueprint
from .users import users_blueprint
from ..contracts.api_response import ApiResponse

api_v1 = Blueprint("api_v1_routes", __name__)

api_v1.register_blueprint(user_course_blueprint, url_prefix="/courses")
api_v1.register_blueprint(users_blueprint, url_prefix="/users")
api_v1.register_blueprint(courses_blueprint, url_prefix="/courses")
api_v1.register_blueprint(auth_blueprint, url_prefix="/auth")


@api_v1.route("/")
def home():
    return ApiResponse("Hello World")


@api_v1.route("/health", methods=["GET"])
def health():
    return ApiResponse({"status": "ok"}).to_flask()
