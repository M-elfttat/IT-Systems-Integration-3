function setMessage(id, text, type = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`.trim();
}

function saveAuth(payload) {
  localStorage.setItem('token', payload.token);
  localStorage.setItem('user', JSON.stringify(payload.user));
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../index.html';
}

function attachLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

async function apiFetch(path, options = {}, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (auth) {
    const token = getToken();
    if (!token) throw new Error('You are not logged in.');
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorText = data.message || JSON.stringify(data.errors || data) || 'Request failed.';
    throw new Error(errorText);
  }
  return data;
}

function requireRole(role) {
  const user = getUser();
  if (!user || (role && user.role !== role)) {
    window.location.href = '../index.html';
  }
  return user;
}
