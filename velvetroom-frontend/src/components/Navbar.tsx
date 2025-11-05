/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/auth';
import AvatarBadge from '@/components/AvatarBadge';

export default function Navbar() {
  const { user, logout, token, setUser } = useAuth();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        setLoadingUser(true);
        try {
          const me = await getCurrentUser();
          setUser(me);
          localStorage.setItem('vr_user', JSON.stringify(me)); // 🔄 asegurar persistencia
        } catch (err) {
          console.error('Error obteniendo perfil:', err);
        } finally {
          setLoadingUser(false);
        }
      }
    };
    fetchUser();
  }, [token]);

  const renderLinks = () => {
    if (!user)
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/login" className="vr-btn">Iniciar sesión</Link>
          <Link href="/register" className="vr-btn">Registrarse</Link>
        </div>
      );

    switch (user.role) {
      case 'admin':
        return (
          <>
            <Link href="/users" className="vr-btn">👥 Usuarios</Link>
            <Link href="/categories" className="vr-btn">🏷 Categorías</Link>
            <Link href="/products" className="vr-btn">📦 Productos</Link>
            <Link href="/reports" className="vr-btn">📊 Reportes</Link>
          </>
        );
      case 'seller':
        return (
          <>
            <Link href="/my-products" className="vr-btn">📦 Mis productos</Link>
            <Link href="/orders" className="vr-btn">🛒 Órdenes</Link>
          </>
        );
      default:
        return (
          <>
            <Link href="/products" className="vr-btn">🛍 Productos</Link>
            <Link href="/orders" className="vr-btn">🧾 Mis pedidos</Link>
            <Link href="/payments" className="vr-btn">💳 Pagos</Link>
          </>
        );
    }
  };

  return (
    <nav
      className="vr-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 className="vr-title" style={{ margin: 0 }}>Velvet Room</h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {renderLinks()}
      </div>

      {user && !loadingUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AvatarBadge
            name={user.name}
            avatarUrl={user.avatarUrl}
            role={user.role}
            size={35}
          />
          <span style={{ color: 'var(--vr-gold)', fontWeight: 600 }}>
            {user.name || user.email}
          </span>
          <Link href="/profile" className="vr-btn" style={{ borderColor: 'rgba(212,175,55,0.6)' }}>
            Perfil
          </Link>
          <button
            onClick={logout}
            className="vr-btn"
            style={{
              background: 'rgba(226,77,77,0.2)',
              borderColor: 'rgba(226,77,77,0.5)',
            }}
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}
