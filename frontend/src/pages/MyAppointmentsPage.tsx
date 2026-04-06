import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "../lib/api";
import { Badge, Button, Card } from "../components/ui";
import { useAuth } from "../lib/auth";

type Appointment = {
  appointment_id: number;
  start_time: string;
  status: string;
  doctor: { doctor_id: number; full_name?: string | null; specialization?: string | null };
};

export function MyAppointmentsPage() {
  const auth = useAuth();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/appointments/me");
      setItems(res.data?.data ?? []);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (!auth.user || auth.user.role !== "PATIENT") {
    return <div className="text-sm text-slate-600">Login as a patient to view this page.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My appointments</h1>
        <div className="text-sm text-slate-600">View and cancel appointments.</div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-900">Appointments</div>
          <Button variant="ghost" onClick={() => load()}>
            Refresh
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="text-sm text-slate-600">Loading…</div>
      ) : err ? (
        <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-slate-600">No appointments yet.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((a) => (
            <Card key={a.appointment_id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {a.doctor.full_name ?? "Doctor"} <span className="text-slate-500">#{a.doctor.doctor_id}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {a.doctor.specialization ?? "—"} • <span className="font-mono">{a.start_time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{a.status}</Badge>
                  <Button
                    variant="ghost"
                    disabled={a.status === "CANCELLED"}
                    onClick={async () => {
                      try {
                        await api.patch(`/appointments/${a.appointment_id}`, { status: "CANCELLED" });
                        await load();
                      } catch (e) {
                        alert(getApiErrorMessage(e));
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

