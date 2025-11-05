import axios from 'axios';
import { softLogout } from '@/services/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vr_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRedirecting = false; // ✅ evita loops

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401) {
      softLogout();

      if (!isRedirecting && typeof window !== 'undefined') {
        isRedirecting = true;
        window.location.href = `/unauthorized?type=401`;
      }
      return Promise.reject(err);
    }

    if ([403, 404].includes(status)) {
      if (!isRedirecting && typeof window !== 'undefined') {
        isRedirecting = true;
        window.location.href = `/unauthorized?type=${status}`;
      }
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default api;
