import { useEffect, useState } from "react";
import { DataTable, ErrorAlert, PageHeader } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminManageAppointmentsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const load = () => {
    adminService.listAppointments(status || undefined).then(setRows).catch((e) => setError(e?.response?.data?.message || "Failed to load appointments"));
  };

  useEffect(() => { load(); }, [status]);

  const updateStatus = async (id, nextStatus) => {
    await adminService.updateAppointment(id, { status: nextStatus });
    load();
  };

  return (
    <section>
      <PageHeader title="Manage Appointments" subtitle="Review and update appointment statuses" />
      <div className="card">
        <label>
          Status Filter
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      <ErrorAlert text={error} />
      <DataTable
        columns={["ID", "Patient", "Doctor", "Date", "Status", "Actions"]}
        rows={rows.map((r) => [
          r.appointment_id,
          r.patient_name,
          r.doctor_name,
          `${r.date} ${r.time}`,
          r.status,
          <div className="actions compact" key={`a-${r.appointment_id}`}>
            <button onClick={() => updateStatus(r.appointment_id, "approved")}>Approve</button>
            <button onClick={() => updateStatus(r.appointment_id, "completed")}>Complete</button>
            <button onClick={() => updateStatus(r.appointment_id, "cancelled")}>Cancel</button>
          </div>,
        ])}
      />
    </section>
  );
}
