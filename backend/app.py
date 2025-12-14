import logging
import os
import uuid
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from sys import prefix
from typing import Any, Dict, Optional, Tuple

import bleach
from dotenv import load_dotenv
from flask import Flask, g, jsonify, request, Blueprint
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from backend.common.utils import parse_json, now_iso, sanitize_text
from backend.db.factory import get_db_connector
from backend.contracts.api_response import ApiResponse

from backend.extensions import limiter
from backend.routes.home import api_v1

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS with environment-based origins
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

logger.info(f"CORS configured for origins: {cors_origins}")

# Initialize rate limiter with app
limiter.init_app(app)

logger.info("Rate limiting configured")


@app.before_request
def before_request():
    try:
        db_type = os.getenv("DB_TYPE", "mongo")
        g.db = get_db_connector(db_type)
        g.db.connect()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise


@app.teardown_request
def teardown_request(exception):
    db = g.pop("db", None)
    if db is not None:
        try:
            db.close()
        except Exception as e:
            logger.error(f"Error closing database connection: {e}")


# Register user course data routes
app.register_blueprint(api_v1, url_prefix="/api/v1")


@app.route('/')
def home():
    return "Hello, World!"


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 8000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    logger.info(f"Starting Flask app on port {port} (debug={debug})")
    app.run(host="0.0.0.0", port=port, debug=debug)
