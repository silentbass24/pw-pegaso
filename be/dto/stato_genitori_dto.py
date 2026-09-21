from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class StatoGenitoriDTO(Schema):
    id = fields.UUID(required=True, isUUID=True)
    padre = fields.Str(required=False, validate=validate_note)
    madre = fields.Str(required=False, validate=validate_note)
    id_anamnesi_familiare = fields.Str(required=True, isUUID=True)
    

class AggiornaStatoGenitoriDTO(Schema):
    padre = fields.Str(validate=validate_note)
    madre = fields.Str(validate=validate_note)
    id_anamnesi_familiare = fields.Str(validate=validate_note)

class StatoGenitoriResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    padre = fields.Str(dump_only=True)
    madre = fields.Str(dump_only=True)
    id_anamnesi_familiare = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)