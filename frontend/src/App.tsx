import { Navigate, Outlet, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./lib/auth";
import { Card, Button } from "./components/ui";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";
import { DoctorSchedulePage } from "./pages/DoctorSchedulePage";
import { AdminDoctorsPage } from "./pages/AdminDoctorsPage";

function AppShell() {
  const auth = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-950">
            MediBook
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            {auth.user ? (
              <>
                <Link className="hover:text-slate-950" to="/doctors">
                  Doctors
                </Link>
                {auth.user.role === "PATIENT" && (
                  <Link className="hover:text-slate-950" to="/me/appointments">
                    My appointments
                  </Link>
                )}
                {auth.user.role === "DOCTOR" && (
                  <Link className="hover:text-slate-950" to="/doctor/schedule">
                    My schedule
                  </Link>
                )}
                {auth.user.role === "ADMIN" && (
                  <Link className="hover:text-slate-950" to="/admin/doctors">
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
                <Link className="hover:text-slate-950" to="/login">
                  Login
                </Link>
                <Link className="hover:text-slate-950" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>

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

function RootRoute() {
  const auth = useAuth();
  if (!auth.isReady) return null;
  return auth.user ? <Home /> : <Navigate to="/login" replace />;
}

function Home() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Your clinic appointment experience, <span className="text-indigo-600">simplified.</span>
        </h1>
        <p className="max-w-2xl text-slate-600">
          MediBook helps patients, doctors, and clinic administrators book, manage, and review appointments in one streamlined workflow.
        </p>

        <ul className="space-y-3 text-slate-700">
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            Browse doctors by specialization and availability
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            Book and track your appointments in real time
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            Secure login with role-based access
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            Admin tools for managing doctors and schedules
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="ghost">Register</Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="space-y-3">
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
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<RootRoute />} />
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
      </Route>
    </Routes>
  );
}
