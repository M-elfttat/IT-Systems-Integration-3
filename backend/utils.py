from datetime import datetime, timedelta, timezone
import jwt
from flask import current_app


def create_token(identity: int, role: str):
    payload = {
        "sub": str(identity),
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_token(token: str):
    return jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
