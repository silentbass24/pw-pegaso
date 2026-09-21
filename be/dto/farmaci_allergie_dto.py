from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class FarmaciAllergieDTO(Schema):
    id_paziente = fields.UUID(required=True, isUUID=True)
    terapie_in_corso = fields.Str(required=False, validate=validate_note)
    farmaci_passati = fields.Str(required=False, validate=validate_note)
    allergie = fields.Str(required=False, validate=validate_note)
    

class AggiornaFarmaciAllergieDTO(Schema):
    terapie_in_corso = fields.Str(validate=validate_note)
    farmaci_passati = fields.Str(validate=validate_note)
    allergie = fields.Str(validate=validate_note)

class FarmaciAllergieResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    terapie_in_corso = fields.Str(dump_only=True)
    farmaci_passati = fields.Str(dump_only=True)
    allergie = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)