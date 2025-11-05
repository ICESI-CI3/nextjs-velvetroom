import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

const seller = { id: 2, name: 'Seller', email: 's@mail.com', role: 'seller' };

async function authAsSeller(page: any) {
  await page.addInitScript((u) => {
    localStorage.setItem('vr_token', 'fake');
    localStorage.setItem('vr_user', JSON.stringify(u));
  }, seller);
}

test.beforeEach(async ({ page }) => {
  await authAsSeller(page);
  await page.route(`${API}/users/me`, async (route) => route.fulfill({ json: seller }));
});

test('seller no puede ver /admin/products', async ({ page }) => {
  await page.goto('/admin/products');
  await expect(page.getByText('La sala se desvanece...')).toBeVisible();
});
