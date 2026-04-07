import { useEffect, useState } from "react";
import { PageHeader, StatsCard } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminDashboardPage() {
  const [d, setD] = useState(null);
  useEffect(() => { adminService.dashboard().then(setD).catch(() => setD(null)); }, []);
  return (
    <section>
      <PageHeader title="Admin Dashboard" subtitle="System stats and activity overview" />
      {d && <div className="grid3">
        <StatsCard label="Patients" value={d.total_patients} />
        <StatsCard label="Doctors" value={d.total_doctors} />
        <StatsCard label="Appointments" value={d.total_appointments} />
      </div>}
    </section>
  );
}
