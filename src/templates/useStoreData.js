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
  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [subcategoriaActiva, setSubcategoriaActiva] = useState('')
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

  const categorias = useMemo(() => {
    const cats = new Set()
    productos.forEach((p) => { if (p.tipo === 'producto' && p.categoria) cats.add(p.categoria) })
    return [...cats].sort()
  }, [productos])

  const categoriaConteo = useMemo(() => {
    const map = {}
    productos.forEach((p) => {
      if (p.tipo === 'producto' && p.categoria) {
        map[p.categoria] = (map[p.categoria] || 0) + 1
      }
    })
    return map
  }, [productos])

  const subcategorias = useMemo(() => {
    const subs = new Set()
    productos.forEach((p) => {
      if (p.tipo === 'producto' && p.subcategoria && (!categoriaActiva || p.categoria === categoriaActiva)) {
        subs.add(p.subcategoria)
      }
    })
    return [...subs].sort()
  }, [productos, categoriaActiva])

  const subcategoriaConteo = useMemo(() => {
    const map = {}
    productos.forEach((p) => {
      if (p.tipo === 'producto' && p.subcategoria && (!categoriaActiva || p.categoria === categoriaActiva)) {
        map[p.subcategoria] = (map[p.subcategoria] || 0) + 1
      }
    })
    return map
  }, [productos, categoriaActiva])

  useEffect(() => { setSubcategoriaActiva('') }, [categoriaActiva])

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => p.tipo === 'producto')
    if (categoriaActiva) {
      lista = lista.filter((p) => p.categoria === categoriaActiva)
    }
    if (subcategoriaActiva) {
      lista = lista.filter((p) => p.subcategoria === subcategoriaActiva)
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      )
    }
    return lista
  }, [productos, busqueda, categoriaActiva, subcategoriaActiva])

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
    categorias,
    categoriaConteo,
    categoriaActiva,
    setCategoriaActiva,
    subcategorias,
    subcategoriaConteo,
    subcategoriaActiva,
    setSubcategoriaActiva,
  }
}
