'use client';
import { Product } from '@/services/products';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="vr-card"
      style={{
        width: 260,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
      }}
    >
      <img
        src={product.productUrl || '/placeholder-product.png'}
        alt={product.name}
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
      <h3 className="vr-title" style={{ marginTop: 10 }}>{product.name}</h3>
      <p style={{ fontSize: 14, color: '#ccc' }}>{product.category?.name}</p>
      <p style={{ fontWeight: 600, color: 'var(--vr-gold)' }}>
        ${product.price_cents.toLocaleString()}
      </p>
      <Link href={`/products/${product.id}`} className="vr-btn" style={{ marginTop: 10 }}>
        Ver detalles
      </Link>
    </motion.div>
  );
}
