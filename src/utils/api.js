const BACKEND_VERCEL = 'https://miracle-front-lcdn.vercel.app'
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? BACKEND_VERCEL : 'http://localhost:3000')

function getAuthToken() {
  try {
    const raw = typeof localStorage !== 'undefined' && localStorage.getItem('miracle_auth')
    if (raw) {
      const data = JSON.parse(raw)
      return data?.token || null
    }
  } catch (_) {}
  return null
}

async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText || 'Error en la solicitud')
  return data
}

export const clientesApi = {
  listar: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`clientes${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`clientes/${id}`),
  crear: (body) =>
    request('clientes', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) =>
    request(`clientes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
}

export const productosApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`productos${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`productos/${id}`),
  crear: (body) =>
    request('productos', { method: 'POST', body: JSON.stringify(body) }),
  crearConArchivos: async (formData) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/productos`
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || res.statusText)
    return data
  },
  actualizar: (id, body) =>
    request(`productos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  actualizarConArchivos: async (id, formData) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/productos/${id}`
    const res = await fetch(url, { method: 'PUT', body: formData })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || res.statusText)
    return data
  },
  inactivar: (id) =>
    request(`productos/${id}/inactivar`, { method: 'PATCH' }),
  urlImagen: (productoId, index) =>
    `${BASE_URL.replace(/\/$/, '')}/productos/${productoId}/imagenes/${index}`,
}

export const audiovisualApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`audiovisual${q ? `?${q}` : ''}`)
  },
  crearConArchivo: async (formData) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/audiovisual`
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || res.statusText)
    return data
  },
  actualizarEstado: (id, estado) =>
    request(`audiovisual/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
}

export const campanasApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`campanas${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`campanas/${id}`),
  crear: (body) =>
    request('campanas', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) =>
    request(`campanas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  actualizarEstado: (id, estado) =>
    request(`campanas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
}

export const usersApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`users${q ? `?${q}` : ''}`)
  },
  crear: (body) =>
    request('users', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) =>
    request(`users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  eliminar: (id) => request(`users/${id}`, { method: 'DELETE' }),
}

export const authApi = {
  login: (email, password) =>
    request('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  crearTienda: (body) =>
    request('auth/crear-tienda', { method: 'POST', body: JSON.stringify(body) }),
  actualizarPerfil: (body) =>
    request('auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
  actualizarTenant: (nombre) =>
    request('auth/tenant', { method: 'PATCH', body: JSON.stringify({ nombre }) }),
  cambiarPassword: (contraseñaActual, nuevaContraseña) =>
    request('auth/cambiar-password', {
      method: 'POST',
      body: JSON.stringify({ contraseñaActual, nuevaContraseña }),
    }),
}

export function getProductoImagenSrc(producto, index) {
  const img = producto?.imagenes?.[index]
  if (!img) return null
  if (typeof img === 'string') return img
  if (img.url && (img.url.startsWith('http') || img.url.startsWith('//'))) return img.url
  return productosApi.urlImagen(producto.id, index)
}
