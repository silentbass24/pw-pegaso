from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class StatoFratelliDTO(Schema):
    id = fields.UUID(required=True, isUUID=True)
    nome = fields.Str(required=False, validate=validate_note)
    stato = fields.Str(required=False, validate=validate_note)
    id_anamnesi_familiare = fields.Str(required=True, isUUID=True)
    

class AggiornaStatoFratelliDTO(Schema):
    nome = fields.Str(validate=validate_note)
    stato = fields.Str(validate=validate_note)
    id_anamnesi_familiare = fields.Str(validate=validate_note)

class StatoFratelliResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    nome = fields.Str(dump_only=True)
    stato = fields.Str(dump_only=True)
    id_anamnesi_familiare = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)