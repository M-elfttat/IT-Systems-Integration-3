import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, FormField, PageHeader, PasswordField } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required.");
    try {
      const user = await login(form);
      if (user.role === "doctor") {
        logout();
        setError("Doctor login is disabled from this portal. Please contact admin.");
        return;
      }
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section>
      <PageHeader title="Login" subtitle="Secure sign-in with token authentication" />
      <form className="card" onSubmit={onSubmit}>
        <ErrorAlert text={error} />
        <FormField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordField label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" type="submit">Login</button>
      </form>
    </section>
  );
}
