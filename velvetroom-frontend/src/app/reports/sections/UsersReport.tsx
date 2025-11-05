/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { motion } from "framer-motion";

export default function UsersReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/users').then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ textAlign:"center" }}>Cargando...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 className="vr-title">Nuevos usuarios por mes</h2>
      <div className="vr-card" style={{ marginTop: 16 }}>
        {data.byMonth.map((m:any)=>(
          <div key={m.month} className="vr-line">
            {m.month.substring(0,10)} → {m.users_registered} usuarios
          </div>
        ))}
      </div>
    </motion.div>
  );
}
