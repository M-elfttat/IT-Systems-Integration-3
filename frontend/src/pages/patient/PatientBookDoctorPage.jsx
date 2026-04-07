import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorAlert, LoadingSpinner, PageHeader } from "../../components/common";
import { doctorService } from "../../services/doctorService";

export default function PatientBookDoctorPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.list()
      .then(setRows)
      .catch((e) => setError(e?.response?.data?.message || "Failed to load doctors"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <PageHeader title="Book Appointment" subtitle="Choose a doctor from your patient portal" />
      <ErrorAlert text={error} />
      {loading ? (
        <LoadingSpinner />
      ) : !rows.length ? (
        <EmptyState text="No doctors available currently." />
      ) : (
        <div className="grid3">
          {rows.map((doctor) => (
            <div className="card" key={doctor.doctor_id}>
              <h3>{doctor.full_name}</h3>
              <p><strong>{doctor.specialization}</strong></p>
              <p>{doctor.clinic_name}</p>
              <p>Fee: ${doctor.consultation_fee}</p>
              <Link className="btn" to={`/patient/book/${doctor.doctor_id}`}>Continue Booking</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
