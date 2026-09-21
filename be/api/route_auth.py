from flask import Blueprint, request, make_response, jsonify
import be.core.config as config
from be.services.auth_service import authenticate_user, refresh_access_token, revoke_refresh_token

api = Blueprint("auth_api", __name__, url_prefix="/api/auth")

def _secure_flag():
    return not (config.IS_DEBUG in ["True", "true", True])

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"message": "username e password richiesti"}), 400

    auth = authenticate_user(username, password)
    if not auth:
        return jsonify({"message": "Credenziali non valide"}), 401

    resp = make_response({"message": "Login ok", "roles": auth["roles"]})
    resp.set_cookie("access_token", auth["access_token"],
                    httponly=True, secure=_secure_flag(), samesite="Lax",
                    expires=auth["access_expiry"])
    resp.set_cookie("refresh_token", auth["refresh_token"],
                    httponly=True, secure=_secure_flag(), samesite="Lax",
                    expires=auth["refresh_expiry"])
    return resp

@api.route("/refresh", methods=["POST"])
def refresh():
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return jsonify({"message": "Refresh token mancante"}), 401
    new = refresh_access_token(refresh_token)
    if not new:
        return jsonify({"message": "Refresh token non valido o scaduto"}), 401
    resp = make_response({"message": "Token rinnovato", "roles": new["roles"]})
    resp.set_cookie("access_token", new["access_token"],
                    httponly=True, secure=_secure_flag(), samesite="Lax",
                    expires=new["access_expiry"])
    return resp

@api.route("/logout", methods=["POST"])
def logout():
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        revoke_refresh_token(refresh_token)
    resp = make_response({"message": "Logout eseguito"})
    resp.set_cookie("access_token", "", expires=0)
    resp.set_cookie("refresh_token", "", expires=0)
    return resp