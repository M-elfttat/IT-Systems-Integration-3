import { useEffect, useState } from "react";
import { DataTable, PageHeader } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminManagePatientsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminService.listPatients().then(setRows).catch(() => setRows([])); }, []);
  return (
    <section>
      <PageHeader title="Manage Patients" subtitle="Registered patient accounts" />
      <DataTable
        columns={["ID", "Name", "Email", "Phone", "Status", "Created"]}
        rows={rows.map((r) => [r.patient_id, r.full_name, r.email, r.phone, r.is_active ? "Active" : "Disabled", new Date(r.created_at).toLocaleString()])}
      />
    </section>
  );
}
