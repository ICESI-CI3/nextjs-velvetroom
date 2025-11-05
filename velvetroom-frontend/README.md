This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tests

This project includes unit tests (Jest + React Testing Library) and end-to-end tests (Playwright).

### Install dependencies

```powershell
npm install
# Install Playwright browsers (one-time)
npx playwright install
```

### Run unit tests

```powershell
npm run test
```

### Run E2E tests

This will start the Next.js dev server on port 4000 automatically and run Chromium tests.

```powershell
npm run test:e2e
```

Useful variants:

```powershell
# Headed mode for debugging
npm run test:e2e:headed

# UI mode
npm run test:e2e:ui
```

Notes:
- E2E tests mock backend calls by intercepting requests to `http://localhost:3000/api/*`, matching the app's Axios base URL.
- No changes to app code are required to run the tests.

## Guía de pruebas (README en español)

Esta guía explica cómo ejecutar, depurar y extender las pruebas unitarias (Jest) y end-to-end (Playwright) del proyecto.

### Requisitos

- Node.js 18 o superior
- Windows PowerShell (los comandos de ejemplo usan PowerShell)

### Instalación

```powershell
cd velvetroom-frontend
npm install
# Navegadores de Playwright (una sola vez)
npx playwright install
```

### Scripts disponibles

```powershell
# Pruebas unitarias (Jest)
npm run test

# E2E (Playwright)
npm run test:e2e

# Variantes útiles de E2E
npm run test:e2e:headed   # ejecuta con navegador visible
npm run test:e2e:ui       # abre la UI de Playwright Test Runner
npm run test:e2e:debug    # modo debug
```

### Estructura de pruebas

- Unit tests: `src/__tests__/*.test.tsx`
	- `login.test.tsx`, `register.test.tsx`
	- `ProductForm.test.tsx`, `ProductTable.test.tsx`, `ProductList.test.tsx`
	- `AddCartButton.test.tsx`, `RoleGate.test.tsx`
- E2E tests: `e2e/*.spec.ts`
	- `login.spec.ts`, `register.spec.ts`
	- `products-list.spec.ts`
	- `vendor-crud.spec.ts`, `admin-view.spec.ts`
	- `forbidden.spec.ts`, `unauth.spec.ts`

### ¿Qué cubren las pruebas?

- Autenticación: login y registro (feliz y error)
- Catálogo: listado y filtros, ordenamientos básicos
- Vendor: crear, editar y eliminar productos (flujo completo con mocks)
- Admin: visualización de columna de vendedor
- Roles: acceso prohibido para rutas admin si eres seller; mensajes para no autenticados
- UI: formularios y tablas principales (sin modificar código de la app)

### Ejecutar una prueba específica

Jest (unit):
```powershell
npx jest src/__tests__/login.test.tsx
# Por nombre
npx jest -t "registra y redirige a login"
```

Playwright (E2E):
```powershell
npx playwright test e2e\login.spec.ts
```

### Depuración y trazas (Playwright)

- Trazas: por defecto se guardan en reintentos (`trace: on-first-retry`). Para abrir una traza:
```powershell
npx playwright show-trace .\playwright-report\*.zip
```
- UI Runner:
```powershell
npm run test:e2e:ui
```

### Cómo funcionan los mocks E2E

- El cliente Axios usa `http://localhost:3000/api` (ver `src/services/api.ts`).
- Las E2E interceptan ese dominio y devuelven JSON simulado (no requiere backend real).
- Para simular usuarios (admin, seller), se setea `localStorage` al inicio con `vr_token` y `vr_user`.

### Problemas comunes y soluciones

- Puerto 4000 ocupado (el dev server de Next):
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```
- Jest: "jest-environment-jsdom cannot be found":
```powershell
npm i -D jest-environment-jsdom
```
- Jest: "ts-node is required" (si usas `jest.config.ts`):
```powershell
npm i -D ts-node
```
- Playwright no abre navegador:
```powershell
npx playwright install
```

### Consejos para extender pruebas

- Reutiliza la interceptación de rutas (`page.route(...)`) para simular endpoints nuevos.
- En unit tests, mockea `useAuth`, `useCart` y servicios de `src/services/*` con `jest.mock`.
- Mantén los componentes sin modificar; si un selector es ambiguo, usa `getAllByRole` y el índice correcto.

### CI/CD (opcional)

Para pipelines, ejecuta:
```powershell
# Unit
npm ci
npm run test -- --ci

# E2E (headless)
npx playwright install --with-deps
npm run test:e2e
```
