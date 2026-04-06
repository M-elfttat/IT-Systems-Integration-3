if (protectPage("admin")) {
  loadAdminDashboard();
}

async function loadAdminDashboard() {
  await Promise.all([loadStats(), loadAppointments()]);
}

async function loadStats() {
  const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: { ...authHeaders() } });
  const data = await response.json();
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = "";

  const stats = [
    ["Doctors", data.total_doctors],
    ["Appointments", data.total_appointments],
    ["Booked", data.booked],
    ["Completed", data.completed],
  ];

  stats.forEach(([label, value]) => {
    grid.innerHTML += `<div><h3>${value ?? 0}</h3><p>${label}</p></div>`;
  });
}

async function loadAppointments() {
  const response = await fetch(`${API_BASE}/admin/appointments`, { headers: { ...authHeaders() } });
  const data = await response.json();
  const body = document.getElementById("admin-appointments-body");
  body.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    body.innerHTML = `<tr><td colspan="6">No appointments found.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    body.innerHTML += `
      <tr>
        <td>${item.patient_name}</td>
        <td>${item.doctor_name}</td>
        <td>${item.appointment_date}</td>
        <td>${item.appointment_time}</td>
        <td>${item.status}</td>
        <td>${item.payment_status || "-"}</td>
      </tr>
    `;
  });
}

document.getElementById("doctor-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch(`${API_BASE}/admin/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    showMessage("admin-message", data.message || JSON.stringify(data.errors) || "Unable to add doctor.", "error");
    return;
  }

  showMessage("admin-message", data.message, "success");
  event.target.reset();
  await loadAdminDashboard();
});
