const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function showMessage(id, text, type = "success") {
  const box = document.getElementById(id);
  if (!box) return;
  box.textContent = text;
  box.className = `message ${type}`;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

function protectPage(requiredRole = null) {
  const token = getToken();
  const user = getUser();
  if (!token || !user) {
    window.location.href = "/";
    return false;
  }
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = user.role === "admin" ? "/admin-page" : "/dashboard";
    return false;
  }
  return true;
}
