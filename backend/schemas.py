from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))
    phone = fields.Str(required=True, validate=validate.Length(min=7, max=25))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))


class DoctorSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    specialization = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    availability = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=7, max=25))


class AppointmentSchema(Schema):
    doctor_id = fields.Int(required=True)
    appointment_date = fields.Date(required=True)
    appointment_time = fields.Time(required=True)
    notes = fields.Str(load_default="")


class AppointmentStatusSchema(Schema):
    status = fields.Str(required=True, validate=validate.OneOf(["Booked", "Completed", "Cancelled"]))
