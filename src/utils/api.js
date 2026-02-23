// URL del backend en producción (Vercel). Sobrescribir con VITE_API_URL en .env si el backend está en otra URL.
const BACKEND_VERCEL = 'https://miracle-front-lcdn.vercel.app'
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? BACKEND_VERCEL : 'http://localhost:3000')

async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
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
  obtenerPresignedUrl: (body) =>
    request('audiovisual/presigned-url', { method: 'POST', body: JSON.stringify(body) }),
  confirmarSubida: (body) =>
    request('audiovisual/confirmar', { method: 'POST', body: JSON.stringify(body) }),
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

export function getProductoImagenSrc(producto, index) {
  const img = producto?.imagenes?.[index]
  if (!img) return null
  if (typeof img === 'string') return img
  if (img.url && (img.url.startsWith('http') || img.url.startsWith('//'))) return img.url
  return productosApi.urlImagen(producto.id, index)
}
