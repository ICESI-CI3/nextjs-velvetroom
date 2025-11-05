import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

test.beforeEach(async ({ page }) => {
  await page.route(`${API}/products`, async (route) => {
    await route.fulfill({ json: [
      { id: 1, name: 'Joker Figure', description: 'P5', price_cents: 120000, stock: 5, productUrl: '', condition: 'new', created_at: '2024-01-01', category: { id: '1', name: 'Figuras' } },
      { id: 2, name: 'Persona 3', description: 'JRPG', price_cents: 250000, stock: 2, productUrl: '', condition: 'new', created_at: '2024-01-02', category: { id: '2', name: 'Videojuegos' } },
    ] });
  });
  await page.route(`${API}/categories`, async (route) => {
    await route.fulfill({ json: [ { id: '1', name: 'Figuras' }, { id: '2', name: 'Videojuegos' } ] });
  });
});

test('lista y filtra productos', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByText('Catálogo de Productos')).toBeVisible();

  await expect(page.getByText('Joker Figure')).toBeVisible();
  await expect(page.getByText('Persona 3')).toBeVisible();

  // Filtrar por texto
  await page.getByPlaceholder('Buscar producto...').fill('Joker');
  await expect(page.getByText('Joker Figure')).toBeVisible();
  await expect(page.getByText('Persona 3')).not.toBeVisible();

  // Reset filtro
  await page.getByPlaceholder('Buscar producto...').fill('');

  // Ordenar por precio descendente
  await page.getByRole('combobox').nth(1).selectOption('Figuras');
  await page.getByRole('combobox').nth(2).selectOption('price_desc');

  // Solo validar que siguen visibles tras ordenar/filtrar
  await expect(page.getByText('Joker Figure')).toBeVisible();
});
