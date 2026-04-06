import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Badge, Button, Card, Input, Label } from "../components/ui";

type Doctor = {
  doctor_id: number;
  full_name: string;
  specialization: string;
  clinic?: string | null;
  is_active: boolean;
};

export function AdminDoctorsPage() {
  const auth = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [fullName, setFullName] = useState("Dr. Demo AdminCreated");
  const [email, setEmail] = useState("new.doctor@sysint.local");
  const [password, setPassword] = useState("Doctor123!");
  const [specialization, setSpecialization] = useState("General");
  const [clinic, setClinic] = useState("Demo Clinic");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data?.data ?? []);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (!auth.user || auth.user.role !== "ADMIN") {
    return <div className="text-sm text-slate-600">Login as an admin to view this page.</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin: Doctors</h1>
          <div className="text-sm text-slate-600">Create doctors and toggle active status.</div>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">Current doctors</div>
            <Button variant="ghost" onClick={() => load()}>
              Refresh
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="text-sm text-slate-600">Loading…</div>
        ) : err ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>
        ) : (
          <div className="grid gap-4">
            {doctors.map((d) => (
              <Card key={d.doctor_id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{d.full_name}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {d.clinic ?? "—"} • {d.specialization}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">ID: {d.doctor_id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{d.is_active ? "ACTIVE" : "INACTIVE"}</Badge>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await api.patch(`/doctors/${d.doctor_id}/status`, { is_active: !d.is_active });
                          await load();
                        } catch (e) {
                          alert(getApiErrorMessage(e));
                        }
                      }}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-900">Create new doctor</div>
            <div className="text-sm text-slate-600">This calls `POST /api/v1/doctors` (admin-only).</div>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setCreating(true);
              try {
                await api.post("/doctors", {
                  full_name: fullName,
                  email,
                  password,
                  specialization,
                  clinic,
                });
                await load();
                alert("Doctor created.");
              } catch (e2) {
                alert(getApiErrorMessage(e2));
              } finally {
                setCreating(false);
              }
            }}
          >
            <div>
              <Label>Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label>Specialization</Label>
              <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </div>
            <div>
              <Label>Clinic</Label>
              <Input value={clinic} onChange={(e) => setClinic(e.target.value)} />
            </div>
            <Button disabled={creating} className="w-full" type="submit">
              {creating ? "Creating…" : "Create doctor"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

