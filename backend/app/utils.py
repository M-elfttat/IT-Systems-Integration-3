from __future__ import annotations

from functools import wraps
from typing import Callable, TypeVar

from flask import jsonify
from flask_jwt_extended import get_jwt

T = TypeVar("T")


def json_error(code: str, message: str, status: int, details=None):
    payload = {"error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return jsonify(payload), status


def require_roles(*roles: str):
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            role = claims.get("role")
            if role not in roles:
                return json_error("FORBIDDEN", "You are not allowed to access this resource.", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator

