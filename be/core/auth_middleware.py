from functools import wraps
from flask import request, jsonify, g
import jwt
from be.core import config
from be.core.database import Database
from be.models.users_model import Users
from be.models.user_roles_model import UserRole

db = Database()

def _get_token_from_cookie():
    return request.cookies.get("access_token")

def _decode_token(token: str):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token scaduto"}
    except jwt.InvalidTokenError:
        return {"error": "Token non valido"}

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_cookie()
        if not token:
            return jsonify({"message": "Access token mancante"}), 401

        decoded = _decode_token(token)
        if isinstance(decoded, dict) and decoded.get("error"):
            return jsonify({"message": decoded["error"]}), 401

        user_id = decoded.get("sub")
        if not user_id:
            return jsonify({"message": "Payload token non valido"}), 401

        with db.sessione() as session:
            user = session.query(Users).filter(Users._id == user_id).first()
            if not user or not user.enabled:
                return jsonify({"message": "Utente non trovato o disabilitato"}), 401

        # esporre info utili nella request context
        g.current_user_id = user_id
        g.current_username = decoded.get("username")
        g.current_roles = decoded.get("roles", [])

        return f(*args, **kwargs)
    return wrapper

def require_privileges(is_user: bool = False, is_admin: bool = False, is_doctor: bool = False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # richiede autenticazione prima di verificare i privilegi
            token = _get_token_from_cookie()
            if not token:
                return jsonify({"message": "Access token mancante"}), 401

            decoded = _decode_token(token)
            if isinstance(decoded, dict) and decoded.get("error"):
                return jsonify({"message": decoded["error"]}), 401

            user_id = decoded.get("sub")
            if not user_id:
                return jsonify({"message": "Payload token non valido"}), 401

            with db.sessione() as session:
                user_role = session.query(UserRole).filter(UserRole._user_id == user_id).first()
                if not user_role:
                    return jsonify({"message": "Ruoli utente non trovati"}), 403

                if is_admin and not user_role.is_admin:
                    return jsonify({"message": "Privilegi admin richiesti"}), 403
                if is_doctor and not user_role.is_doctor:
                    return jsonify({"message": "Privilegi doctor richiesti"}), 403
                if is_user and not user_role.is_user:
                    return jsonify({"message": "Privilegi user richiesti"}), 403

            # popola g con informazioni utili
            g.current_user_id = user_id
            g.current_username = decoded.get("username")
            g.current_roles = decoded.get("roles", [])

            return f(*args, **kwargs)
        return wrapper
    return decorator