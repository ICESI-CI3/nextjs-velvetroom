/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/auth';
import AvatarBadge from '@/components/AvatarBadge';
import { getCart } from '@/services/cart';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const { user, logout, token, setUser } = useAuth();
  const [loadingUser, setLoadingUser] = useState(false);
  const [cartCount, setCartCount] = useState(0);




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

    useEffect(() => {
    if (!user) return;
    getCart().then((cart) => setCartCount(cart.items.length));
    }, [user]);


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
            <Link href="/admin/users" className="vr-btn">👥 Gestionar Usuarios</Link>
            <Link href="/categories" className="vr-btn">🏷 Gestionar Categorías</Link>
            <Link href="/admin/products" className="vr-btn">📦 Gestionar Productos</Link>
            <Link href="/admin/orders" className="vr-btn">💻 Gestionar Ordenes</Link>
            <Link href="/reports" className="vr-btn">📊 Ver Reportes</Link>
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
        <Link
        href="/cart"
        style={{
            position: 'relative',
            textDecoration: 'none'
        }}
        className="vr-btn"
        >
        🛒
        {cartCount > 0 && (
            <span
            style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: 'var(--vr-gold)',
                color: '#111',
                padding: '2px 6px',
                borderRadius: '50%',
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(212,175,55,0.7)',
            }}
            >
            {cartCount}
            </span>
        )}
        </Link>

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
