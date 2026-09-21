from marshmallow import Schema, fields, validates, validate

class CreaAppuntamentoDTO(Schema):
    id_medico = fields.Str(required=True, isUUID=True)
    id_paziente = fields.Str(required=True, isUUID=True)
    id_slot = fields.Str(required=True, isUUID=True)
    data = fields.Date(required=True)

class AggiornaAppuntamentoDTO(Schema):
    id_slot = fields.Str(isUUID=True)
    id_medico = fields.Str(isUUID=True)
    id_paziente = fields.Str(isUUID=True)
    data = fields.Date()
    
class AppuntamentoResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    id_medico = fields.Str(dump_only=True)
    id_paziente = fields.Str(dump_only=True)
    id_slot = fields.Str(dump_only=True)
    data = fields.Date(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
class AppuntamentoConDettagliResponseDTO(Schema):
    id = fields.UUID(dump_only=True, attribute="id_appuntamento")
    id_medico = fields.Str(dump_only=True)
    nome_medico = fields.Str(dump_only=True)
    cognome_medico = fields.Str(dump_only=True)
    id_paziente = fields.Str(dump_only=True)
    nome_paziente = fields.Str(dump_only=True)
    cognome_paziente = fields.Str(dump_only=True)
    id_slot = fields.Str(dump_only=True)
    ora_inizio = fields.Str(dump_only=True)
    ora_fine = fields.Str(dump_only=True)
    data = fields.Date(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)