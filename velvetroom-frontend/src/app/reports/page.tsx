'use client';
import { useState } from "react";
import RoleGate from "@/components/RoleGate";
import SalesReport from "./sections/SalesReport";
import InventoryReport from "./sections/InventoryReport";
import UsersReport from "./sections/UsersReport";
import { button } from "motion/react-client";

export default function ReportsPage() {
  const [tab, setTab] = useState<'sales' | 'inventory' | 'users'>('sales');

  return (
    <RoleGate roles={['admin', 'seller']}>
      <div style={{ padding: 32 }}>
        <h1 className="vr-title" style={{ textAlign: 'center' }}>📊 Reportes</h1>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button className="vr-btn" onClick={() => setTab('sales')}>
            Ventas
          </button>
          <button className="vr-btn" onClick={() => setTab('inventory')}>
            Inventario
          </button>

          {/* Solo los admins ven este */}
          <RoleGate roles={['admin']}>
            <button className="vr-btn" onClick={() => setTab('users')}>
              Usuarios
            </button>
          </RoleGate>
        </div>

        <div style={{ marginTop: 40 }}>
          {tab === 'sales' && <SalesReport />}
          {tab === 'inventory' && <InventoryReport />}
          {tab === 'users' && <UsersReport />}
        </div>
      </div>
    </RoleGate>
  );
}
