if (protectPage("patient")) {
  loadMyAppointments();
}

async function loadMyAppointments() {
  const response = await fetch(`${API_BASE}/appointments`, {
    headers: { ...authHeaders() },
  });
  const body = document.getElementById("appointments-body");
  body.innerHTML = "";

  const data = await response.json();
  if (!response.ok) {
    showMessage("dashboard-message", data.message || "Unable to load appointments.", "error");
    return;
  }

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="6">No appointments booked yet.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    body.innerHTML += `
      <tr>
        <td>${item.doctor_name}</td>
        <td>${item.specialization}</td>
        <td>${item.appointment_date}</td>
        <td>${item.appointment_time}</td>
        <td>${item.status}</td>
        <td>${item.payment_status || "-"}</td>
      </tr>
    `;
  });
}
