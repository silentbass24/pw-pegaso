from marshmallow import Schema, fields, validates


class CreaContattiDTO(Schema):
    id_paziente = fields.UUID(required=True)
    email = fields.Str(required=True, email=True)
    telefono = fields.Str(required=True)
    mobile = fields.Str(required=True)
    

class AggiornaContattiDTO(Schema):
    email = fields.Str(email=True)
    telefono = fields.Str()
    mobile = fields.Str()
    
        
  
        
class ContattiResponseDTO(Schema):
    id_paziente = fields.UUID(dump_only=True)
    email = fields.Str(dump_only=True)
    telefono = fields.Str(dump_only=True)
    mobile = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)