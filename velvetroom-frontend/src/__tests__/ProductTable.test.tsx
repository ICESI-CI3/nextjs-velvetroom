import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '@/components/ProductTable';

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => (props: any) => props.children || null,
  }),
}));

describe('ProductTable', () => {
  const products = [
    {
      id: 1,
      name: 'Figura Joker',
      price_cents: 150000,
      stock: 2,
      productUrl: '',
      condition: 'new',
      created_at: '2024-09-01T00:00:00Z',
      category: { id: 1, name: 'Figuras' },
      seller: { id: 10, name: 'Vendedor 1', email: 'v1@mail.com' },
    },
  ];

  it('renderiza columnas y elimina', () => {
    const onDelete = jest.fn();

    render(<ProductTable products={products as any} onDelete={onDelete} showSeller />);

    expect(screen.getByText('Figura Joker')).toBeInTheDocument();
    expect(screen.getByText('Vendedor 1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('muestra vacío cuando no hay productos', () => {
    render(<ProductTable products={[]} onDelete={() => {}} />);
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
  });
});
