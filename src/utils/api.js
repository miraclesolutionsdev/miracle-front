const BACKEND_VERCEL = 'https://miracle-front-lcdn.vercel.app'
const BASE_URL =
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
  inactivar: (id) =>
    request(`clientes/${id}/inactivar`, { method: 'PATCH' }),
}

export const productosApi = {
  listar: (params) => {
    const q = new URLSearchParams(params || {}).toString()
    return request(`productos${q ? `?${q}` : ''}`)
  },
  obtener: (id) => request(`productos/${id}`),
  crear: (body) =>
    request('productos', { method: 'POST', body: JSON.stringify(body) }),
  actualizar: (id, body) =>
    request(`productos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  inactivar: (id) =>
    request(`productos/${id}/inactivar`, { method: 'PATCH' }),
}
