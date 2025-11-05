import api from './api';

// 🧩 Obtener perfil actual (ya autenticado)
export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

// 🧩 Actualizar perfil propio
export const updateMyProfile = async (payload: {
  name?: string;
  email?: string;
  address?: string;
  password?: string;
  currentPassword: string;
}) => {
  const { data } = await api.put('/users/me', payload);
  return data;
};
