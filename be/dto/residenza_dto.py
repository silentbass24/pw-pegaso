from marshmallow import Schema, fields, validates, validate
from be.core.validator import (
    validate_indirizzo,
    validate_civico,
)

class CreaResidenzaDTO(Schema):
    id_paziente = fields.UUID(required=True)
    indirizzo = fields.Str(required=True, validate=validate_indirizzo)
    numero_civico = fields.Str(required=True, validate=validate_civico)
    cap = fields.Str(required=True, validate=validate.Length(equal=5))
    citta = fields.Str(required=True, validate=validate_indirizzo)
    

class AggiornaResidenzaDTO(Schema):
    
    indirizzo = fields.Str(validate=validate_indirizzo)
    numero_civico = fields.Str(validate=validate_civico)
    cap = fields.Str(validate=validate.Length(equal=5))
    citta = fields.Str(validate=validate_indirizzo)
  
        
class ResidenzaResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    indirizzo = fields.Str(dump_only=True)
    numero_civico = fields.Str(dump_only=True)
    citta = fields.Str(dump_only=True)
    cap = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)