import { useEffect, useState } from "react";
import { ErrorAlert, FormField, PageHeader, PasswordField } from "../../components/common";
import { patientService } from "../../services/patientService";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    patientService.profile()
      .then((data) => {
        setProfile(data);
        setForm({ full_name: data.full_name || "", email: data.email || "", phone: data.phone || "" });
      })
      .catch(() => setProfile(null));
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    setError("");
    setMsg("Profile changes are captured in the UI. Connect this form to your profile update endpoint to persist.");
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setError("");
    if (!passwordForm.current_password || !passwordForm.new_password) {
      setError("Enter current and new password.");
      return;
    }
    setMsg("Password change form is ready. Connect to your backend change-password endpoint.");
  };

  return (
    <section>
      <PageHeader title="Patient Profile" subtitle="Personal information and account settings" />
      <ErrorAlert text={error} />
      {msg && <div className="alert success">{msg}</div>}
      <form className="card" onSubmit={saveProfile}>
        <h3>Personal Information</h3>
        <FormField label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <FormField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn" type="submit">Save Profile</button>
      </form>
      <form className="card" onSubmit={updatePassword}>
        <h3>Change Password</h3>
        <PasswordField label="Current Password" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} />
        <PasswordField label="New Password" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
        <button className="btn" type="submit">Update Password</button>
      </form>
      {profile && <div className="card"><small>Role: {profile.role}</small></div>}
    </section>
  );
}
