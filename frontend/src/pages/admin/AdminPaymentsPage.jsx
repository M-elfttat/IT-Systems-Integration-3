import { useEffect, useState } from "react";
import { DataTable, PageHeader } from "../../components/common";
import { adminService } from "../../services/adminService";

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminService.listPayments().then(setRows).catch(() => setRows([])); }, []);
  return (
    <section>
      <PageHeader title="Payments" subtitle="Track transactions and payment statuses" />
      <DataTable
        columns={["Payment ID", "Patient", "Doctor", "Amount", "Method", "Status", "Reference"]}
        rows={rows.map((r) => [r.payment_id, r.patient_name, r.doctor_name, `$${r.amount}`, r.method, r.status, r.transaction_ref || "-"])}
      />
    </section>
  );
}
