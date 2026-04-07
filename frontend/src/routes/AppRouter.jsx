import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute, PublicRoute, RoleProtectedRoute } from "./RouteGuards";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import DoctorsListPage from "../pages/public/DoctorsListPage";
import DoctorProfilePage from "../pages/public/DoctorProfilePage";
import PatientDashboardPage from "../pages/patient/PatientDashboardPage";
import MyAppointmentsPage from "../pages/patient/MyAppointmentsPage";
import AppointmentDetailsPage from "../pages/patient/AppointmentDetailsPage";
import BookingPage from "../pages/patient/BookingPage";
import PatientBookDoctorPage from "../pages/patient/PatientBookDoctorPage";
import PaymentPage from "../pages/patient/PaymentPage";
import PatientProfilePage from "../pages/patient/PatientProfilePage";
import NotificationsPage from "../pages/patient/NotificationsPage";
import DoctorDashboardPage from "../pages/doctor/DoctorDashboardPage";
import DoctorAppointmentsPage from "../pages/doctor/DoctorAppointmentsPage";
import DoctorPatientsPage from "../pages/doctor/DoctorPatientsPage";
import DoctorProfileManagePage from "../pages/doctor/DoctorProfileManagePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminManageDoctorsPage from "../pages/admin/AdminManageDoctorsPage";
import AdminManageAppointmentsPage from "../pages/admin/AdminManageAppointmentsPage";
import AdminManagePatientsPage from "../pages/admin/AdminManagePatientsPage";
import AdminPaymentsPage from "../pages/admin/AdminPaymentsPage";
import AdminActivityLogPage from "../pages/admin/AdminActivityLogPage";
import UnauthorizedPage from "../pages/system/UnauthorizedPage";
import ForbiddenPage from "../pages/system/ForbiddenPage";
import NotFoundPage from "../pages/system/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/doctors" element={<DoctorsListPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute roles={["patient", "doctor"]} />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoleProtectedRoute roles={["patient"]} />}>
              <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
              <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
              <Route path="/patient/appointments/:appointmentId" element={<AppointmentDetailsPage />} />
              <Route path="/patient/book" element={<PatientBookDoctorPage />} />
              <Route path="/patient/book/:doctorId" element={<BookingPage />} />
              <Route path="/patient/payment/:appointmentId" element={<PaymentPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
              <Route path="/patient/notifications" element={<NotificationsPage />} />
            </Route>
            <Route element={<RoleProtectedRoute roles={["doctor"]} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
              <Route path="/doctor/profile" element={<DoctorProfileManagePage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute roles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/doctors" element={<AdminManageDoctorsPage />} />
            <Route path="/admin/appointments" element={<AdminManageAppointmentsPage />} />
            <Route path="/admin/patients" element={<AdminManagePatientsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/activity" element={<AdminActivityLogPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
