if (protectPage("patient")) {
  initBookingPage();
}

async function initBookingPage() {
  await loadDoctorsForSelect();
  const queryDoctor = new URLSearchParams(window.location.search).get("doctor");
  if (queryDoctor) {
    document.getElementById("doctor_id").value = queryDoctor;
  }
}

async function loadDoctorsForSelect() {
  const response = await fetch(`${API_BASE}/doctors`);
  const doctors = await response.json();
  const select = document.getElementById("doctor_id");
  select.innerHTML = '<option value="">Select a doctor</option>';

  doctors.forEach((doctor) => {
    select.innerHTML += `<option value="${doctor.id}">${doctor.full_name} - ${doctor.specialization}</option>`;
  });
}

document.getElementById("booking-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    doctor_id: Number(document.getElementById("doctor_id").value),
    appointment_date: document.getElementById("appointment_date").value,
    appointment_time: document.getElementById("appointment_time").value,
    notes: document.getElementById("notes").value,
  };

  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    showMessage("booking-message", data.message || JSON.stringify(data.errors) || "Booking failed.", "error");
    return;
  }

  showMessage("booking-message", data.message, "success");
  document.getElementById("booking-form").reset();
});
