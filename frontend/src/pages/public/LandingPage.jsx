import { Link } from "react-router-dom";
import { PageHeader, StatsCard } from "../../components/common";

export default function LandingPage() {
  return (
    <section>
      <PageHeader title="Doctor Appointment Booking System" subtitle="Secure booking, payment, and role-based dashboards." />
      <div className="card">
        <p>Trusted platform for patients, doctors, and admins backed by Flask REST API and PostgreSQL.</p>
        <div className="actions">
          <Link className="btn" to="/login">Login</Link>
          <Link className="btn" to="/register">Register</Link>
          <Link className="btn" to="/doctors">Available Doctors</Link>
        </div>
      </div>
      <div className="grid3">
        <StatsCard label="Patients" value="Fast booking flow" />
        <StatsCard label="Doctors" value="Schedule management" />
        <StatsCard label="Admins" value="System control panel" />
      </div>
    </section>
  );
}
