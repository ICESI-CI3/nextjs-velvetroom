/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleGateProps {
  children: React.ReactNode;
  roles?: string[];
  public?: boolean;
}

export default function RoleGate({ children, roles, public: isPublic = false }: RoleGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'ok' | 'unauth' | 'forbidden'>('loading');

  useEffect(() => {
    if (loading) return;
    if (isPublic) {
      setState('ok');
      return;
    }
    if (!user) {
      setState('unauth');
      return;
    }
    if (roles && !roles.includes(user.role)) {
      setState('forbidden');
      return;
    }
    setState('ok');
  }, [loading, user, isPublic, roles]);

  if (state === 'loading')
    return (
      <div className="vr-card" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2 className="vr-title">Velvet Room</h2>
        <p>El contrato aún se está materializando...</p>
      </div>
    );

  if (state === 'unauth')
    return (
      <div className="vr-card" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2 className="vr-title">Acceso denegado</h2>
        <p>No has sido invitado al contrato. Por favor inicia sesión.</p>
        <button className="vr-btn" onClick={() => router.push('/login')}>
          Ingresar
        </button>
      </div>
    );

  if (state === 'forbidden')
    return (
      <div className="vr-card" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2 className="vr-title">Prohibido</h2>
        <p>Tu destino no te permite acceder a esta habitación...</p>
        <button className="vr-btn" onClick={() => router.push('/')}>
          Volver al inicio
        </button>
      </div>
    );

  return <>{children}</>;
}
