import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';

const registerMock = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ register: registerMock, user: null, loading: false }),
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn(), back: jest.fn() }),
}));

import { toast } from 'sonner';

describe('RegisterPage', () => {
  beforeEach(() => {
    registerMock.mockReset();
    pushMock.mockReset();
    (toast.success as jest.Mock).mockReset?.();
    (toast.error as jest.Mock).mockReset?.();
  });

  it('registra y redirige a login', async () => {
    registerMock.mockResolvedValueOnce(undefined);

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña (mínimo 8 caracteres)'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), { target: { value: 'Calle 123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => expect(registerMock).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('muestra error si falla el registro', async () => {
    registerMock.mockRejectedValueOnce(new Error('fail'));

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña (mínimo 8 caracteres)'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Dirección'), { target: { value: 'Calle 123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
