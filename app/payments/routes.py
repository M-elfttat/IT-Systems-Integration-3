import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import ActivityLog, Appointment, Payment
from app.utils import role_required

payments_bp = Blueprint("payments", __name__)


@payments_bp.post("")
@role_required("patient", "admin")
def make_payment():
    data = request.get_json() or {}
    appointment_id = data.get("appointment_id")
    method = data.get("method")
    amount = data.get("amount")
    if not appointment_id or not method or amount is None:
        return jsonify({"message": "appointment_id, method and amount are required"}), 400

    appointment = Appointment.query.get_or_404(appointment_id)
    current_user_id = int(get_jwt_identity())
    if appointment.patient_id != current_user_id:
        return jsonify({"message": "You can only pay for your own appointment"}), 403

    payment = Payment.query.filter_by(appointment_id=appointment_id).first()
    if payment is None:
        payment = Payment(appointment_id=appointment_id, amount=amount, method=method, status="paid")
        db.session.add(payment)
    else:
        payment.amount = amount
        payment.method = method
        payment.status = "paid"

    payment.transaction_ref = f"TXN-{uuid.uuid4().hex[:12].upper()}"
    db.session.flush()
    db.session.add(
        ActivityLog(
            actor_user_id=current_user_id,
            action="make_payment",
            entity_type="payment",
            entity_id=str(payment.id),
            details=f"Paid for Dr. {appointment.doctor.full_name}, amount={amount}, method={method}",
        )
    )
    db.session.commit()
    return jsonify({"message": "Payment successful", "transaction_ref": payment.transaction_ref}), 201


@payments_bp.get("/<int:appointment_id>")
@role_required("patient", "doctor", "admin")
def get_payment(appointment_id):
    payment = Payment.query.filter_by(appointment_id=appointment_id).first()
    if payment is None:
        return jsonify({"message": "No payment found"}), 404

    return jsonify(
        {
            "payment_id": payment.id,
            "appointment_id": payment.appointment_id,
            "amount": float(payment.amount),
            "method": payment.method,
            "status": payment.status,
            "transaction_ref": payment.transaction_ref,
        }
    )
