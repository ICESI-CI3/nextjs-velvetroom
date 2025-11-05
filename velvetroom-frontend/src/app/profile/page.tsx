'use client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import RoleGate from '@/components/RoleGate';
import AvatarBadge from '@/components/AvatarBadge';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div
        className="vr-card"
        style={{ maxWidth: 500, margin: '40px auto', padding: 24, textAlign: 'center' }}
      >
        <h2 className="vr-title">Velvet Room</h2>
        <p>El contrato aún se está materializando...</p>
      </div>
    );

  return (
    <RoleGate>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="vr-card"
        style={{
          maxWidth: 520,
          margin: '40px auto',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <AvatarBadge
          name={user?.name}
          avatarUrl={user?.avatarUrl}
          role={user?.role}
          size={80}
        />
        <h1 className="vr-title" style={{ marginTop: 12 }}>
          Tu Perfil
        </h1>

        <div style={{ display: 'grid', gap: 10, marginTop: 20, textAlign: 'left' }}>
          <div><strong>Nombre:</strong> {user?.name}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Dirección:</strong> {user?.address || 'No registrada'}</div>
          <div><strong>Rol:</strong> {user?.role}</div>
        </div>
      </motion.div>
    </RoleGate>
  );
}
