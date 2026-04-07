import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PageHeader = ({ title, subtitle }) => (
  <div className="page-header"><h1>{title}</h1><p>{subtitle}</p></div>
);
export const LoadingSpinner = () => <div className="card">Loading...</div>;
export const EmptyState = ({ text = "No data found" }) => <div className="card">{text}</div>;
export const ErrorAlert = ({ text }) => text ? <div className="alert error">{text}</div> : null;
export const StatusBadge = ({ status }) => <span className={`badge ${status || "pending"}`}>{status}</span>;
export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} />
);
export const FilterPanel = ({ children }) => <div className="card filter">{children}</div>;
export const FormField = ({ label, ...props }) => <label>{label}<input {...props} /></label>;
export const PasswordField = ({ label, ...props }) => <label>{label}<input type="password" {...props} /></label>;
export const StatsCard = ({ label, value }) => <div className="card"><h3>{label}</h3><p>{value}</p></div>;
export const DataTable = ({ columns = [], rows = [] }) => (
  <table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
);
export const Pagination = () => <div className="pagination">Prev 1 2 3 Next</div>;
export const ConfirmationModal = ({ open, title, onConfirm, onClose }) => open ? (
  <div className="modal"><div className="card"><h3>{title}</h3><button onClick={onConfirm}>Confirm</button><button onClick={onClose}>Close</button></div></div>
) : null;
export const ToastNotification = ({ message }) => message ? <div className="toast">{message}</div> : null;
export const DoctorCard = ({ doctor }) => (
  <div className="card"><h3>{doctor.full_name}</h3><p>{doctor.specialization}</p><p>{doctor.clinic_name}</p><Link to={`/doctors/${doctor.doctor_id}`}>View Profile</Link></div>
);
export const AppointmentCard = ({ appointment }) => (
  <div className="card"><h3>{appointment.doctor_name || "Appointment"}</h3><p>{appointment.date} {appointment.time}</p><StatusBadge status={appointment.status} /></div>
);
export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const homePath = isAuthenticated
    ? user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "doctor"
        ? "/doctor/dashboard"
        : "/patient/dashboard"
    : "/";
  return (
    <header className="navbar">
      <Link to={homePath}>MediBook</Link>
      <nav className="actions compact">
        {isAuthenticated ? <button onClick={logout}>Logout</button> : <NavLink to="/login">Login</NavLink>}
      </nav>
    </header>
  );
};
export const Sidebar = ({ links }) => <aside className="sidebar">{links.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}</aside>;
export const Footer = () => null;
