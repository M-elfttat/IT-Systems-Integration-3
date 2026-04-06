from functools import wraps
from flask import request, jsonify, g
import jwt
from utils import decode_token


def auth_required(role=None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing or invalid token."}), 401

            token = auth_header.split(" ", 1)[1]
            try:
                payload = decode_token(token)
                g.user_id = int(payload["sub"])
                g.role = payload["role"]
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired. Please log in again."}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token."}), 401

            if role and g.role != role:
                return jsonify({"message": "You do not have permission to access this resource."}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator
