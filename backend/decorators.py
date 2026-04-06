from functools import wraps
import jwt
from flask import current_app, g, jsonify, request


def auth_required(role=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing or invalid authorization header."}), 401
            token = auth_header.split(" ", 1)[1]
            try:
                payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired."}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token."}), 401

            g.user_id = int(payload["sub"])
            g.role = payload["role"]
            if role and g.role != role:
                return jsonify({"message": "Forbidden."}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator
