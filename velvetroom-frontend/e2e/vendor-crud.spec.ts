import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

const vendor = { id: 10, name: 'Vendor', email: 'vendor@mail.com', role: 'seller' };

// Helper to set localStorage before any script runs
async function authAsVendor(page: any) {
  await page.addInitScript((u) => {
    localStorage.setItem('vr_token', 'fake');
    localStorage.setItem('vr_user', JSON.stringify(u));
  }, vendor);
}

test.beforeEach(async ({ page }) => {
  await authAsVendor(page);

  await page.route(`${API}/users/me`, async (route) => {
    await route.fulfill({ json: vendor });
  });

  await page.route(`${API}/categories`, async (route) => {
    await route.fulfill({ json: [
      { id: '1', name: 'Figuras' },
      { id: '2', name: 'Videojuegos' },
    ] });
  });

  // Products list for vendor
  await page.route(`${API}/products`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: [
        { id: 1, name: 'P4G', description: 'JRPG', price_cents: 200000, stock: 4, productUrl: '', condition: 'new', created_at: '2024-01-01', category: { id: '2', name: 'Videojuegos' }, seller: vendor },
      ] });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, json: { id: 2 } });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API}/products/2`, async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({ json: { id: 2 } });
      return;
    }
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: {
        id: 2,
        name: 'New Game', description: 'desc', price_cents: 300000, stock: 3, productUrl: '', condition: 'new', created_at: '2024-01-02', category: { id: '2', name: 'Videojuegos' }, seller: vendor,
      } });
      return;
    }
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
      return;
    }
    await route.continue();
  });
});

test('vendor creates, edits and deletes product', async ({ page }) => {
  await page.goto('/my-products');
  await expect(page.getByText('Mis Productos')).toBeVisible();

  // Create new
  await page.getByRole('link', { name: /nuevo producto/i }).click();
  await expect(page.getByText('Nuevo Producto')).toBeVisible();

  await page.getByPlaceholder('Nombre del producto').fill('New Game');
  await page.getByPlaceholder('Descripción').fill('desc');
  await page.getByPlaceholder('Precio (en centavos)').fill('300000');
  await page.getByPlaceholder('Cantidad disponible en inventario').fill('3');
  await page.getByPlaceholder('URL de imagen (opcional)').fill('http://img');
  await page.getByRole('combobox').first().selectOption('2');
  await page.getByRole('button', { name: /crear producto/i }).click();

  await expect(page).toHaveURL(/my-products/);

  // Edit created product
  await page.route(`${API}/products`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: [
        { id: 2, name: 'New Game', description: 'desc', price_cents: 300000, stock: 3, productUrl: '', condition: 'new', created_at: '2024-01-02', category: { id: '2', name: 'Videojuegos' }, seller: vendor },
      ] });
      return;
    }
    await route.continue();
  });

  await page.goto('/my-products');
  await page.getByRole('link', { name: /editar/i }).click();
  await expect(page.getByText('Editar Producto')).toBeVisible();

  await page.getByPlaceholder('Nombre del producto').fill(' New');
  await page.getByRole('button', { name: /guardar cambios/i }).click();

  await expect(page).toHaveURL(/my-products/);

  // Delete product
  await page.route(`${API}/products`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: [
        { id: 2, name: 'New Game', description: 'desc', price_cents: 300000, stock: 3, productUrl: '', condition: 'new', created_at: '2024-01-02', category: { id: '2', name: 'Videojuegos' }, seller: vendor },
      ] });
      return;
    }
    await route.continue();
  });

  await page.goto('/my-products');

  // Confirm dialog appears; override confirm to always accept
  await page.addInitScript(() => {
    // @ts-ignore
    window.confirm = () => true;
  });

  await page.getByRole('button', { name: /eliminar/i }).click();
  await expect(page.getByText(/no hay productos/i)).toBeVisible();
});
