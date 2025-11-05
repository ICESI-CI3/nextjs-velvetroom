# Informe de funcionalidades

Este documento describe las funcionalidades implementadas en el frontend de Velvet Room, y explica cómo están resueltas la autenticación, autorización (control de acceso por roles) y la gestión del estado.

## 1. Resumen ejecutivo

- Framework: Next.js (App Router) + React 19
- Lenguaje: TypeScript
- UI: componentes propios, Tailwind 4 (postcss), framer-motion (animaciones)
- Estado: React Context (AuthContext y CartContext)
- Comunicaciones: Axios con interceptores (`src/services/api.ts`)
- Test: Jest + React Testing Library (unit), Playwright (E2E)

Arquitectura (alto nivel):
- App Router de Next.js (carpeta `src/app`) organiza páginas y rutas anidadas.
- Componentes de UI en `src/components` (tabla, formularios, tarjetas, role gate, navbar, etc.).
- Servicios HTTP en `src/services` (cada dominio con sus funciones: auth, products, cart, orders, users, reports).
- Contextos globales en `src/contexts` (auth y carrito) para estado compartido.
- Estilos globales en `src/app/globals.css`.

## 2. Funcionalidades principales

### 2.1 Autenticación de usuarios

- Registro y Login desde las pantallas:
  - `src/app/register/page.tsx`
  - `src/app/login/page.tsx`
- Persistencia de sesión vía `localStorage`:
  - token: `vr_token`
  - usuario: `vr_user`
- Recuperación de perfil al cargar (si hay token):
  - `getCurrentUser()` en `AuthContext` y en `Navbar`
- Cierre de sesión (logout) y "softLogout" ante 401 en llamadas API.

Piezas clave:
- `src/contexts/AuthContext.tsx`
- `src/services/auth.ts`
- `src/services/api.ts` (interceptores y redirecciones)

### 2.2 Autorización por roles (RBAC)

- Control de acceso en UI vía componente contenedor `RoleGate`:
  - `src/components/RoleGate.tsx`
  - Acepta `roles={[...]}` o `public` para marcar una vista pública.
  - Estados: cargando, no autenticado (unauth), prohibido (forbidden), ok.
- Páginas protegidas por rol:
  - Vendor/Admin: `src/app/my-products/*`, `src/app/admin/products/page.tsx`
  - Admin: `src/app/admin/*`
  - Público: `src/app/products/page.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`
- Redirecciones/avisos para usuarios no autorizados.

### 2.3 Catálogo de productos (búsqueda y filtros)

- Página: `src/app/products/page.tsx`
- Fuentes:
  - Productos: `GET /products`
  - Categorías: `GET /categories`
- Funcionalidad:
  - Búsqueda por texto, filtro por categoría, ordenamientos (precio, stock, nombre).
- Renderizado de tarjetas: `src/components/ProductList.tsx` + `src/components/ProductCard.tsx`.

### 2.4 Gestión de productos (Vendor/Admin)

- Vendor/Admin (mis productos): `src/app/my-products/page.tsx`
  - Lista propios productos (o todos si eres admin)
  - Filtros/ordenamientos, eliminación con confirmación
  - Navegación para crear/editar
- Crear producto: `src/app/my-products/new/page.tsx` + `src/components/ProductForm.tsx`
- Editar producto: `src/app/my-products/[id]/edit/page.tsx` + `ProductForm`
- Admin (todos los productos): `src/app/admin/products/page.tsx` + `ProductTable`
- Servicios asociados: `src/services/products.ts`, `src/services/categories.ts`

### 2.5 Carrito y checkout

- Vista carrito: `src/app/cart/page.tsx`
- Botón de agregado: `src/components/AddCartButton.tsx`
- Estado global del carrito (contador y refresh): `src/contexts/CartContext.tsx`
- Endpoints:
  - `GET /cart`, `POST /cart/items`, `PUT /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart/clear`
- Checkout: crea orden vía `POST /orders` (`src/services/orders.ts`)

### 2.6 Órdenes

- Rutas: `src/app/orders/page.tsx` y `src/app/orders/[id]/page.tsx` (listado/detalle)
- Admin: `src/app/admin/orders/*` (gestión de órdenes)
- Servicios: `src/services/orders.ts`

### 2.7 Usuarios (Admin)

- Gestión de usuarios: `src/app/admin/users/page.tsx`
- Servicios: `src/services/users.ts`

### 2.8 Reportes

- Ruta: `src/app/reports/page.tsx` + secciones `src/app/reports/sections/*`
- Gráficas: `src/lib/chartConfig.ts`
- Exportación PDF: `downloadFullReport()` en `src/services/reports.ts` (usa blob y descarga local)

### 2.9 Navegación y Navbar

- Navbar dinámico por rol: `src/components/Navbar.tsx`
- Badge de carrito: integra `CartContext` y `getCart()` para mostrar cantidad

## 3. Implementación de autenticación

### 3.1 Flujo de login/registro

1. Usuario envía credenciales (email/contraseña) o formulario de registro.
2. `src/services/auth.ts` llama a `/auth/login` o `/auth/register`.
3. En login exitoso: se persiste `vr_token` y `vr_user` en `localStorage` y se actualiza el estado de `AuthContext`.
4. En carga de la app: si hay token, se intenta `getCurrentUser()` para hidratar `user`.

### 3.2 Persistencia y recuperación

- `AuthContext` lee `localStorage` en `useEffect` inicial.
- `Navbar` también verifica/recupera el perfil y asegura `vr_user` en storage.

### 3.3 Interceptores Axios y manejo de errores

- `src/services/api.ts` agrega `Authorization: Bearer <token>` si existe en `localStorage`.
- En respuestas 401:
  - Llama `softLogout()` (limpia storage y dispara evento `auth-logout`).
  - Redirige a `/unauthorized?type=401` (evitando bucles con `isRedirecting`).
- En 403/404:
  - Redirige a `/unauthorized?type=403|404`.

## 4. Implementación de autorización (RBAC)

- Componente `RoleGate` evalúa:
  - Si `public`: render directo.
  - Si no hay `user`: muestra pantalla de no autenticado.
  - Si hay `roles` y no incluye `user.role`: pantalla "forbidden".
  - En otro caso: renderiza `children`.
- Se usa como wrapper en páginas que requieren permisos, p. ej. `my-products`, `admin/products`.

## 5. Gestión del estado

### 5.1 AuthContext

- Estado: `user`, `token`, `loading` y acciones `login`, `register`, `logout`, `setUser`.
- Fuente de verdad: `localStorage` + `/users/me`.
- Eventos:
  - `auth-logout` para notificar logout suave entre componentes.

### 5.2 CartContext

- Estado minimalista: `count` y función `refresh()`.
- `refresh()` sincroniza la cantidad con `GET /cart`.
- Se invoca tras agregar elementos al carrito o al cargar la app con usuario autenticado.

### 5.3 Comentario sobre stores

- La dependencia `zustand` está disponible, pero la gestión actual se resuelve con Context para auth/carrito. No se requiere un store global complejo en el estado actual.

## 6. Servicios y contratos de API (resumen)

- Autenticación: `/auth/register`, `/auth/login`, `/users/me`
- Productos: `/products`, `/products/:id`
- Categorías: `/categories`
- Carrito: `/cart`, `/cart/items`, `/cart/items/:id`, `/cart/clear`
- Órdenes: `/orders`, `/orders/:id`, `/orders/:id/status`
- Usuarios (admin): `/users`, `/users/:id`
- Reportes: `/reports/export/pdf`

Los servicios están en `src/services/*.ts` y comparten el cliente Axios con interceptores.

## 7. Mapa de rutas y roles

Rutas públicas (no requieren sesión):
- `/` Inicio (landing) → `src/app/page.tsx`
- `/products` Catálogo → `src/app/products/page.tsx`
- `/products/[id]` Detalle de producto → `src/app/products/[id]/page.tsx`
- `/login` → `src/app/login/page.tsx`
- `/register` → `src/app/register/page.tsx`
- `/unauthorized` → `src/app/unauthorized/page.tsx`
- `/not-found` → `src/app/not-found/page.tsx` y `src/not-found.tsx`

Rutas con sesión (cualquier rol autenticado: client/seller/admin):
- `/cart` Carrito → `src/app/cart/page.tsx`
- `/orders` Mis órdenes → `src/app/orders/page.tsx`
- `/orders/[id]` Detalle de orden → `src/app/orders/[id]/page.tsx`
- `/profile` Perfil → `src/app/profile/page.tsx`

Rutas Seller/Admin:
- `/my-products` Mis productos → `src/app/my-products/page.tsx`
- `/my-products/new` Crear → `src/app/my-products/new/page.tsx`
- `/my-products/[id]/edit` Editar → `src/app/my-products/[id]/edit/page.tsx`

Rutas Admin:
- `/admin/products` Gestor de productos → `src/app/admin/products/page.tsx`
- `/admin/users` Gestión de usuarios → `src/app/admin/users/page.tsx`
- `/admin/orders` Gestión de órdenes → `src/app/admin/orders/page.tsx`, `src/app/admin/orders/[id]/page.tsx`
- `/reports` Reportes → `src/app/reports/page.tsx` + secciones `src/app/reports/sections/*`

Las protecciones se aplican con `RoleGate` en cada página sensible.

## 8. Flujos clave (cómo funcionan)

1) Login
- UI: `src/app/login/page.tsx` (react-hook-form) → `useAuth().login` → `loginUser()`.
- Éxito: guarda `vr_token`/`vr_user`, redirige a `/dashboard` (o sección principal).
- Error: `toast.error`.

2) Registro
- UI: `src/app/register/page.tsx` → `useAuth().register` → `registerUser()` (incluye `address`).
- Éxito: `toast.success` y redirección a `/login`.
- Error: `toast.error`.

3) Listado/filtros del catálogo
- `src/app/products/page.tsx` llama a `/products` y `/categories`.
- Filtra por texto, categoría y ordena por precio/stock/nombre; render con `ProductList` y `ProductCard`.

4) CRUD de productos (Seller/Admin)
- Lista: `/my-products` (filtra por vendedor si no eres admin; `api.get('/products')`).
- Crear: `/my-products/new` con `ProductForm` (categorías desde `getCategories()` y submit a `createProduct()`).
- Editar: `/my-products/[id]/edit` carga `getProductById()` y envía a `updateProduct()`.
- Eliminar: `deleteProduct()` con confirmación y feedback (`toast`).

5) Carrito y checkout
- `AddCartButton` llama `addToCart(productId, 1)` y luego `CartContext.refresh()` para badge.
- Página `/cart`: muestra ítems, permite actualizar cantidad, eliminar, vaciar (`clearCart`) y finalizar compra (`createOrder`).
- Tras `createOrder` se navega a `/orders`.

6) Admin: productos/usuarios/órdenes
- Admin puede ver y eliminar productos de cualquier vendedor (`showSeller` en `ProductTable`).
- Gestión de usuarios/órdenes vía servicios `users.ts` y `orders.ts`.

## 9. Interceptores, eventos y errores (detallado)

- Request: agrega `Authorization` si hay `vr_token`.
- Response: 401 → `softLogout()` + redirección a `/unauthorized?type=401`; 403/404 → redirecciones equivalentes.
- Eventos: `auth-logout` notifica a consumidores para limpiar estado.
- UX: `sonner` para toasts de éxito/error.

## 7. Manejo de errores y UX

- Notificaciones con `sonner` (éxito, error, warning, info) mockeadas en test unitarios.
- Mensajes de carga y estados vacíos en componentes (por ejemplo, `ProductTable`, `ProductList`, `CartPage`).
 - Confirmaciones (por ejemplo, al eliminar un producto en "Mis productos").

## 10. Pruebas automatizadas (detalle)

Unit (Jest):
- Autenticación: `login.test.tsx`, `register.test.tsx` (mocks de `useAuth`, `sonner`, `next/navigation`).
- Productos UI: `ProductForm.test.tsx` (mocks de categorías y submit), `ProductTable.test.tsx`, `ProductList.test.tsx`.
- Roles: `RoleGate.test.tsx` (muta mock de `useAuth` por caso).
- Carrito: `AddCartButton.test.tsx` (mocks de `useCart` y `addToCart`).

E2E (Playwright):
- `login.spec.ts`, `register.spec.ts`: interceptan `/auth/*`.
- `products-list.spec.ts`: intercepta `/products` y `/categories` y valida filtros.
- `vendor-crud.spec.ts`: flujo completo de seller (crear/editar/eliminar) con interceptores.
- `admin-view.spec.ts`: admin ve columna vendedor.
- `forbidden.spec.ts`: seller bloqueado en `/admin/products`.
- `unauth.spec.ts`: no autenticado en `/my-products`.

Configuración de pruebas:
- Jest: `jest.config.ts` (next/jest, jsdom, setup con mocks común en `jest.setup.ts`).
- Playwright: `playwright.config.ts` (dev server en `:4000`, baseURL, proyecto Chromium).

Ejecución:
```powershell
cd velvetroom-frontend
npm install
npx playwright install
npm run test         # unit
npm run test:e2e     # e2e
```

## 11. Limitaciones actuales y mejoras sugeridas

1) Formularios ingresan números como string (ej.: `price_cents`, `stock` en `ProductForm`). Podría normalizarse antes del submit.
2) `CartPage` tiene una condición `if (err?.response?.status === 401 && err?.response?.status === 403)` que siempre es falsa (AND). Debería ser `||` para capturar cualquiera.
3) Mejorar accesibilidad en selects y botones (labels y nombres accesibles consistentes).
4) Añadir E2E de checkout end-to-end y verificación de órdenes.
5) Añadir CI para ejecutar Jest y Playwright en PRs.
