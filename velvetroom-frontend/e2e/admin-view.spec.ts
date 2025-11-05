import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

const admin = { id: 1, name: 'Admin', email: 'admin@mail.com', role: 'admin' };

async function authAsAdmin(page: any) {
  await page.addInitScript((u) => {
    localStorage.setItem('vr_token', 'fake');
    localStorage.setItem('vr_user', JSON.stringify(u));
  }, admin);
}

test.beforeEach(async ({ page }) => {
  await authAsAdmin(page);

  await page.route(`${API}/users/me`, async (route) => {
    await route.fulfill({ json: admin });
  });

  await page.route(`${API}/categories`, async (route) => {
    await route.fulfill({ json: [ { id: '1', name: 'Figuras' } ] });
  });

  await page.route(`${API}/products`, async (route) => {
    await route.fulfill({ json: [
      { id: 1, name: 'Item A', description: 'x', price_cents: 100000, stock: 1, productUrl: '', condition: 'new', created_at: '2024-01-01', category: { id: '1', name: 'Figuras' }, seller: { id: 10, name: 'Vendedor 1', email: 'v1@mail.com' } },
      { id: 2, name: 'Item B', description: 'y', price_cents: 200000, stock: 2, productUrl: '', condition: 'new', created_at: '2024-01-02', category: { id: '1', name: 'Figuras' }, seller: { id: 11, name: 'Vendedor 2', email: 'v2@mail.com' } },
    ] });
  });
});

test('admin sees seller column', async ({ page }) => {
  await page.goto('/admin/products');
  await expect(page.getByText('Gestor de Productos')).toBeVisible();
  await expect(page.getByText('Vendedor 1')).toBeVisible();
  await expect(page.getByText('Vendedor 2')).toBeVisible();
});
