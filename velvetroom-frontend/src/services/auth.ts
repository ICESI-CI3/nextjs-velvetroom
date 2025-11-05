import api from './api';

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  address: string; // ✅ nuevo campo obligatorio
}) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/users/me');
  return data;
}

export function logoutUser() {
  localStorage.removeItem("vr_token");
  localStorage.removeItem("vr_user");
  window.dispatchEvent(new Event("storage")); // 💡 notifica contexts
}

export function softLogout() {
  localStorage.removeItem('vr_token');
  localStorage.removeItem('vr_user');

  window.dispatchEvent(new Event('auth-logout'));

  // ✅ Redirigir con pantalla especial
  window.location.href = '/unauthorized?type=logout';
}
