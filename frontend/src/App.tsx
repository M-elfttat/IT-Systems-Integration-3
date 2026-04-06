import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./lib/auth";
import { Card, Button } from "./components/ui";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";
import { DoctorSchedulePage } from "./pages/DoctorSchedulePage";
import { AdminDoctorsPage } from "./pages/AdminDoctorsPage";

function AppShell({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-full">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-semibold text-slate-900">
            Doctor Booking
          </Link>
          <div className="flex items-center gap-2">
            {auth.user ? (
              <>
                <Link className="text-sm text-slate-700 hover:text-slate-900" to="/doctors">
                  Doctors
                </Link>
                {auth.user.role === "PATIENT" && (
                  <Link className="text-sm text-slate-700 hover:text-slate-900" to="/me/appointments">
                    My appointments
                  </Link>
                )}
                {auth.user.role === "DOCTOR" && (
                  <Link className="text-sm text-slate-700 hover:text-slate-900" to="/doctor/schedule">
                    My schedule
                  </Link>
                )}
                {auth.user.role === "ADMIN" && (
                  <Link className="text-sm text-slate-700 hover:text-slate-900" to="/admin/doctors">
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    auth.logout();
                    nav("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link className="text-sm text-slate-700 hover:text-slate-900" to="/login">
                  Login
                </Link>
                <Link className="text-sm text-slate-700 hover:text-slate-900" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-500">
        <div className="border-t border-slate-200 pt-4">
          API: <span className="font-mono">{import.meta.env.VITE_API_BASE_URL}</span>
        </div>
      </footer>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  if (!auth.isReady) return null;
  if (!auth.user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Book appointments, fast.</h1>
        <p className="text-slate-600">
          A clean demo frontend for your System Integration project: React client + Flask API + PostgreSQL.
        </p>
        <div className="flex gap-3">
          <Link to="/doctors">
            <Button>Browse doctors</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </div>
      <Card>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-900">Seeded demo accounts</div>
          <div className="text-sm text-slate-700">
            <div>
              <span className="font-medium">Admin</span>: <span className="font-mono">admin@sysint.local</span> /
              <span className="font-mono"> Admin123!</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">Doctors</span>: password <span className="font-mono">Doctor123!</span>
              <ul className="mt-1 list-disc pl-5 font-mono text-xs text-slate-600">
                <li>sara.cardiology@sysint.local</li>
                <li>omar.derma@sysint.local</li>
                <li>lina.pedia@sysint.local</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />

        <Route
          path="/me/appointments"
          element={
            <RequireAuth>
              <MyAppointmentsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <RequireAuth>
              <DoctorSchedulePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <RequireAuth>
              <AdminDoctorsPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
