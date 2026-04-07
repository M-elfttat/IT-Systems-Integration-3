import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, PageHeader, StatsCard } from "../../components/common";
import { patientService } from "../../services/patientService";

export default function PatientDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    patientService.dashboard().then(setData).catch((e) => setError(e?.response?.data?.message || "Failed to load dashboard"));
  }, []);
  return (
    <section>
      <PageHeader title="Patient Dashboard" subtitle="Upcoming appointments and quick actions" />
      <ErrorAlert text={error} />
      {data && <div className="grid3">
        <StatsCard label="Upcoming" value={data.upcoming_count} />
        <StatsCard label="Completed" value={data.completed_count} />
        <StatsCard label="Cancelled" value={data.cancelled_count} />
      </div>}
      <div className="actions">
        <Link className="btn" to="/patient/book">Book New Appointment</Link>
        <Link className="btn" to="/patient/appointments">View My Appointments</Link>
      </div>
    </section>
  );
}
