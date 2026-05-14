# miracle-front — Context

## Descripción
Frontend de Miracle Solutions: plataforma de marketing digital y gestión de tienda. Incluye dashboard para administradores, tienda pública por tenant, flujo de pago con MercadoPago y herramientas de IA para creación de contenido.

## Stack
- **Framework:** React 19 + React Router DOM 7
- **Build:** Vite 7
- **Estilos:** Tailwind CSS 3
- **UI:** lucide-react, SweetAlert2, react-toastify
- **Deployment:** Vercel

## Arquitectura Multi-Tenant

El frontend sirve múltiples tenants desde el mismo deploy:
- Rutas con slug: `/{slug}/plataforma`, `/{slug}/tienda`
- Rutas con dominio custom: `venompharmacol.com` → resuelve tenant por hostname
- El slug se extrae de la URL con `getTenantSlug()` en `src/utils/api.js`

## Secciones Principales

### Plataforma (dashboard privado)
Acceso en `/{slug}/plataforma/*`. Requiere JWT. Incluye:
- **VistaDashboard** — métricas generales
- **VistaProductos** — CRUD con importación Excel
- **VistaClientes** — gestión de clientes
- **VistaCampañas** — campañas de marketing con IA
- **VistaVentas / VistaGanancias** — órdenes y finanzas
- **VistaAudiovisual** — generación de videos con Runway
- **VistaClipsWhatsApp** — historial del bot de WhatsApp
- **VistaTienda** — configuración de la tienda pública
- **VistaConfiguracion** — configuración del tenant
- **VistaAdministradores** — gestión de usuarios del tenant

### Tienda pública
Acceso en `/{slug}/tienda` o dominio custom. Pública, sin auth:
- **TiendaPage** — catálogo de productos
- **LandingProductoPage** — detalle de producto + carrito
- **CartPage / CheckoutModal** — carrito y checkout
- **PagoResultado** — resultado del pago MercadoPago

### Registro
- **CrearTienda** — onboarding de nuevo tenant

## Contextos (src/context/)

| Contexto | Propósito |
|---|---|
| `AuthContext` | Token JWT, usuario, tenant activo |
| `CartContext` | Carrito de compras (tienda pública) |
| `NotificationsContext` | Notificaciones en tiempo real |
| `ProductosContext` | Cache de productos del tenant |

## Flujo de Auth

1. Usuario entra a `/login` → `GlobalLogin` → lista de tiendas
2. Selecciona tenant → redirige a `/{slug}/login`
3. Login → JWT guardado en `sessionStorage` con clave `miracle_auth_{slug}`
4. Requests autenticados incluyen automáticamente el Bearer token

## Importación de Productos
`src/utils/excel.js` maneja import/export de catálogo de productos en formato Excel. El script utilitario `scripts/json-to-excel.js` (en la raíz del monorepo) convierte JSON externo al formato compatible.

## Entornos

### Local
- `http://localhost:5173`
- Comando: `npm run dev` (Vite)
- Requiere backend corriendo en `localhost:3000`

### Producción
- Deployado en Vercel
- `VITE_API_URL` apunta a la URL del backend en Vercel
- `VITE_MAIN_DOMAIN=miraclesolutions.com.co`
