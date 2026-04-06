import { useEffect, useMemo, useState } from "react";
import { api, getApiErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Badge, Button, Card, Input, Label } from "../components/ui";

type Doctor = {
  doctor_id: number;
  full_name: string;
  specialization: string;
  clinic?: string | null;
};

function isoInOneHour() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 19);
}

export function DoctorsPage() {
  const auth = useAuth();
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [startTime, setStartTime] = useState(isoInOneHour());
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [bookingErr, setBookingErr] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (specialization.trim()) q.set("specialization", specialization.trim());
    return q.toString();
  }, [specialization]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get(`/doctors${query ? `?${query}` : ""}`);
      setDoctors(res.data?.data ?? []);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Doctors</h1>
            <div className="text-sm text-slate-600">Browse and book an appointment.</div>
          </div>
        </div>

        <Card>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label>Filter by specialization</Label>
              <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Cardiology" />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="ghost" className="w-full" onClick={() => load()}>
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-sm text-slate-600">Loading doctors…</div>
        ) : err ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>
        ) : doctors.length === 0 ? (
          <div className="text-sm text-slate-600">No doctors found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {doctors.map((d) => (
              <button
                key={d.doctor_id}
                onClick={() => {
                  setSelectedDoctor(d);
                  setBookingMsg(null);
                  setBookingErr(null);
                }}
                className={[
                  "text-left rounded-2xl border p-5 transition",
                  selectedDoctor?.doctor_id === d.doctor_id ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{d.full_name}</div>
                    <div className="mt-1 text-sm text-slate-600">{d.clinic ?? "—"}</div>
                  </div>
                  <Badge>{d.specialization}</Badge>
                </div>
                <div className="mt-3 text-xs text-slate-500">ID: {d.doctor_id}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">Book appointment</div>
            <div className="text-sm text-slate-600">
              {auth.user?.role === "PATIENT"
                ? "Select a doctor, choose a datetime, and confirm."
                : "Login as a PATIENT to book."}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label>Selected doctor</Label>
              <div className="text-sm text-slate-800">
                {selectedDoctor ? (
                  <>
                    <div className="font-medium">{selectedDoctor.full_name}</div>
                    <div className="text-xs text-slate-500">{selectedDoctor.specialization}</div>
                  </>
                ) : (
                  <span className="text-slate-500">None</span>
                )}
              </div>
            </div>

            <div>
              <Label>Start time (ISO)</Label>
              <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <div className="mt-1 text-xs text-slate-500">Example: 2026-04-06T14:00:00</div>
            </div>

            {bookingMsg && <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{bookingMsg}</div>}
            {bookingErr && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{bookingErr}</div>}

            <Button
              disabled={
                bookingLoading || !selectedDoctor || !auth.user || auth.user.role !== "PATIENT"
              }
              className="w-full"
              onClick={async () => {
                if (!selectedDoctor) return;
                setBookingMsg(null);
                setBookingErr(null);
                setBookingLoading(true);
                try {
                  const res = await api.post("/appointments", { doctor_id: selectedDoctor.doctor_id, start_time: startTime });
                  setBookingMsg(`Booked! Appointment #${res.data?.data?.appointment_id}`);
                } catch (e) {
                  setBookingErr(getApiErrorMessage(e));
                } finally {
                  setBookingLoading(false);
                }
              }}
            >
              {bookingLoading ? "Booking…" : "Confirm booking"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

