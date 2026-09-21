from marshmallow import Schema, fields, validates
from be.core.validator import (
    validate_nome,
    validate_cognome,
    validate_note
)

class CreaMedicoDTO(Schema):
    nome = fields.Str(required=True, validate=validate_nome)
    cognome = fields.Str(required=True, validate=validate_cognome)
    specializzazione = fields.Str(required=True, validate=validate_note)
        

class AggiornaMedicoDTO(Schema):
    nome = fields.Str(validate=validate_nome)
    cognome = fields.Str(validate=validate_cognome)
    specializzazione = fields.Str(validate=validate_note)
        
class MedicoResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    nome = fields.Str(dump_only=True)
    cognome = fields.Str(dump_only=True)
    specializzazione = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)