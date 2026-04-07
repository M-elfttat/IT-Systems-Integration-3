from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request

from app.models import User


def role_required(*allowed_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get("role")
            if user_role not in allowed_roles:
                return jsonify({"message": "Forbidden: insufficient permissions"}), 403
            return func(*args, **kwargs)

        return wrapper

    return decorator


def current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)
