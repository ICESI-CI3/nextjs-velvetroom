import axios from 'axios';

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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if ([401, 403, 404].includes(status)) {
      const type = status.toString();
      if (typeof window !== 'undefined') {
        window.location.href = `/unauthorized?type=${type}`;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
