from marshmallow import Schema, fields

class RuoliDTO(Schema):
    user_id = fields.UUID(required=True)
    is_admin = fields.Bool(required=True)
    is_doctor = fields.Bool(required=True)
    is_user = fields.Bool(required=True)

class AggiornaRuoliDTO(Schema):
    is_admin = fields.Bool()
    is_doctor = fields.Bool()
    is_user = fields.Bool()

class RuoliResponseDTO(Schema):
    user_id = fields.UUID(dump_only=True)
    is_admin = fields.Bool(dump_only=True)
    is_doctor = fields.Bool(dump_only=True)
    is_user = fields.Bool(dump_only=True)