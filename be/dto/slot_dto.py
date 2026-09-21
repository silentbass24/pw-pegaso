from marshmallow import Schema, fields, validates, validate

class CreaSlotDTO(Schema):
    ora_inizio = fields.Str(required=True,  validate=validate.Length(max=5))
    ora_fine = fields.Str(required=True, validate=validate.Length(max=5))

class AggiornaSlotDTO(Schema):
    ora_inizio = fields.Str(validate=validate.Length(max=5))
    ora_fine = fields.Str(validate=validate.Length(max=5))

class SlotResponseDTO(Schema):
    id = fields.UUID(dump_only=True)
    ora_inizio = fields.Str(dump_only=True)
    ora_fine = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)