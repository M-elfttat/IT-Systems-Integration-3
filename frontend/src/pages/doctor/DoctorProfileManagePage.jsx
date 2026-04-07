import { useEffect, useState } from "react";
import { ErrorAlert, PageHeader } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { doctorService } from "../../services/doctorService";

export default function DoctorProfileManagePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    doctorService.detail(user.id).then(setProfile).catch((err) => setError(err?.response?.data?.message || "Profile not found."));
  }, [user?.id]);

  return (
    <section>
      <PageHeader title="Doctor Profile" subtitle="Profile is managed by admin" />
      <ErrorAlert text={error} />
      {profile && (
        <div className="card">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Clinic:</strong> {profile.clinic_name}</p>
          <p><strong>Experience:</strong> {profile.experience_years} years</p>
          <p><strong>Fee:</strong> ${profile.consultation_fee}</p>
          <p><strong>Availability:</strong> {profile.availability_note || "-"}</p>
          <p><strong>Bio:</strong> {profile.bio || "-"}</p>
        </div>
      )}
      <div className="card">Need profile changes? Contact an admin.</div>
    </section>
  );
}
