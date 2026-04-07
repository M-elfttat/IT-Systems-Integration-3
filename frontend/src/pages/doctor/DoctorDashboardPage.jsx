import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorAlert, PageHeader, StatusBadge } from "../../components/common";
import { doctorService } from "../../services/doctorService";

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function parseAppointmentDate(appointment) {
  return new Date(`${appointment.date}T${appointment.time || "00:00:00"}`);
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([doctorService.myAppointments(), doctorService.myNotifications()])
      .then(([appointmentRows, notificationRows]) => {
        setAppointments(Array.isArray(appointmentRows) ? appointmentRows : []);
        setNotifications(Array.isArray(notificationRows) ? notificationRows : []);
        setError("");
      })
      .catch(() => {
        setAppointments([]);
        setNotifications([]);
        setError("Could not load doctor dashboard data.");
      });
  }, []);

  const { today, upcomingWeek, bookingAlerts, cancellationAlerts } = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);

    const sorted = [...appointments].sort((a, b) => parseAppointmentDate(a) - parseAppointmentDate(b));
    const todayRows = sorted.filter((appt) => isSameDate(parseAppointmentDate(appt), now));
    const upcomingRows = sorted.filter((appt) => {
      const date = parseAppointmentDate(appt);
      return date >= now && date <= weekFromNow;
    });

    return {
      today: todayRows,
      upcomingWeek: upcomingRows,
      bookingAlerts: notifications.filter((n) => n.type === "booking").slice(0, 5),
      cancellationAlerts: notifications.filter((n) => n.type === "cancellation").slice(0, 5),
    };
  }, [appointments, notifications]);

  return (
    <section>
      <PageHeader
        title="Doctor Dashboard"
        subtitle="Today's appointments, weekly schedule, and booking alerts in one place."
      />
      <ErrorAlert text={error} />

      <div className="grid3 doctor-overview">
        <div className="card stat-tile">
          <p className="stat-label">Today</p>
          <h3>{today.length}</h3>
          <p className="stat-meta">Appointments on your schedule</p>
        </div>
        <div className="card stat-tile">
          <p className="stat-label">Next 7 days</p>
          <h3>{upcomingWeek.length}</h3>
          <p className="stat-meta">Upcoming visits this week</p>
        </div>
        <div className="card stat-tile">
          <p className="stat-label">Alerts</p>
          <h3>{bookingAlerts.length + cancellationAlerts.length}</h3>
          <p className="stat-meta">New bookings and cancellations</p>
        </div>
      </div>

      <div className="card">
        <h3>Today's Appointments</h3>
        {today.length === 0 ? (
          <EmptyState text="No appointments for today." />
        ) : (
          <div className="list-stack">
            {today.map((appt) => (
              <div className="list-row" key={appt.appointment_id}>
                <div>
                  <strong>{appt.time}</strong> - {appt.patient_name}
                  <p className="muted-line">{appt.symptoms_notes || "General consultation"}</p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Upcoming This Week</h3>
        {upcomingWeek.length === 0 ? (
          <EmptyState text="No upcoming appointments this week." />
        ) : (
          <div className="list-stack">
            {upcomingWeek.map((appt) => (
              <div className="list-row" key={`week-${appt.appointment_id}`}>
                <div>
                  <strong>{appt.date}</strong> at {appt.time} - {appt.patient_name}
                  <p className="muted-line">{appt.symptoms_notes || "General consultation"}</p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid3">
        <div className="card">
          <h3>New Booking Alerts</h3>
          {bookingAlerts.length === 0 ? (
            <p className="muted-line">No new booking alerts.</p>
          ) : (
            <div className="list-stack">
              {bookingAlerts.map((appt) => (
                <div className="list-row" key={`book-${appt.appointment_id}`}>
                  <span>{appt.patient_name} booked {appt.date} {appt.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3>Cancellation Alerts</h3>
          {cancellationAlerts.length === 0 ? (
            <p className="muted-line">No cancellation alerts.</p>
          ) : (
            <div className="list-stack">
              {cancellationAlerts.map((appt) => (
                <div className="list-row" key={`cancel-${appt.appointment_id}`}>
                  <span>{appt.patient_name} cancelled {appt.date} {appt.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
