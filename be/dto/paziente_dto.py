from marshmallow import Schema, fields, validates
from be.core.validator import (
    validate_nome,
    validate_cognome,
    validate_codice_fiscale,
    validate_data
)

class CreaPazienteDTO(Schema):
    nome = fields.Str(required=True, validate=validate_nome)
    cognome = fields.Str(required=True, validate=validate_cognome)
    data_nascita = fields.Str(required=True, validate=validate_data)
    codice_fiscale = fields.Str(required=True, validate=validate_codice_fiscale)

class AggiornaPazienteDTO(Schema):
    nome = fields.Str(validate=validate_nome)
    cognome = fields.Str(validate=validate_cognome)
    data_nascita = fields.Str(validate=validate_data)
    codice_fiscale = fields.Str(validate=validate_codice_fiscale)

class PazienteResponseDTO(Schema):
    id = fields.UUID(dump_only=True, attribute="_id")
    nome = fields.Str(dump_only=True)
    cognome = fields.Str(dump_only=True)
    data_nascita = fields.Str(dump_only=True)
    codice_fiscale = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)