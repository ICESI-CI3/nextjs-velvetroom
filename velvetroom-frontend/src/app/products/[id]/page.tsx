'use client';
import { useEffect, useState } from 'react';
import { getProductById, Product } from '@/services/products';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(Number(id))
        .then(setProduct)
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Consultando los archivos del destino...</p>;

  if (!product)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h2>No se encontró este producto</h2>
        <Link href="/products" className="vr-btn" style={{ marginTop: 20 }}>
          Volver al catálogo
        </Link>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="vr-card"
      style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <img
          src={product.productUrl || '/placeholder-product.png'}
          alt={product.name}
          style={{
            width: 300,
            height: 300,
            objectFit: 'cover',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
        <div style={{ flex: 1 }}>
          <h1 className="vr-title">{product.name}</h1>
          <p style={{ color: '#ccc', marginBottom: 12 }}>{product.description}</p>
          <p style={{ fontWeight: 600, color: 'var(--vr-gold)', fontSize: 20 }}>
            ${product.price_cents.toLocaleString()}
          </p>
          <p>Stock disponible: {product.stock}</p>
          <p>Categoría: {product.category?.name || 'Sin categoría'}</p>
          <p>Vendedor: {product.seller?.name || 'Desconocido'}</p>
          <button className="vr-btn" style={{ marginTop: 20 }}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </motion.div>
  );
}
