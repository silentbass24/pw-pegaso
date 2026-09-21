from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class RefreshTokenDTO(Schema):
    id = fields.UUID(required=True, isUUID=True)
    user_id = fields.UUID(required=True, isUUID=True)
    token = fields.Str(required=True)
    expiry = fields.DateTime(required=True)


class AggiornaRefreshTokenDTO(Schema):
    user_id = fields.UUID(validate=validate_note)
    token = fields.Str(validate=validate_note)
    expiry = fields.DateTime(validate=validate_note)

class RefreshTokenResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(dump_only=True)
    token = fields.Str(dump_only=True)
    expiry = fields.DateTime(dump_only=True)
    created_at = fields.DateTime(dump_only=True)