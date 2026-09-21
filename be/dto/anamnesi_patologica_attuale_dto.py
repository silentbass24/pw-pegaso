from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_note
)

class CreaAnamnesiPatologicaAttualeDTO(Schema):
    id_paziente = fields.UUID(required=True, isUUID=True)
    sintomatologia_principale = fields.Str(required=False, validate=validate_note)
    insorgenza = fields.Date(required=False, format="%d-%m-%Y")
    durata = fields.Str(required=False, validate=validate_note)
    fattori_miglioramento = fields.Str(required=False, validate=validate_note)
    fattori_peggioramento = fields.Str(required=False, validate=validate_note)
    sintomi_associati = fields.Str(required=False, validate=validate_note)
    

class AggiornaAnamnesiPatologicaAttualeDTO(Schema):
    sintomatologia_principale = fields.Str(validate=validate_note)
    insorgenza = fields.Date(format="%d-%m-%Y")
    durata = fields.Str(validate=validate_note)
    fattori_miglioramento = fields.Str(validate=validate_note)
    fattori_peggioramento = fields.Str(validate=validate_note)
    sintomi_associati = fields.Str(validate=validate_note)

class AnamnesiPatologicaAttualeResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    sintomatologia_principale = fields.Str(dump_only=True)
    insorgenza = fields.Date(dump_only=True)
    durata = fields.Str(dump_only=True)
    fattori_miglioramento = fields.Str(dump_only=True)
    fattori_peggioramento = fields.Str(dump_only=True)
    sintomi_associati = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)