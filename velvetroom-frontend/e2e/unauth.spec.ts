import { test, expect } from '@playwright/test';

test('no autenticado ve mensaje en /my-products', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('vr_token');
    localStorage.removeItem('vr_user');
  });

  await page.goto('/my-products');
  await expect(page.getByText('La puerta está cerrada...')).toBeVisible();
});
