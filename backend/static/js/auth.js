const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const messageBox = document.getElementById("message-box");

function showAuthMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function setActiveTab(id) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === id));
  tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === id));
}

tabButtons.forEach((btn) => btn.addEventListener("click", () => setActiveTab(btn.dataset.tab)));

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    showAuthMessage(data.message || "Login failed.", "error");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  showAuthMessage(data.message, "success");
  window.location.href = data.user.role === "admin" ? "/admin-page" : "/dashboard";
});

document.getElementById("register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    const errorText = data.message || JSON.stringify(data.errors) || "Registration failed.";
    showAuthMessage(errorText, "error");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  showAuthMessage(data.message, "success");
  window.location.href = "/dashboard";
});
