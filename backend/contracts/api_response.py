import uuid
from flask import jsonify
from dataclasses import dataclass
from typing import Optional, Dict, Any


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
