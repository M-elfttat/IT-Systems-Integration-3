from marshmallow import Schema, ValidationError, fields, validate, validates
from datetime import date


class RegisterSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=3, max=120))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=7, max=30))
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class DoctorSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=3, max=120))
    specialization = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    availability = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=7, max=30))


class AppointmentSchema(Schema):
    doctor_id = fields.Int(required=True)
    appointment_date = fields.Date(required=True)
    appointment_time = fields.Time(required=True, format="%H:%M")
    notes = fields.Str(load_default="", validate=validate.Length(max=500))

    @validates("appointment_date")
    def validate_future(self, value, **kwargs):
        if value < date.today():
            raise ValidationError("Appointment date cannot be in the past.")


class AppointmentStatusSchema(Schema):
    status = fields.Str(required=True, validate=validate.OneOf(["Booked", "Completed", "Cancelled"]))
