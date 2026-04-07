import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert, LoadingSpinner, PageHeader } from "../../components/common";
import { doctorService } from "../../services/doctorService";

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    doctorService.detail(doctorId).then(setDoctor).catch((e) => setError(e?.response?.data?.message || "Failed"));
  }, [doctorId]);
  if (error) return <ErrorAlert text={error} />;
  if (!doctor) return <LoadingSpinner />;
  return (
    <section>
      <PageHeader title={doctor.full_name} subtitle={doctor.specialization} />
      <div className="card">
        <p><strong>Clinic:</strong> {doctor.clinic_name}</p>
        <p><strong>Fee:</strong> ${doctor.consultation_fee}</p>
        <p><strong>Availability:</strong> {doctor.availability_note || "Contact clinic"}</p>
        <p>{doctor.bio}</p>
        <div className="alert success">To book this doctor, login as a patient and use the patient booking section.</div>
      </div>
    </section>
  );
}
