import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock useAuth to avoid using real context
const loginMock = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: loginMock, user: null, loading: false }),
}));

// Override next/navigation to capture push
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn(), back: jest.fn() }),
}));

// Use the jest.setup mock for sonner
import { toast } from 'sonner';

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    pushMock.mockReset();
    (toast.error as jest.Mock).mockReset?.();
  });

  it('envía credenciales y navega al dashboard', async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'supersecret' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith('test@example.com', 'supersecret'));
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('muestra error cuando las credenciales fallan', async () => {
    loginMock.mockRejectedValueOnce(new Error('invalid'));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(pushMock).not.toHaveBeenCalled();
  });
});
