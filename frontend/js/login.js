const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('message', '');
    try {
      const payload = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
      };
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
      saveAuth(data);
      const target = data.user.role === 'admin' ? 'pages/admin.html' : 'pages/dashboard.html';
      window.location.href = target;
    } catch (error) {
      setMessage('message', error.message, 'error');
    }
  });
}
