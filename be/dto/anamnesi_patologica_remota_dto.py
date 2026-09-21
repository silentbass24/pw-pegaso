from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class CreaAnamnesiPatologicaRemotaDTO(Schema):
    id_paziente = fields.UUID(required=True, isUUID=True)
    malattie_pregresse = fields.Str(required=False, validate=validate_note)
    interventi_chirurgici = fields.Str(required=False, validate=validate_note)
    ricoveri = fields.Str(required=False, validate=validate_note)
    traumi = fields.Str(required=False, validate=validate_note)
    

class AggiornaAnamnesiPatologicaRemotaDTO(Schema):
    malattie_pregresse = fields.Str(validate=validate_note)
    interventi_chirurgici = fields.Str(validate=validate_note)
    ricoveri = fields.Str(validate=validate_note)
    traumi = fields.Str(validate=validate_note)

class AnamnesiPatologicaRemotaResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    malattie_pregresse = fields.Str(dump_only=True)
    interventi_chirurgici = fields.Str(dump_only=True)
    ricoveri = fields.Str(dump_only=True)
    traumi = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)