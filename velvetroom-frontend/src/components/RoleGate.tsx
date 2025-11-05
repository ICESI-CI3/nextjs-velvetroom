/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
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
  const [state, setState] = useState<'loading' | 'ok' | 'unauth' | 'forbidden' | 'notfound' >('loading');

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
        <h1 className="vr-title">La puerta está cerrada...</h1>
        <p>No posees una llave válida para entrar a esta sala de la Velvet Room.</p>
              <p>
                Intenta <Link href="/login" className="vr-btn">iniciar sesión</Link> o crear una nueva llave celestial.
              </p>
      </div>
    );          
  if (state === 'forbidden')
    return (
      <div className="vr-card" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1 className="vr-title">La sala se desvanece...</h1>
        <p>Tu destino no te permite acceder a esta habitación...</p>
            <p>
              Tal vez tu destino se encuentra en otro camino. <Link href="/" className="vr-btn">Regresa al inicio</Link>
            </p>
      </div>
    );

if (state === 'notfound')
    return (
      <div className="vr-card" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1 className="vr-title">Entrada Desconocida</h1>
        <p>Igor se pregunta, ¿como llegaste aquí?</p>
            <p>
              Puedes volver a una zona segura. <Link href="/" className="vr-btn">Regresar</Link>
            </p>
      </div>
    );
    
  return <>{children}</>;
}
