const BACKEND_FALLBACK = 'http://localhost:3000'

export const BASE_URL = (() => {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) {
    console.warn('[api] VITE_API_URL no está configurada. Configura la URL del backend en las variables de entorno.')
  }
  return BACKEND_FALLBACK
})()

const getTokenKey = (slug) => `miracle_auth_${slug || getTenantSlug()}`

export function storeToken(token, slug) {
  try { sessionStorage.setItem(getTokenKey(slug), token) } catch { /* noop */ }
}
export function clearToken(slug) {
  try { sessionStorage.removeItem(getTokenKey(slug)) } catch { /* noop */ }
}
function getStoredToken() {
  try { return sessionStorage.getItem(getTokenKey()) } catch { return null }
}

/**
 * Extrae el slug del tenant desde la URL actual.
 * Patrón esperado: /{slug}/plataforma, /{slug}/tienda, /{slug}/login
 * Retorna null si la URL no tiene slug (ej. /login, /crear-tienda).
 */
export function getTenantSlug() {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/^\/([a-z0-9][a-z0-9-]*)\//)
  return match?.[1] ?? null
}

/**
 * Obtiene un identificador único para el tenant actual.
 * - Si es dominio custom (venompharmacol.com), usa el hostname
 * - Si es slug-based (miraclesolutions.com.co/venompharma), usa el slug
 * - Fallback a 'default'
 */
export function getTenantIdentifier() {
  if (typeof window === 'undefined') return 'default'

  const hostname = window.location.hostname
  const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

  // Si es dominio custom, usar el hostname completo
  if (hostname !== 'localhost' && hostname !== MAIN_DOMAIN && hostname !== `www.${MAIN_DOMAIN}`) {
    return hostname.replace(/^www\./, '')
  }

  // Si es slug-based, usar el slug de la URL
  const slug = getTenantSlug()
  return slug || 'default'
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
  const slug = getTenantSlug()
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
  const slug = getTenantSlug()
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
  guardarDominio: (dominio) =>
    request('store-config/dominio', { method: 'PATCH', body: JSON.stringify({ dominio }) }),
  guardarPlantilla: (plantilla) =>
    request('store-config/plantilla', { method: 'PATCH', body: JSON.stringify({ plantilla }) }),
  obtenerInfo: () => request('store-config/info'),
  resolverPorDominio: (hostname) => request(`store-config/dominio?hostname=${encodeURIComponent(hostname)}`),
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

export function getProductoImagenSrc(producto, index) {
  const img = producto?.imagenes?.[index]
  if (!img) return null
  if (typeof img === 'string') return img
  if (img.url && (img.url.startsWith('http') || img.url.startsWith('//'))) return img.url
  return productosApi.urlImagen(producto.id, index)
}
