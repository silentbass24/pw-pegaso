from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class CreaAnamnesiFamiliareDTO(Schema):
    id_paziente = fields.UUID(required=True, isUUID=True)
    malattie_ereditarie = fields.Str(required=True, validate=validate_note)
    note_ambientali = fields.Str(required=True, validate=validate_note)
    id_paziente = fields.UUID(required=True, isUUID=True)
    

class AggiornaAnamnesiFamiliareDTO(Schema):
    
    malattie_ereditarie = fields.Str(validate=validate_note)
    note_ambientali = fields.Str(validate=validate_note)

class AnamnesiFamiliareResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    malattie_ereditarie = fields.Str(dump_only=True)
    note_ambientali = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)