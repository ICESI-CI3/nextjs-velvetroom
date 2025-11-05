import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

test.beforeEach(async ({ page }) => {
  await page.route(`${API}/auth/register`, async (route) => {
    await route.fulfill({ json: { id: 100 } });
  });
});

test('register success navigates to login', async ({ page }) => {
  await page.goto('/register');

  await page.getByPlaceholder('Nombre completo').fill('New User');
  await page.getByPlaceholder('Correo electrónico').fill('new@mail.com');
  await page.getByPlaceholder('Contraseña (mínimo 8 caracteres)').fill('password123');
  await page.getByPlaceholder('Dirección').fill('Street 123');

  await page.getByRole('button', { name: /registrar/i }).click();

  await expect(page).toHaveURL(/login/);
});
