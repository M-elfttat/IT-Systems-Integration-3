import { Outlet } from "react-router-dom";
import { Footer, Navbar, Sidebar } from "../components/common";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/doctors", label: "Doctors" },
  { to: "/admin/appointments", label: "Appointments" },
  { to: "/admin/patients", label: "Patients" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/activity", label: "Activity" },
];

export default function AdminLayout() {
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
