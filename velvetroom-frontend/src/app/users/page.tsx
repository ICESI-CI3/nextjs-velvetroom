import RoleGate from '@/components/RoleGate';

export default function UsersPage() {
  return (
    <RoleGate roles={['admin']}>
      <div className="vr-card" style={{ marginTop: 20 }}>
        <h1 className="vr-title">Gestión de usuarios</h1>
        <p>Solo visible para administradores.</p>
      </div>
    </RoleGate>
  );
}
