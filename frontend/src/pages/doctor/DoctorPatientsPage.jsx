import { useEffect, useState } from "react";
import { DataTable, PageHeader } from "../../components/common";
import { doctorService } from "../../services/doctorService";

export default function DoctorPatientsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { doctorService.myPatients().then(setRows).catch(() => setRows([])); }, []);
  return (
    <section>
      <PageHeader title="Doctor Patients" subtitle="Patients assigned through appointments" />
      <DataTable
        columns={["Patient ID", "Name", "Email", "Phone"]}
        rows={rows.map((r) => [r.patient_id, r.full_name, r.email, r.phone])}
      />
    </section>
  );
}
