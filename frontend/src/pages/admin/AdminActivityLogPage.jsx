import { useEffect, useState } from "react";
import { DataTable, PageHeader } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminActivityLogPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminService.activity().then(setRows).catch(() => setRows([])); }, []);
  return (
    <section>
      <PageHeader title="Activity Log" subtitle="Audit trail of system actions" />
      <DataTable
        columns={["Time", "Actor", "Action", "Entity", "Details"]}
        rows={rows.map((r) => [new Date(r.created_at).toLocaleString(), r.actor_name || r.actor_user_id, r.action, `${r.entity_type}#${r.entity_id || "-"}`, r.details || "-"])}
      />
    </section>
  );
}
