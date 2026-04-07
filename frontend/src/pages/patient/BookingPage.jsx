import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorAlert, PageHeader } from "../../components/common";
import { appointmentService } from "../../services/appointmentService";
import { notificationsStorage } from "../../utils/notificationsStorage";

export default function BookingPage() {
  const { doctorId } = useParams();
  const [form, setForm] = useState({ appointment_date: "", appointment_time: "", symptoms_notes: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const data = await appointmentService.create({ ...form, doctor_id: Number(doctorId) });
      setMsg(`Appointment #${data.appointment_id} created.`);
      notificationsStorage.add({
        id: `${Date.now()}`,
        type: "appointment",
        title: "Appointment booked successfully",
        message: `Your appointment #${data.appointment_id} has been created and is pending confirmation.`,
        created_at: new Date().toISOString(),
      });
    } catch (err) { setError(err?.response?.data?.message || "Booking failed"); }
  };
  return (
    <section>
      <PageHeader title="Book Appointment" subtitle={`Doctor ID: ${doctorId}`} />
      <form className="card" onSubmit={submit}>
        <ErrorAlert text={error} />
        {msg && <div className="alert success">{msg}</div>}
        <label>Date<input type="date" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} /></label>
        <label>Time<input type="time" value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} /></label>
        <label>Symptoms / Notes<textarea value={form.symptoms_notes} onChange={(e) => setForm({ ...form, symptoms_notes: e.target.value })} /></label>
        <button className="btn" type="submit">Confirm Booking</button>
        <Link className="btn" to="/patient/notifications">View Notifications</Link>
      </form>
    </section>
  );
}
