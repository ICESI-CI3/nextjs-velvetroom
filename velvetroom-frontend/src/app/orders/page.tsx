/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orders";
import RoleGate from "@/components/RoleGate";
import Link from "next/link";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { getMyOrders().then(setOrders); }, []);

  return (
    <RoleGate roles={["client", "seller", "admin"]}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: "40px auto" }}>
        <h1 className="vr-title" style={{ textAlign: "center" }}>Tus Contratos</h1>

        {orders.length === 0 && (
          <p style={{ textAlign: "center", marginTop: 20 }}>Nada escrito en tu destino aún… 🌙</p>
        )}

        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="vr-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "1.1em" }}>Orden #{o.id}</strong>
                <OrderStatusBadge status={o.status} />
              </div>
              <div style={{ marginTop: 6 }}>
                Total: <strong>${(o.total_cents / 1000).toFixed(3)}</strong>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </RoleGate>
  );
}
