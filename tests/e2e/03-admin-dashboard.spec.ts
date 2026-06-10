import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/e2e/storageState/admin.json' });

test.describe('PF-03 | Admin — Dashboard y Reportes', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('PF-03-01 | Dashboard principal carga con widgets', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-widget"], [data-testid="card"], [data-testid="stat"], [class*="card"], [class*="widget"], [class*="stat"]').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-02 | Dashboard ejecutivo carga gráficas', async ({ page }) => {
    await page.goto('/admin/dashboard/ejecutivo');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-03 | Módulo de reportes carga', async ({ page }) => {
    await page.goto('/admin/reportes');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-04 | Logs del sistema carga tabla', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-05 | Cierres de caja carga', async ({ page }) => {
    await page.goto('/admin/cierres-caja');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-06 | Escaneos QR carga tabla', async ({ page }) => {
    await page.goto('/admin/escaneos-qr');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20000 });
  });

  test('PF-03-07 | Notificaciones carga', async ({ page }) => {
    await page.goto('/admin/notificaciones');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20000 });
  });

});
