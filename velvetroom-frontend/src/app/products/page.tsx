'use client';
import RoleGate from '@/components/RoleGate';
import ProductList from '@/components//ProductList';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <RoleGate public>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: 24 }}
    >
      <h1 className="vr-title" style={{ textAlign: 'center' }}>Catálogo de Productos</h1>
      <p style={{ textAlign: 'center', color: '#ccc' }}>
        Explora los artefactos únicos traídos desde las profundidades del Velvet Room.
      </p>
      <ProductList />
    </motion.div>
    </RoleGate>
  );
}
