attachLogout();
requireRole('patient');

(async function loadDoctors() {
  try {
    const doctors = await apiFetch('/doctors');
    const container = document.getElementById('doctorList');
    container.innerHTML = doctors.map(doctor => `
      <div class="card">
        <h3>${doctor.full_name}</h3>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p><strong>Availability:</strong> ${doctor.availability}</p>
        <p><strong>Email:</strong> ${doctor.email}</p>
        <p><strong>Phone:</strong> ${doctor.phone}</p>
      </div>
    `).join('');
  } catch (error) {
    document.getElementById('doctorList').innerHTML = `<div class="card">${error.message}</div>`;
  }
})();
