/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/services/orders";
import { motion } from "framer-motion";
import { toast } from "sonner";
import RoleGate from "@/components/RoleGate";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  const load = () => getOrderById(Number(id)).then(setOrder);
  useEffect(() => { load(); }, [id]);

  if (!order) return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando orden...</p>;

  const handleStatusChange = async (status: string) => {
    await updateOrderStatus(order.id, status);
    toast.success("Estado actualizado ✨");
    load();
  };

  return (
    <RoleGate roles={['admin']}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 700, margin: "40px auto" }}>
        <button onClick={() => router.back()} className="vr-btn" style={{ marginBottom: 14 }}>
          ← Volver
        </button>

        <h1 className="vr-title" style={{ textAlign: "center" }}>Orden #{order.id}</h1>

        <div className="vr-card" style={{ marginTop: 20 }}>
          <strong>Cliente:</strong> {order.user.name} ({order.user.email})<br/>
          <strong>Total:</strong> ${(order.total_cents / 1000).toFixed(3)}<br/>

          <div style={{ marginTop: 12 }}>
            <strong>Estado:</strong>
            <select
              className="vr-input"
              style={{ marginLeft: 8 }}
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="shipped">Enviado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <h2 className="vr-title" style={{ marginTop: 24 }}>Productos</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="vr-card" style={{ marginTop: 10 }}>
            <strong>{item.product.name}</strong>
            <div>Cantidad: {item.quantity}</div>
            <div>Unitario: ${(item.unit_cents / 1000).toFixed(3)}</div>
            <div>Subtotal: ${(item.subtotal_cents / 1000).toFixed(3)}</div>
          </div>
        ))}
      </motion.div>
    </RoleGate>
  );
}
