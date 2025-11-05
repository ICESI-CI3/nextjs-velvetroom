'use client';
import Link from 'next/link';
import { Product } from '@/services/products';

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  if (products.length === 0)
    return <p style={{ marginTop: 20 }}>Aún no has invocado ningún producto...</p>;

  return (
    <div
      className="vr-card"
      style={{ marginTop: 20, overflowX: 'auto', padding: 16 }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--vr-fg)' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Condición</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td>{p.name}</td>
              <td>${(p.price_cents / 100).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>{p.category?.name}</td>
              <td>
                {p.condition === 'new' && '🆕 Nuevo'}
                {p.condition === 'used' && '♻️ Usado'}
                {p.condition === 'fan_made' && '🎨 Fan-Made'}
              </td>
              <td style={{ display: 'flex', gap: 8 }}>
                <Link href={`/my-products/${p.id}/edit`} className="vr-btn">
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => onDelete(p.id)}
                  className="vr-btn"
                  style={{ background: 'rgba(226,77,77,0.2)' }}
                >
                  🗑 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
