import { useEffect, useState } from "react";
import { DataTable, PageHeader } from "../../components/common";
import { doctorService } from "../../services/doctorService";

export default function DoctorAppointmentsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { doctorService.myAppointments().then(setRows).catch(() => setRows([])); }, []);
  return (
    <section>
      <PageHeader title="Doctor Appointments" subtitle="Your appointment schedule" />
      <DataTable
        columns={["Appointment", "Patient", "Date", "Status", "Notes"]}
        rows={rows.map((r) => [r.appointment_id, r.patient_name, `${r.date} ${r.time}`, r.status, r.symptoms_notes || "-"])}
      />
    </section>
  );
}
