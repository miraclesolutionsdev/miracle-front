const BACKEND_FALLBACK = 'http://localhost:3000'

export const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

export function isCustomDomain() {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h !== 'localhost' && h !== MAIN_DOMAIN && h !== `www.${MAIN_DOMAIN}`
}

export const BASE_URL = (() => {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) {
    console.warn('[api] VITE_API_URL no está configurada. Configura la URL del backend en las variables de entorno.')
  }
  return BACKEND_FALLBACK
})()

const getTokenKey = (slug) => `miracle_auth_${slug || getTenantSlugForHeader() || 'default'}`

export function storeToken(token, slug) {
  try { sessionStorage.setItem(getTokenKey(slug), token) } catch { /* noop */ }
}
export function clearToken(slug) {
  try { sessionStorage.removeItem(getTokenKey(slug)) } catch { /* noop */ }
}
function getStoredToken() {
  try {
    const slug = getTenantSlugForHeader()
    return sessionStorage.getItem(getTokenKey(slug))
  } catch { return null }
}

/**
 * Extrae el slug del tenant desde la URL actual.
 * Patrón esperado: /{slug}/plataforma, /{slug}/tienda, /{slug}/login
 * En dominio custom el slug NO está en la URL — usar getTenantSlugForHeader() para requests.
 */
export function getTenantSlug() {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/^\/([a-z0-9][a-z0-9-]*)\//)
  return match?.[1] ?? null
}

/**
 * Obtiene un identificador único para el tenant actual.
 * - Si es dominio custom (vpluxury.co), usa el hostname sin www
 * - Si es slug-based (miraclesolutions.com.co/vpluxury), usa el slug
 * - Fallback a 'default'
 */
export function getTenantIdentifier() {
  if (typeof window === 'undefined') return 'default'
  if (isCustomDomain()) return window.location.hostname.replace(/^www\./, '')
  return getTenantSlug() || 'default'
}

// Cache del slug resuelto para dominio custom.
// Se persiste en sessionStorage para que funcione en cualquier ruta
// sin depender de que TiendaPage haya montado primero.
const _CUSTOM_SLUG_KEY = 'miracle_custom_slug'
let _resolvedCustomSlug = (() => {
  try { return sessionStorage.getItem(_CUSTOM_SLUG_KEY) || null } catch { return null }
})()

export function setResolvedCustomSlug(slug) {
  _resolvedCustomSlug = slug
  try { sessionStorage.setItem(_CUSTOM_SLUG_KEY, slug) } catch {}
}
export function getResolvedCustomSlug() { return _resolvedCustomSlug }

/**
 * Devuelve el valor correcto para el header X-Tenant-Slug:
 * - Dominio custom: usa el slug resuelto (cacheado en sessionStorage)
 * - Dominio principal: usa el slug de la URL
 */
function getTenantSlugForHeader() {
  if (isCustomDomain()) return _resolvedCustomSlug
  return getTenantSlug()
}

function handleUnauthorized() {
  if (typeof window === 'undefined') return
  if (window.location.pathname.includes('/plataforma')) {
    window.location.href = '/login'
  }
}

function translateNetworkError(err) {
  const msg = err?.message || ''
  if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('network') || msg.includes('ERR_CONNECTION')) {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
  }
  throw err
}

async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  const slug = getTenantSlugForHeader()
  const token = getStoredToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(slug ? { 'X-Tenant-Slug': slug } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(url, { ...options, headers, credentials: 'include' }).catch(translateNetworkError)
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    if (data.error) throw new Error(data.error)
    handleUnauthorized()
    throw new Error('Sesión expirada. Inicia sesión de nuevo.')
  }
  if (!res.ok) throw new Error(data.error || res.statusText || 'Error en la solicitud')
  return data
}

async function requestFormData(path, method, formData) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  const slug = getTenantSlugForHeader()
  const token = getStoredToken()
  const headers = {
    ...(slug ? { 'X-Tenant-Slug': slug } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(url, { method, body: formData, headers, credentials: 'include' }).catch(translateNetworkError)
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    if (data.error) throw new Error(data.error)
    handleUnauthorized()
    throw new Error('Sesión expirada. Inicia sesión de nuevo.')
  }
  if (!res.ok) throw new Error(data.error || res.statusText || 'Error en la solicitud')
  return data
}

export const clientesApi = {
  listar: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`clientes${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`clientes/${id}`),
  crear: (body) => request('clientes', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) => request(`clientes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
}

export const productosApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`productos${q ? `?${q}` : ''}`)
  },
  listarPublico: (params, slug) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`productos${q ? `?${q}` : ''}`, { headers: { 'X-Tenant-Slug': slug } })
  },
  obtener: (id) => request(`productos/${id}`),
  obtenerPublico: (id, slug) => request(`productos/${id}`, slug ? { headers: { 'X-Tenant-Slug': slug } } : {}),
  crear: (body) => request('productos', { method: 'POST', body: JSON.stringify(body) }),
  crearConArchivos: (formData) => requestFormData('productos', 'POST', formData),
  actualizar: (id, body) => request(`productos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  actualizarConArchivos: (id, formData) => requestFormData(`productos/${id}`, 'PUT', formData),
  actualizarPrecio: (id, body) => request(`productos/${id}/precio`, { method: 'PATCH', body: JSON.stringify(body) }),
  inactivar: (id) => request(`productos/${id}/inactivar`, { method: 'PATCH' }),
  eliminarImagen: (id, index) => request(`productos/${id}/imagenes/${index}`, { method: 'DELETE' }),
  urlImagen: (productoId, index) =>
    `${BASE_URL.replace(/\/$/, '')}/productos/${productoId}/imagenes/${index}`,
}

export const audiovisualApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`audiovisual${q ? `?${q}` : ''}`)
  },
  crearConArchivo: (formData) => requestFormData('audiovisual', 'POST', formData),
  actualizarEstado: (id, estado) =>
    request(`audiovisual/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
}

export const campanasApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`campanas${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`campanas/${id}`),
  crear: (body) => request('campanas', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) => request(`campanas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  actualizarEstado: (id, estado) =>
    request(`campanas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  eliminar: (id) => request(`campanas/${id}`, { method: 'DELETE' }),
}

export const iaApi = {
  generarAngulos: (payload) =>
    request('ia/angulos', { method: 'POST', body: JSON.stringify(payload) }),
  generarCopys: (payload) =>
    request('ia/copys', { method: 'POST', body: JSON.stringify(payload) }),
  generarGuionDesdeImagen: (payload) =>
    request('ia/guion-imagen', { method: 'POST', body: JSON.stringify({ payload }) }),
  generarCopyDesdeImagen: (payload) =>
    request('ia/copy-desde-imagen', { method: 'POST', body: JSON.stringify(payload) }),
  generarImagen: (payload) =>
    request('ia/generar-imagen', { method: 'POST', body: JSON.stringify(payload) }),
  generarVideoRunway: (payload) =>
    request('ia/generar-video-runway', { method: 'POST', body: JSON.stringify(payload) }),
  obtenerEstadoVideoRunway: (id) => request(`ia/video-runway-estado/${id}`),
  generarVozRunway: (payload) =>
    request('ia/generar-voz-runway', { method: 'POST', body: JSON.stringify(payload) }),
  obtenerEstadoVozRunway: (id) => request(`ia/voz-runway-estado/${id}`),
  obtenerResumen: () => request('ia/resumen'),
  guardarResumen: (payload) =>
    request('ia/resumen', { method: 'PUT', body: JSON.stringify(payload) }),
  limpiarResumen: () => request('ia/resumen', { method: 'DELETE' }),
}

export const usersApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`users${q ? `?${q}` : ''}`)
  },
  crear: (body) => request('users', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) => request(`users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  eliminar: (id) => request(`users/${id}`, { method: 'DELETE' }),
}

export const pagosApi = {
  crearPreferencia: (body) =>
    request('pagos/crear-preferencia', { method: 'POST', body: JSON.stringify(body) }),
}

export const registerApi = {
  registrar: (body) =>
    request('register', { method: 'POST', body: JSON.stringify(body) }),
}

export const storeConfigApi = {
  obtenerInfo: (slug) => {
    const q = slug ? `?slug=${encodeURIComponent(slug)}` : ''
    return request(`store-config/info${q}`)
  },
  guardarInfo: (body) =>
    request('store-config/info', { method: 'PATCH', body: JSON.stringify(body) }),
  guardarPlantilla: (plantilla) =>
    request('store-config/plantilla', { method: 'PATCH', body: JSON.stringify({ plantilla }) }),
  guardarDominio: (dominio) =>
    request('store-config/dominio', { method: 'PATCH', body: JSON.stringify({ dominio }) }),
  resolverPorDominio: (hostname) =>
    request(`store-config/dominio?hostname=${encodeURIComponent(hostname)}`),
}

export const authApi = {
  loginGlobal: (email, password) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/auth/login-global`
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')
        return data
      })
  },
  login: (email, password) =>
    request('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('auth/logout', { method: 'POST' }),
  obtenerPerfil: () => request('auth/me'),
  actualizarPerfil: (body) =>
    request('auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
  cambiarPassword: (contraseñaActual, nuevaContraseña) =>
    request('auth/cambiar-password', {
      method: 'POST',
      body: JSON.stringify({ contraseñaActual, nuevaContraseña }),
    }),
}

export const whatsappApi = {
  // LEGACY: Consulta directa a API de ElevenLabs (mantener por compatibilidad)
  listarConversaciones: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`whatsapp/conversaciones${q ? `?${q}` : ''}`)
  },
  obtenerConversacion: (id) => request(`whatsapp/conversaciones/${id}`),

  // NUEVO: Consulta desde BD local (recomendado)
  listarLeads: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`whatsapp/leads${q ? `?${q}` : ''}`)
  },
  obtenerLead: (id) => request(`whatsapp/leads/${id}`),
  actualizarLead: (id, body) => request(`whatsapp/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

export const ordenesApi = {
  listar: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`ordenes${query ? `?${query}` : ''}`)
  },
  obtener: (id) => request(`ordenes/${id}`),
  obtenerGanancias: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`ordenes/ganancias/resumen${query ? `?${query}` : ''}`)
  },
  crear: (body) =>
    request('ordenes', { method: 'POST', body: JSON.stringify(body) }),
  actualizarEstado: (id, nuevoEstado, notas) =>
    request(`ordenes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ nuevoEstado, notas }),
    }),
  cancelar: (id, motivo) =>
    request(`ordenes/${id}/cancelar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    }),
  crearTicket: (id, ticket) =>
    request(`ordenes/${id}/tickets`, {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),
  actualizarPreparacion: (id, estadoPreparacion) =>
    request(`ordenes/${id}/preparacion`, {
      method: 'PATCH',
      body: JSON.stringify({ estadoPreparacion }),
    }),
  actualizarPago: (id, estadoPago) =>
    request(`ordenes/${id}/pago`, {
      method: 'PATCH',
      body: JSON.stringify({ estadoPago }),
    }),
  verificarPago: (id) =>
    request(`ordenes/${id}/verificar-pago`, { method: 'POST' }),
}

export const articulosApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`articulos${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`articulos/${id}`),
  crear: (formData) => requestFormData('articulos', 'POST', formData),
  actualizar: (id, formData) => requestFormData(`articulos/${id}`, 'PUT', formData),
  eliminar: (id) => request(`articulos/${id}`, { method: 'DELETE' }),
}

export function getProductoImagenSrc(producto, index) {
  const img = producto?.imagenes?.[index]
  if (!img) return null
  if (typeof img === 'string') return img
  if (img.url && (img.url.startsWith('http') || img.url.startsWith('//'))) return img.url
  return productosApi.urlImagen(producto.id, index)
}
