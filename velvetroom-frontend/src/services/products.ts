import api from './api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price_cents: number;
  stock: number;
  productUrl?: string;
  condition: 'new' | 'fan_made' | 'used';
  category: { id: number; name: string };
  seller: { id: number; name: string };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price_cents: number;
  stock: number;
  productUrl?: string;
  categoryId: string;
  condition?: 'new' | 'fan_made' | 'used';
}

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await api.get('/products');
  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function getDistinctCategories(): Promise<{ category: string; count: number }[]> {
  const { data } = await api.get('/products/categories/distinct');
  return data;
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const { data } = await api.post('/products', dto);
  return data;
}

export async function updateProduct(id: number, dto: Partial<CreateProductDto>): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, dto);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
