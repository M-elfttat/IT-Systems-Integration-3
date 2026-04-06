const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('message', '');
    try {
      const payload = {
        full_name: document.getElementById('full_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
      };
      const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      saveAuth(data);
      setMessage('message', 'Registration successful. Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
    } catch (error) {
      setMessage('message', error.message, 'error');
    }
  });
}
