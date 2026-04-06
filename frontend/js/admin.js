attachLogout();
requireRole('admin');

const summaryCards = document.getElementById('summaryCards');
const doctorList = document.getElementById('doctorList');
const appointmentList = document.getElementById('appointmentList');
const doctorForm = document.getElementById('doctorForm');

async function loadSummary() {
  const summary = await apiFetch('/admin/dashboard', {}, true);
  summaryCards.innerHTML = Object.entries(summary).map(([key, value]) => `
    <div class="stat-box">
      <span>${key.replaceAll('_', ' ')}</span>
      <strong>${value}</strong>
    </div>
  `).join('');
}

async function loadDoctors() {
  const doctors = await apiFetch('/doctors');
  doctorList.innerHTML = doctors.map(doctor => `
    <div class="card">
      <h3>${doctor.full_name}</h3>
      <p><strong>Specialization:</strong> ${doctor.specialization}</p>
      <p><strong>Availability:</strong> ${doctor.availability}</p>
      <p><strong>Email:</strong> ${doctor.email}</p>
      <p><strong>Phone:</strong> ${doctor.phone}</p>
    </div>
  `).join('');
}

async function loadAppointments() {
  const appointments = await apiFetch('/admin/appointments', {}, true);
  if (!appointments.length) {
    appointmentList.innerHTML = '<div class="card">No appointments yet.</div>';
    return;
  }
  appointmentList.innerHTML = appointments.map(item => `
    <div class="card">
      <h3>${item.patient_name} with ${item.doctor_name}</h3>
      <p><strong>Date:</strong> ${item.appointment_date}</p>
      <p><strong>Time:</strong> ${item.appointment_time}</p>
      <p><strong>Status:</strong> ${item.status}</p>
      <p><strong>Payment:</strong> ${item.payment_status || 'Pending'}</p>
      <div class="inline-actions">
        <button onclick="updateStatus(${item.id}, 'Completed')">Mark Completed</button>
        <button onclick="updateStatus(${item.id}, 'Cancelled')">Cancel</button>
      </div>
    </div>
  `).join('');
}

async function updateStatus(id, status) {
  try {
    await apiFetch(`/admin/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, true);
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
}
window.updateStatus = updateStatus;

doctorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('doctorMessage', '');
  try {
    const payload = {
      full_name: document.getElementById('full_name').value.trim(),
      specialization: document.getElementById('specialization').value.trim(),
      availability: document.getElementById('availability').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
    };
    await apiFetch('/admin/doctors', { method: 'POST', body: JSON.stringify(payload) }, true);
    doctorForm.reset();
    setMessage('doctorMessage', 'Doctor added successfully.', 'success');
    await refreshAll();
  } catch (error) {
    setMessage('doctorMessage', error.message, 'error');
  }
});

async function refreshAll() {
  await Promise.all([loadSummary(), loadDoctors(), loadAppointments()]);
}

refreshAll().catch(error => {
  summaryCards.innerHTML = `<div class="card">${error.message}</div>`;
});
