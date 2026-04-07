const state = {
  token: localStorage.getItem("token") || "",
};

const setMessage = (id, text, isError = false) => {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.color = isError ? "#ef4444" : "#16a34a";
};

const api = async (url, method = "GET", body) => {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    setMessage("login-msg", "Session expired. Please login again.", true);
  }
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

document.getElementById("register-btn").onclick = async () => {
  try {
    await api("/api/auth/register", "POST", {
      full_name: document.getElementById("reg-name").value,
      email: document.getElementById("reg-email").value,
      phone: document.getElementById("reg-phone").value,
      password: document.getElementById("reg-password").value,
      role: document.getElementById("reg-role").value,
    });
    setMessage("register-msg", "Registration successful.");
  } catch (err) {
    setMessage("register-msg", err.message, true);
  }
};

document.getElementById("login-btn").onclick = async () => {
  try {
    const data = await api("/api/auth/login", "POST", {
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value,
    });
    state.token = data.access_token;
    localStorage.setItem("token", state.token);
    setMessage("login-msg", `Welcome, ${data.user.full_name}`);
  } catch (err) {
    setMessage("login-msg", err.message, true);
  }
};

document.getElementById("load-doctors").onclick = async () => {
  const f = document.getElementById("specialization-filter").value.trim();
  const qs = f ? `?specialization=${encodeURIComponent(f)}` : "";
  const container = document.getElementById("doctor-results");
  container.innerHTML = "Loading...";
  try {
    const doctors = await api(`/api/doctors${qs}`);
    container.innerHTML = doctors.map((d) => `
      <div class="card">
        <h3>${d.full_name}</h3>
        <p><strong>${d.specialization}</strong></p>
        <p>${d.experience_years} years experience</p>
        <p>Fee: $${d.consultation_fee}</p>
        <p>ID: ${d.doctor_id}</p>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<p style="color:#ef4444">${err.message}</p>`;
  }
};

document.getElementById("book-btn").onclick = async () => {
  try {
    const data = await api("/api/patients/appointments", "POST", {
      doctor_id: Number(document.getElementById("book-doctor-id").value),
      appointment_date: document.getElementById("book-date").value,
      appointment_time: document.getElementById("book-time").value,
      symptoms_notes: document.getElementById("book-notes").value,
    });
    setMessage("book-msg", `Appointment #${data.appointment_id} created.`);
  } catch (err) {
    setMessage("book-msg", err.message, true);
  }
};

document.getElementById("dashboard-btn").onclick = async () => {
  try {
    const data = await api("/api/patients/dashboard");
    document.getElementById("dashboard-data").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("dashboard-data").textContent = err.message;
  }
};

document.getElementById("appointments-btn").onclick = async () => {
  try {
    const data = await api("/api/patients/appointments");
    document.getElementById("appointments-data").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("appointments-data").textContent = err.message;
  }
};
