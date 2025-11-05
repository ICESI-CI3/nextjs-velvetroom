/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import RoleGate from '@/components/RoleGate';
import { getAllOrders, updateOrderStatus } from '@/services/orders';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = () => getAllOrders().then(setOrders);
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Estado actualizado ✨");
      load();
    } catch {
      toast.error("No se pudo actualizar el estado.");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'rgba(255, 196, 0, 0.35)';
      case 'paid': return 'rgba(0, 180, 120, 0.35)';
      case 'shipped': return 'rgba(0, 120, 255, 0.35)';
      case 'completed': return 'rgba(160, 120, 255, 0.35)';
      case 'cancelled': return 'rgba(255, 80, 80, 0.35)';
      default: return 'rgba(200,200,200,0.3)';
    }
  };

  return (
    <RoleGate roles={['admin']}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}
      >
        <h1 className="vr-title" style={{ textAlign: 'center', marginBottom: 8 }}>
          📜 Órdenes del Reino
        </h1>
        <p style={{ textAlign: 'center', color: '#bdbdbd', marginBottom: 28 }}>
          Observa el destino de los visitantes de la Velvet Room...
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {orders.map(o => (
            <motion.div
              key={o.id}
              layout
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="vr-card"
              style={{
                padding: 18,
                borderTop: `3px solid ${statusColor(o.status)}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >

              <div style={{ marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontWeight: 600 }}>Orden #{o.id}</h3>
                <small style={{ color: 'var(--vr-muted)' }}>
                  {new Date(o.created_at).toLocaleString()}
                </small>
              </div>

              <div style={{ marginBottom: 12 }}>
                <strong>👤 {o.user.name}</strong>
                <div style={{ fontSize: '0.9em', color: '#bbb' }}>{o.user.email}</div>

                <div style={{ marginTop: 8 }}>
                  <strong>Total:</strong> ${(o.total_cents / 1000).toFixed(3)}
                </div>

                <div style={{ marginTop: 8 }}>
                  <strong>Estado:</strong>
                  <select
                    className="vr-input"
                    style={{
                      marginLeft: 8,
                      background: statusColor(o.status),
                      borderColor: 'rgba(212,175,55,0.5)',
                      fontWeight: 600,
                    }}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <Link
                href={`/admin/orders/${o.id}`}
                className="vr-btn"
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 'auto',
                  background: 'rgba(212,175,55,0.15)',
                  borderColor: 'rgba(212,175,55,0.4)',
                }}
              >
                Ver detalles →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </RoleGate>
  );
}
