from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class CreaAnalisiPsicoSocialeDTO(Schema):
    id_paziente = fields.UUID(required=True, isUUID=True)
    lavoro = fields.Str(required=True, validate=validate_note)
    stress = fields.Str(required=True, validate=validate_note)
    supporto_familiare = fields.Str(required=True, validate=validate_note)
    condizioni_abitative = fields.Str(required=True, validate=validate_note)
    

class AggiornaAnalisiPsicoSocialeDTO(Schema):
    
    lavoro = fields.Str(validate=validate_note)
    stress = fields.Str(validate=validate_note)
    supporto_familiare = fields.Str(validate=validate_note)
    condizioni_abitative = fields.Str(validate=validate_note)

class AnalisiPsicoSocialeResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    lavoro = fields.Str(dump_only=True)
    stress = fields.Str(dump_only=True)
    supporto_familiare = fields.Str(dump_only=True)
    condizioni_abitative = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)