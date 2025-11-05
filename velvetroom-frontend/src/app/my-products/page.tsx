/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getAllProducts, Product, deleteProduct } from '@/services/products';
import { useAuth } from '@/contexts/AuthContext';
import RoleGate from '@/components/RoleGate';
import ProductTable from '@/components/ProductTable';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getAllProducts()
      .then((all) => {
        const mine = user.role === 'admin'
          ? all
          : all.filter((p) => p.seller.id === user.id);
        setProducts(mine);
      })
      .catch(() => toast.error('Error cargando tus productos'))
      .finally(() => setLoading(false));
  }, [user]);

const handleDelete = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Producto eliminado con éxito.');
  } catch (error: any) {
    if (error.response?.status === 403) {
      toast.error('No tienes permiso para eliminar este producto.');
    } else {
      toast.error('Ocurrió un error al eliminar el producto.');
    }
  }
};

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Consultando el inventario...</p>;

  return (
    <RoleGate roles={['admin', 'seller']}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="vr-title">Mis Productos</h1>
          <Link href="/my-products/new" className="vr-btn">
            ➕ Nuevo producto
          </Link>
        </div>

        <ProductTable products={products} onDelete={handleDelete} />
      </motion.div>
    </RoleGate>
  );
}
