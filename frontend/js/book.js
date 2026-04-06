attachLogout();
requireRole('patient');

const doctorSelect = document.getElementById('doctor_id');
const doctorInfo = document.getElementById('doctorInfo');
const bookingForm = document.getElementById('bookingForm');

async function loadDoctors() {
  const doctors = await apiFetch('/doctors');
  doctorSelect.innerHTML = doctors.map(doctor => `<option value="${doctor.id}">${doctor.full_name} - ${doctor.specialization}</option>`).join('');
  doctorInfo.innerHTML = doctors.map(doctor => `
    <div class="card">
      <h4>${doctor.full_name}</h4>
      <p><strong>Specialization:</strong> ${doctor.specialization}</p>
      <p><strong>Availability:</strong> ${doctor.availability}</p>
    </div>
  `).join('');
}

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('message', '');
  try {
    const payload = {
      doctor_id: Number(document.getElementById('doctor_id').value),
      appointment_date: document.getElementById('appointment_date').value,
      appointment_time: document.getElementById('appointment_time').value,
      notes: document.getElementById('notes').value.trim(),
    };
    await apiFetch('/appointments', { method: 'POST', body: JSON.stringify(payload) }, true);
    setMessage('message', 'Appointment booked successfully.', 'success');
    bookingForm.reset();
    await loadDoctors();
  } catch (error) {
    setMessage('message', error.message, 'error');
  }
});

loadDoctors().catch(error => setMessage('message', error.message, 'error'));
