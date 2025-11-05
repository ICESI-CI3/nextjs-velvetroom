'use client';
import { useEffect, useState } from 'react';
import { CreateProductDto, getDistinctCategories } from '@/services/products';
import { toast } from 'sonner';

interface Props {
  initialData?: Partial<CreateProductDto>;
  onSubmit: (data: CreateProductDto) => Promise<void>;
  submitLabel?: string;
}

export default function ProductForm({ initialData, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<CreateProductDto>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price_cents: initialData?.price_cents || 0,
    stock: initialData?.stock || 0,
    productUrl: initialData?.productUrl || '',
    categoryId: initialData?.categoryId || '',
    condition: initialData?.condition || 'new',
  });

  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    getDistinctCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch {
      toast.error('No se pudo guardar el producto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vr-card" style={{ padding: 24, display: 'grid', gap: 12 }}>
      <input
        className="vr-input"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre del producto"
      />
      <input
        className="vr-input"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción"
      />
      <input
        className="vr-input"
        type="number"
        name="price_cents"
        value={form.price_cents}
        onChange={handleChange}
        placeholder="Precio (centavos)"
      />
      <input
        className="vr-input"
        type="number"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock disponible"
      />
      <input
        className="vr-input"
        name="productUrl"
        value={form.productUrl}
        onChange={handleChange}
        placeholder="URL de imagen del producto"
      />

      <select className="vr-input" name="categoryId" value={form.categoryId} onChange={handleChange}>
        <option value="">Selecciona una categoría</option>
            {categories.map((c, idx) => (
            <option key={idx} value={c.id || idx}>
                {c.category}
            </option>
            ))}
      </select>

      <select className="vr-input" name="condition" value={form.condition} onChange={handleChange}>
        <option value="new">Nuevo</option>
        <option value="fan_made">Fan-Made</option>
        <option value="used">Usado</option>
      </select>

      <button type="submit" className="vr-btn" style={{ marginTop: 8 }}>
        {submitLabel || 'Guardar producto'}
      </button>
    </form>
  );
}
