/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { motion } from "framer-motion";

export default function SalesReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/sales?top=5').then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ textAlign:"center" }}>Cargando...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800, margin: "0 auto" }}>

      <h2 className="vr-title">Ventas mensuales</h2>
      <div className="vr-card" style={{ marginTop: 16 }}>
        {data.monthly.length === 0 ? (
          <p>No hay ventas registradas.</p>
        ) : data.monthly.map((m:any, i:number)=>(
          <div key={i} className="vr-line">
            {m.month.substring(0,10)} → ${(m.total_cents/1000).toFixed(3)} COP ({m.orders_count} órdenes)
          </div>
        ))}
      </div>

      <h2 className="vr-title" style={{ marginTop: 32 }}>Top productos</h2>
      <div className="vr-card" style={{ marginTop: 16 }}>
        {data.topProducts.map((p:any)=>(
          <div key={p.id} className="vr-line">
            {p.name} — {p.units_sold} uds — ${(p.revenue_cents/1000).toFixed(3)} COP
          </div>
        ))}
      </div>
    </motion.div>
  );
}
