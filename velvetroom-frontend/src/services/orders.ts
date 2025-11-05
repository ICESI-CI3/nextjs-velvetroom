import api from "./api";

export const getMyOrders = () => api.get("/orders").then((r) => r.data);

export const getOrderById = (id: number) => api.get(`/orders/${id}`).then((r) => r.data);

export function createOrder() {
  return api.post('/orders', {}); // ✅ Enviar body vacío explícito
}

export const getAllOrders = async () => {
  const res = await api.get('/orders');
  return res.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};

export const deleteOrder = async (id: number) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};