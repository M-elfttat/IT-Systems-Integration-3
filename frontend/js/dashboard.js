attachLogout();
const user = requireRole('patient');
document.getElementById('welcomeText').textContent = `Welcome, ${user.full_name || 'Patient'}`;

(async function loadAppointments() {
  try {
    const appointments = await apiFetch('/appointments', {}, true);
    const container = document.getElementById('appointmentsList');
    if (!appointments.length) {
      container.innerHTML = '<div class="card">No appointments booked yet.</div>';
      return;
    }
    container.innerHTML = appointments.map(item => `
      <div class="card">
        <h3>${item.doctor_name}</h3>
        <p><strong>Specialization:</strong> ${item.specialization}</p>
        <p><strong>Date:</strong> ${item.appointment_date}</p>
        <p><strong>Time:</strong> ${item.appointment_time}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <p><strong>Payment:</strong> ${item.payment_status || 'Pending'}</p>
      </div>
    `).join('');
  } catch (error) {
    document.getElementById('appointmentsList').innerHTML = `<div class="card">${error.message}</div>`;
  }
})();
