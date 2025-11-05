import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCartButton from '@/components/AddCartButton';
import { toast } from 'sonner';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, role: 'buyer', name: 'U' } }),
}));

const refreshMock = jest.fn();
jest.mock('@/contexts/CartContext', () => ({
  useCart: () => ({ refresh: refreshMock }),
}));

const addToCartMock = jest.fn();
jest.mock('@/services/cart', () => ({
  addToCart: (...args: any[]) => addToCartMock(...args),
}));

describe('AddCartButton', () => {
  beforeEach(() => {
    refreshMock.mockReset();
    addToCartMock.mockReset();
    (toast.success as jest.Mock).mockReset?.();
    (toast.error as jest.Mock).mockReset?.();
  });

  it('llama addToCart y refresh al hacer click', async () => {
    addToCartMock.mockResolvedValueOnce({});

    render(<AddCartButton productId={99} />);
    fireEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }));

    await waitFor(() => expect(addToCartMock).toHaveBeenCalledWith(99, 1));
    expect(refreshMock).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it('muestra error si el servicio falla', async () => {
    addToCartMock.mockRejectedValueOnce(new Error('fail'));

    render(<AddCartButton productId={99} />);
    fireEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
