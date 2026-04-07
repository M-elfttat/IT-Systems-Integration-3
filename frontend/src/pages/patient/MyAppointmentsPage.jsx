import { useEffect, useState } from "react";
import { AppointmentCard, PageHeader, SearchBar } from "../../components/common";
import { appointmentService } from "../../services/appointmentService";

export default function MyAppointmentsPage() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState([]);
  useEffect(() => { appointmentService.listMine(status).then(setRows).catch(() => setRows([])); }, [status]);
  return (
    <section>
      <PageHeader title="My Appointments" subtitle="Upcoming, completed, cancelled, pending" />
      <div className="card"><SearchBar value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Type status filter..." /></div>
      <div className="grid3">{rows.map((a) => <AppointmentCard key={a.appointment_id} appointment={a} />)}</div>
    </section>
  );
}
