import bcrypt
import jwt
import secrets
from datetime import datetime, timedelta
import be.core.config as config


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verifica_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def genera_access_token(user_id: str, username: str, roles: list) -> tuple[str, datetime]:
    expiry = datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "username": username,
        "roles": roles,
        "exp": expiry
    }
    token = jwt.encode(payload, config.SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    return token, expiry

def genera_refresh_token() -> tuple[str, datetime]:
    token = secrets.token_urlsafe(64)
    expiry = datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    return token, expiry