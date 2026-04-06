if (protectPage()) {
  loadDoctors();
}

async function loadDoctors() {
  const response = await fetch(`${API_BASE}/doctors`);
  const doctors = await response.json();
  const grid = document.getElementById("doctor-grid");
  grid.innerHTML = "";

  doctors.forEach((doctor) => {
    grid.innerHTML += `
      <div class="card doctor-card">
        <h3>${doctor.full_name}</h3>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p><strong>Availability:</strong> ${doctor.availability}</p>
        <p><strong>Email:</strong> ${doctor.email}</p>
        <p><strong>Phone:</strong> ${doctor.phone}</p>
        <a class="button-link" href="/book?doctor=${doctor.id}">Book Appointment</a>
      </div>
    `;
  });
}
