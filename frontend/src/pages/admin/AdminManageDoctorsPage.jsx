import { useState } from "react";
import { ErrorAlert, FormField, PageHeader } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminManageDoctorsPage() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience_years: "",
    clinic_name: "",
    consultation_fee: "",
    availability_note: "",
    bio: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const payload = {
        ...form,
        experience_years: Number(form.experience_years),
        consultation_fee: Number(form.consultation_fee),
      };
      const data = await adminService.addDoctor(payload);
      setMsg(`Doctor created with ID #${data.doctor_id}.`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add doctor.");
    }
  };

  return (
    <section>
      <PageHeader title="Manage Doctors" subtitle="Create doctor records with specialization and clinic details" />
      <form className="card" onSubmit={submit}>
        <ErrorAlert text={error} />
        {msg && <div className="alert success">{msg}</div>}
        <FormField label="Doctor Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <FormField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <FormField label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        <FormField label="Experience (years)" type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
        <FormField label="Clinic Name" value={form.clinic_name} onChange={(e) => setForm({ ...form, clinic_name: e.target.value })} />
        <FormField label="Consultation Fee" type="number" value={form.consultation_fee} onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })} />
        <FormField label="Availability" value={form.availability_note} onChange={(e) => setForm({ ...form, availability_note: e.target.value })} />
        <label>Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label>
        <button className="btn" type="submit">Add Doctor</button>
      </form>
    </section>
  );
}
