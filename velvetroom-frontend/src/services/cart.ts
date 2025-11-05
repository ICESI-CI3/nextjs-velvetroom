// src/services/cart.ts
import api from "./api";

export async function getCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function addToCart(productId: number, quantity = 1) {
  const { data } = await api.post("/cart/items", { productId, quantity });
  return data;
}

export async function updateCartItem(itemId: number, quantity: number) {
  const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItem(itemId: number) {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete(`/cart/clear`);
  return data;
}
