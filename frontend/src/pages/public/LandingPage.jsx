import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common";

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
      <div className="grid3 feature-grid">
        <div className="card feature-card">
          <h3>Is this doctor right for me?</h3>
          <p>Filter by specialty, location, language, and insurance before you book.</p>
        </div>
        <div className="card feature-card">
          <h3>What will this cost me?</h3>
          <p>See consultation fees upfront and pay securely online with no surprise bills.</p>
        </div>
        <div className="card feature-card">
          <h3>What if I need to cancel?</h3>
          <p>Reschedule or cancel up to 2 hours before your visit with no penalty and no calls.</p>
        </div>
      </div>
    </section>
  );
}
