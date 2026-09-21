from datetime import datetime
from be.core.database import Database
from be.models.users_model import Users
from be.models.refresh_tokens_model import RefreshTokens
from be.core.auth_utils import verifica_password, genera_access_token, genera_refresh_token
from be.models.user_roles_model import UserRole

db = Database()

def authenticate_user(username: str, password: str):
    with db.sessione() as session:
        user = session.query(Users).filter(Users._username == username).first()
        if not user or not user.enabled:
            return None
        if not verifica_password(password, user.password):
            return None
        roles = []
        user_role = session.query(UserRole).filter(UserRole._user_id == user.id).first()
        if user_role:
            if user_role.is_admin:
                roles.append("admin")
            if user_role.is_doctor:
                roles.append("doctor")
            if user_role.is_user:
                roles.append("user")
        if not roles:
            roles.append("user")  # Default role if none are set
        access_token, access_expiry = genera_access_token(user.id, user.username, roles)
        refresh_token, refresh_expiry = genera_refresh_token()

        rt = RefreshTokens()
        rt.user_id = user.id
        rt.token = refresh_token
        rt.expiry = refresh_expiry
        session.add(rt)

        return {
            "user_id": user.id,
            "username": user.username,
            "roles": roles,
            "access_token": access_token,
            "access_expiry": access_expiry,
            "refresh_token": refresh_token,
            "refresh_expiry": refresh_expiry
        }

def refresh_access_token(refresh_token: str):
    with db.sessione() as session:
        rt = session.query(RefreshTokens).filter(RefreshTokens._token == refresh_token).first()
        if not rt or rt.expiry < datetime.utcnow():
            return None
        user = session.query(Users).filter(Users._id == rt.user_id).first()
        if not user or not user.enabled:
            return None
        roles = []
        user_role = session.query(UserRole).filter(UserRole._user_id == user.id).first()
        if user_role:
            if user_role.is_admin:
                roles.append("admin")
            if user_role.is_doctor:
                roles.append("doctor")
            if user_role.is_user:
                roles.append("user")
        if not roles:
            roles.append("user")  # Default role if none are set
        access_token, access_expiry = genera_access_token(user.id, user.username, roles)
        return {"access_token": access_token, "access_expiry": access_expiry, "roles": roles}

def revoke_refresh_token(refresh_token: str):
    with db.sessione() as session:
        session.query(RefreshTokens).filter(RefreshTokens._token == refresh_token).delete()