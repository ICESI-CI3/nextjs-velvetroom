'use client';
import { useEffect, useState } from 'react';
import { getAllProducts, Product } from '@/services/products';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => console.error('Error cargando productos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Invocando los tesoros de la Velvet Room...</p>;

  if (products.length === 0)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>No hay productos disponibles por ahora.</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
        marginTop: 20,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}
