# Claude Code - Instrucciones para miracle-front

## Principios de Trabajo

### 1. Eficiencia de Tokens
- Usa `Grep` para buscar antes de leer archivos completos
- Lee con `offset` y `limit` en archivos largos
- Evita leer `node_modules`, `dist`, `.git`

### 2. Modificaciones de Código
- No refactorices sin pedir
- No agregues validaciones, manejo de errores, o abstracciones no solicitadas
- Un problema a la vez

### 3. Testing de UI (CRÍTICO)
- Inicia el dev server y prueba en navegador ANTES de reportar como completo
- Prueba golden path + edge cases
- Si no puedes testear la UI, dilo explícitamente — no reportes como "completo"

### 4. Seguridad
- **NUNCA** skipees hooks de git (`--no-verify`)
- **NUNCA** commites archivos `.env`
- Pregunta antes de acciones destructivas

## Stack
- React 19 + React Router DOM 7
- Vite 7 (build tool)
- Tailwind CSS 3
- lucide-react (iconos), SweetAlert2, react-toastify

## Estructura del Proyecto

```
miracle-front/
├── index.html
├── src/
│   ├── App.jsx                  # Router principal (todas las rutas)
│   ├── main.jsx                 # Entry point
│   ├── utils/
│   │   ├── api.js               # Todas las llamadas al backend (clientesApi, productosApi, etc.)
│   │   ├── excel.js             # Import/export Excel de productos
│   │   └── alerts.jsx           # Wrappers de SweetAlert2
│   ├── context/
│   │   ├── AuthContext.jsx      # Auth global, token por tenant en sessionStorage
│   │   ├── CartContext.jsx      # Carrito de compras
│   │   ├── NotificationsContext.jsx
│   │   └── ProductosContext.jsx
│   ├── components/              # Componentes React (vistas y UI)
│   │   ├── DashboardLayout.jsx  # Layout con sidebar para la plataforma
│   │   ├── Sidebar.jsx
│   │   ├── GlobalLogin.jsx      # Login sin tenant (selección de tienda)
│   │   ├── Login.jsx            # Login con tenant
│   │   ├── VistaDashboard.jsx
│   │   ├── VistaProductos.jsx
│   │   ├── VistaClientes.jsx
│   │   ├── VistaCampañas.jsx
│   │   ├── VistaVentas.jsx
│   │   ├── VistaGanancias.jsx
│   │   ├── VistaTienda.jsx
│   │   ├── VistaConfiguracion.jsx
│   │   ├── VistaAudiovisual.jsx
│   │   ├── VistaClipsWhatsApp.jsx
│   │   ├── VistaAdministradores.jsx
│   │   ├── TiendaPage.jsx       # Tienda pública del tenant
│   │   ├── LandingProductoPage.jsx
│   │   ├── MiracleStore.jsx
│   │   └── ...
│   ├── config/                  # Constantes de configuración
│   └── templates/               # Plantillas de tienda por tenant
├── public/
└── dist/                        # Build output (no editar)
```

## Multi-Tenant en el Frontend

### Resolución de tenant
El slug se extrae de la URL: `/{slug}/plataforma`, `/{slug}/tienda`, etc.

```javascript
// src/utils/api.js
export function getTenantSlug() {
  const match = window.location.pathname.match(/^\/([a-z0-9][a-z0-9-]*)\//)
  return match?.[1] ?? null
}
```

### Requests públicos
Deben incluir el header `X-Tenant-Slug`:
```javascript
fetch(`${API_URL}/productos`, {
  headers: { 'X-Tenant-Slug': 'miraclesolutions' }
})
```

### Requests autenticados
El helper `request()` en `api.js` agrega automáticamente:
- `Authorization: Bearer <token>` (desde sessionStorage)
- `X-Tenant-Slug` (desde la URL)

### Token storage
El token se guarda en `sessionStorage` con clave `miracle_auth_{slug}`, por lo que cada tenant tiene su sesión independiente.

## API — Módulos disponibles en `src/utils/api.js`

| Export | Endpoints |
|---|---|
| `clientesApi` | listar, obtener, crear, actualizar |
| `productosApi` | listar, obtener, crear, actualizar, inactivar, imágenes |
| `campanasApi` | listar, obtener, crear, actualizar, eliminar |
| `iaApi` | ángulos, copys, guiones, imágenes, videos Runway |
| `pagosApi` | crearPreferencia |
| `ordenesApi` | listar, obtener, estados, ganancias, tickets |
| `whatsappApi` | leads, conversaciones |
| `authApi` | login, logout, perfil |
| `usersApi` | listar, crear, actualizar, eliminar |
| `storeConfigApi` | dominio, plantilla, info |
| `audiovisualApi` | listar, crear, estado |

Siempre importa desde `../utils/api.js` — no hagas fetch directo en componentes.

## Variables de Entorno

```
VITE_API_URL         # URL del backend (http://localhost:3000 o URL Vercel)
VITE_MAIN_DOMAIN     # Dominio principal (miraclesolutions.com.co)
```

## Rutas del Router (App.jsx)
- `/login` — GlobalLogin (selección de tienda)
- `/:slug/login` — Login de tenant
- `/:slug/plataforma/*` — Dashboard (requiere auth)
- `/:slug/tienda` — Tienda pública
- `/crear-tienda` — Registro de nuevo tenant

## Debugging

### El tenant no se resuelve
1. Verificar que la URL tenga el slug: `/:slug/...`
2. Verificar que `getTenantSlug()` retorne el valor correcto
3. Para requests públicos: pasar `X-Tenant-Slug` manualmente

### Error 401
1. Verificar que el token esté en `sessionStorage` con la clave correcta
2. Verificar que `AuthContext` haya hecho login correctamente
3. El token puede haber expirado — forzar re-login

### CORS
En local el backend debe tener `localhost:5173` en la whitelist de CORS.

## Tenants Actuales
- `miraclesolutions` — Miracle Store
- `venompharma` — Venom Pharma Colombia

## Git
- **NUNCA** `git add .` — usa archivos específicos
- Revisa `git status` y `git diff` antes de commit
- Co-authored: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
