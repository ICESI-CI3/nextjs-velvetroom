import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductList from '@/components/ProductList';

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => (props: any) => props.children || null }),
}));

describe('ProductList', () => {
  it('muestra mensaje vacío si no hay productos', () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });

  it('renderiza tarjetas si hay productos', () => {
    const items = [
      { id: 1, name: 'Item', price_cents: 1000, productUrl: '', category: { id: 1, name: 'Cat' } },
    ];
    render(<ProductList products={items as any} />);
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});
