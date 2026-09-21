from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class CreaUsersDTO(Schema):
    username = fields.Str(required=True, validate=validate_note)
    password = fields.Str(required=True)
    enabled = fields.Bool(required=True)
    

class AggiornaUsersDTO(Schema):
    username = fields.Str(validate=validate_note)
    password = fields.Str(validate=validate_note)
    enabled = fields.Bool()

class UsersResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    username = fields.Str(dump_only=True)
    enabled = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)