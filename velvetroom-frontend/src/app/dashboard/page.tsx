'use client';
import Protected from '../../components/Protected';

export default function Dashboard() {
  return (
    <Protected>
      <div className="vr-card">
        <h1 className="vr-title">Dashboard</h1>
        <p>Bienvenido a la Velvet Room. Desde aquí accederás a catálogo, categorías y administración.</p>
      </div>
    </Protected>
  );
}
