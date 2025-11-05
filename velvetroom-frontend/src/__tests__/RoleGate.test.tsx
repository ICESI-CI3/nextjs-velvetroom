import React from 'react';
import { render, screen } from '@testing-library/react';
import RoleGate from '@/components/RoleGate';

let authState: any = { user: null, loading: false };
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

describe('RoleGate', () => {
  beforeEach(() => {
    authState = { user: null, loading: false };
  });

  it('muestra contenido público cuando public=true', () => {
    render(
      <RoleGate public>
        <div>Contenido público</div>
      </RoleGate>
    );
    expect(screen.getByText('Contenido público')).toBeInTheDocument();
  });

  it('muestra mensaje de no autenticado si no hay usuario y no es público', () => {
    authState = { user: null, loading: false };
    render(
      <RoleGate>
        <div>Privado</div>
      </RoleGate>
    );
    expect(screen.getByText('La puerta está cerrada...')).toBeInTheDocument();
  });

  it('permite acceso si el rol coincide', () => {
    authState = { user: { role: 'admin', name: 'Admin' }, loading: false };
    render(
      <RoleGate roles={['admin']}>
        <div>Panel admin</div>
      </RoleGate>
    );
    expect(screen.getByText('Panel admin')).toBeInTheDocument();
  });

  it('bloquea acceso si el rol no coincide', () => {
    authState = { user: { role: 'seller', name: 'V' }, loading: false };
    render(
      <RoleGate roles={['admin']}>
        <div>Secreto</div>
      </RoleGate>
    );
    expect(screen.getByText('La sala se desvanece...')).toBeInTheDocument();
  });
});
