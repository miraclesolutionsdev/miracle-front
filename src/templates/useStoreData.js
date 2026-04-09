import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { productosApi, BASE_URL } from '../utils/api'

/**
 * Shared hook for store data fetching.
 * All templates use this to get productos, tenantNombre, search, etc.
 */
export default function useStoreData(slugProp) {
  const { slug: slugFromParams } = useParams()
  const slug = slugProp || slugFromParams

  const [productos, setProductos] = useState([])
  const [tenantNombre, setTenantNombre] = useState('')
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    if (!slug) return
    fetch(`${BASE_URL}/store-config/info?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.nombre) setTenantNombre(d.nombre) })
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!slug) return
    const fn = productosApi.listarPublico({ estado: 'activo' }, slug)
    fn
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (searchOpen) mobileInputRef.current?.focus()
  }, [searchOpen])

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => p.tipo === 'producto')
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      )
    }
    return lista
  }, [productos, busqueda])

  const totalProductos = productos.filter((p) => p.tipo === 'producto').length
  const enStock = productos.filter((p) => p.tipo === 'producto' && p.stock > 0).length

  return {
    slug,
    productos,
    productosFiltrados,
    tenantNombre,
    loading,
    busqueda,
    setBusqueda,
    searchOpen,
    setSearchOpen,
    mobileInputRef,
    totalProductos,
    enStock,
  }
}
