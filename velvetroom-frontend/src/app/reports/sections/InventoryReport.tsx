/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { motion } from "framer-motion";

export default function InventoryReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/inventory').then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ textAlign:"center" }}>Cargando...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800, margin: "0 auto" }}>

      <h2 className="vr-title">Stock Bajo</h2>
      <div className="vr-card" style={{ marginTop: 16 }}>
        {data.lowStock.map((p:any)=>(
          <div key={p.id} className="vr-line">
            {p.name} — Stock: {p.stock}
          </div>
        ))}
      </div>

      <h2 className="vr-title" style={{ marginTop: 32 }}>Categorías más vendidas</h2>
      <div className="vr-card" style={{ marginTop: 16 }}>
        {data.categoriesPopularity.map((c:any)=>(
          <div key={c.category_id} className="vr-line">
            {c.category_name} — {c.units_sold} uds vendidas
          </div>
        ))}
      </div>
    </motion.div>
  );
}
