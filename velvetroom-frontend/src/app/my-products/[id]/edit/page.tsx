/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getProductById, updateProduct } from '@/services/products';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ProductForm from '@/components/ProductForm';
import RoleGate from '@/components/RoleGate';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) getProductById(Number(id)).then(setProduct);
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updateProduct(Number(id), data);
    toast.success('Producto actualizado');
    router.push('/my-products');
  };

  if (!product) return <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando producto...</p>;

  return (
    <RoleGate roles={['admin', 'seller']}>
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <h1 className="vr-title" style={{ textAlign: 'center' }}>
          Editar Producto
        </h1>
        <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
      </div>
    </RoleGate>
  );
}
