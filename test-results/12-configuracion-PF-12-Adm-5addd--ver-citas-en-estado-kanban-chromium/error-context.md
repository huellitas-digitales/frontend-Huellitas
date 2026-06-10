# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 12-configuracion.spec.ts >> PF-12 | Admin — Configuración de Clínica >> PF-12-03 | Admin puede ver citas en estado kanban
- Location: tests\e2e\12-configuracion.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1, h2').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1, h2').first()

```

```yaml
- text: Huellitas Vet Panel
- list:
  - listitem:
    - link "Dashboard":
      - /url: /admin/dashboard
  - listitem:
    - link "Dashboard Ejecutivo":
      - /url: /admin/dashboard/ejecutivo
- text: Personal y RRHH
- list:
  - listitem:
    - link "Usuarios y Clientes":
      - /url: /admin/personal/usuarios
  - listitem:
    - link "Roles":
      - /url: /admin/personal/roles
  - listitem:
    - link "Horarios":
      - /url: /admin/horarios
- text: Pacientes y Citas
- list:
  - listitem:
    - link "Mascotas":
      - /url: /admin/mascotas
  - listitem:
    - link "Citas":
      - /url: /admin/citas
- text: Clínica
- list:
  - listitem:
    - link "Supervisión Clínica":
      - /url: /admin/clinica
- text: Inventario
- list:
  - listitem:
    - link "Inventario":
      - /url: /admin/inventario
  - listitem:
    - link "Categorías":
      - /url: /admin/catalogos/categorias
  - listitem:
    - link "Especies":
      - /url: /admin/catalogos/especies
  - listitem:
    - link "Razas":
      - /url: /admin/catalogos/razas
  - listitem:
    - link "Servicios":
      - /url: /admin/catalogos/servicios
  - listitem:
    - link "Vacunas":
      - /url: /admin/catalogos/vacunas
- text: Finanzas y Reportes
- list:
  - listitem:
    - link "Cierres de Caja":
      - /url: /admin/cierres-caja
- text: Sistema
- list:
  - listitem:
    - link "Notificaciones":
      - /url: /admin/notificaciones
  - listitem:
    - link "Escaneos QR":
      - /url: /admin/escaneos-qr
  - listitem:
    - link "Configuración":
      - /url: /admin/configuracion
  - listitem:
    - link "logs del sistema":
      - /url: /admin/logs
- banner:
  - button "Toggle Sidebar"
  - text: Alejandro administrador
  - button "Cambiar tema"
  - button "AP"
- main
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { login } from './helpers/auth';
  3  | 
  4  | test.describe('PF-12 | Admin — Configuración de Clínica', () => {
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await login(page, 'admin');
  8  |   });
  9  | 
  10 |   test('PF-12-01 | Configuración de la clínica carga', async ({ page }) => {
  11 |     await page.goto('/admin/configuracion');
  12 |     await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  13 |   });
  14 | 
  15 |   test('PF-12-02 | Módulo clínico del admin carga', async ({ page }) => {
  16 |     await page.goto('/admin/clinica');
  17 |     await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  18 |   });
  19 | 
  20 |   test('PF-12-03 | Admin puede ver citas en estado kanban', async ({ page }) => {
  21 |     await page.goto('/admin/citas/estado');
> 22 |     await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | 
  25 | });
  26 | 
```