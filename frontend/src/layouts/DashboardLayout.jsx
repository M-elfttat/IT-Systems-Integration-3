import { Outlet } from "react-router-dom";
import { Footer, Navbar, Sidebar } from "../components/common";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();
  const links = user?.role === "doctor"
    ? [{ to: "/doctor/dashboard", label: "Dashboard" }, { to: "/doctor/appointments", label: "Appointments" }, { to: "/doctor/patients", label: "Patients" }, { to: "/doctor/profile", label: "Profile" }]
    : [{ to: "/patient/dashboard", label: "Dashboard" }, { to: "/patient/book", label: "Book Appointment" }, { to: "/patient/appointments", label: "My Appointments" }, { to: "/patient/profile", label: "Profile" }, { to: "/patient/notifications", label: "Notifications" }];
  return (
    <div className="layout">
      <Navbar />
      <div className="body-grid">
        <Sidebar links={links} />
        <main className="container"><Outlet /></main>
      </div>
      <Footer />
    </div>
  );
}
