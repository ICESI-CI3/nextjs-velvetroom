import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '@/components/ProductForm';

jest.mock('@/services/categories', () => ({
  getCategories: jest.fn().mockResolvedValue([
    { id: '1', name: 'Figuras' },
    { id: '2', name: 'Videojuegos' },
  ]),
}));

describe('ProductForm', () => {
  it('precarga datos iniciales y envía datos', async () => {
    const onSubmit = jest.fn();

    const initial = {
      name: 'Persona 3 Reload',
      description: 'JRPG',
      price_cents: 250000,
      stock: 5,
      productUrl: 'http://img',
      condition: 'new',
      category: { id: '2', name: 'Videojuegos' },
    };

    render(<ProductForm initialData={initial} onSubmit={onSubmit} submitLabel="Guardar" />);

    // espera categorías
    await screen.findByText('Videojuegos');

    expect((screen.getByPlaceholderText('Nombre del producto') as HTMLInputElement).value).toBe('Persona 3 Reload');

    fireEvent.change(screen.getByPlaceholderText('Nombre del producto'), { target: { value: 'P3R Deluxe' } });
    fireEvent.change(screen.getByPlaceholderText('Precio (en centavos)'), { target: { value: '300000' } });
    fireEvent.change(screen.getByPlaceholderText('Cantidad disponible en inventario'), { target: { value: '3' } });
  // Selecciona la categoría (primer select corresponde a categoryId)
  const [categorySelect] = screen.getAllByRole('combobox');
  fireEvent.change(categorySelect, { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.name).toBe('P3R Deluxe');
    expect(payload.categoryId).toBe('2');
    expect(Number(payload.price_cents)).toBe(300000);
    expect(Number(payload.stock)).toBe(3);
  });
});
