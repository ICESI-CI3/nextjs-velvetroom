/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import { getOrderById } from "@/services/orders";
import { useParams, useRouter } from "next/navigation";
import RoleGate from "@/components/RoleGate";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { motion } from "framer-motion";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => { getOrderById(Number(id)).then(setOrder); }, [id]);

  if (!order) return <p style={{ textAlign: "center", marginTop: 40 }}>Consultando los hilos del destino… 🔮</p>;

  const total = (order.total_cents / 1000).toFixed(3);

  return (
    <RoleGate roles={["client", "seller", "admin"]}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: "40px auto" }}>

        <button onClick={() => router.back()} className="vr-btn" style={{ marginBottom: 18 }}>
          ← Regresar
        </button>

        <h1 className="vr-title" style={{ textAlign: "center" }}>Orden #{order.id}</h1>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <OrderStatusBadge status={order.status} />
        </div>

        <hr style={{ margin: "20px 0", borderColor: "rgba(212,175,55,0.3)" }} />

        <div style={{ display: "grid", gap: 14 }}>
          {order.items.map((i: any) => (
            <div key={i.id} className="vr-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img
                src={i.product.productUrl || "/no-image.png"}
                width={70}
                height={70}
                style={{ objectFit: "cover", borderRadius: 8 }}
                alt={i.product.name}
              />
              <div style={{ flex: 1 }}>
                <strong>{i.product.name}</strong>
                <div>Cantidad: {i.quantity}</div>
              </div>
              <strong>${(i.subtotal_cents / 1000).toFixed(3)}</strong>
            </div>
          ))}
        </div>

        <h2 className="vr-title" style={{ textAlign: "right", marginTop: 16 }}>
          Total: ${total}
        </h2>
      </motion.div>
    </RoleGate>
  );
}
