import { useState } from "react";
import { ErrorAlert, FormField, PageHeader, PasswordField } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await register({ ...form, role: "patient" });
      setMsg("Account created. You can login now.");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section>
      <PageHeader title="Register" subtitle="Create a patient account" />
      <form className="card" onSubmit={submit}>
        <ErrorAlert text={error} />
        {msg && <div className="alert success">{msg}</div>}
        <FormField label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <FormField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <PasswordField label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" type="submit">Register</button>
      </form>
    </section>
  );
}
