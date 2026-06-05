import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { productosApi, storeConfigApi } from '../utils/api'

// slugProp      = slug para construir URLs (null en dominio custom)
// tenantSlugProp = slug real del tenant para los fetches (siempre tiene valor)
export default function useStoreData(slugProp, tenantSlugProp) {
  const { slug: slugFromParams } = useParams()
  const slug = slugProp ?? slugFromParams ?? null
  const tenantSlug = tenantSlugProp || slug

  const [productos, setProductos] = useState([])
  const [storeConfig, setStoreConfig] = useState(null) // toda la config del tenant
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [subcategoriaActiva, setSubcategoriaActiva] = useState('')
  const mobileInputRef = useRef(null)

  // Carga config del tenant y productos en paralelo
  useEffect(() => {
    if (!tenantSlug) return
    setLoading(true)
    Promise.all([
      storeConfigApi.obtenerInfo(tenantSlug).catch(() => null),
      productosApi.listarPublico({ estado: 'activo' }, tenantSlug).catch(() => []),
    ]).then(([config, data]) => {
      if (config) setStoreConfig(config)
      setProductos(Array.isArray(data) ? data : [])
    }).finally(() => setLoading(false))
  }, [tenantSlug])

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
      if (categoriaActiva.toLowerCase() === 'ofertas') {
        lista = lista.filter((p) => p.descuento > 0)
      } else {
        lista = lista.filter((p) => p.categoria === categoriaActiva)
      }
    }
    if (subcategoriaActiva) {
      lista = lista.filter((p) => p.subcategoria === subcategoriaActiva)
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q) ||
        (p.categoria || '').toLowerCase().includes(q) ||
        (p.subcategoria || '').toLowerCase().includes(q) ||
        (Array.isArray(p.caracteristicas) && p.caracteristicas.some((c) => c.toLowerCase().includes(q))) ||
        (Array.isArray(p.especificaciones) && p.especificaciones.some((e) => e.toLowerCase().includes(q)))
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
    // Config completa del tenant — los templates la desestructuran según lo que necesiten
    storeConfig,
    // Atajos de los campos más usados para no romper templates existentes
    tenantNombre:    storeConfig?.nombre || '',
    logoUrl:         storeConfig?.logoUrl || null,
    colorPrimario:   storeConfig?.colorPrimario || null,
    colorSecundario: storeConfig?.colorSecundario || null,
    colorTexto:      storeConfig?.colorTexto || null,
    tagline:         storeConfig?.tagline || null,
    descripcion:     storeConfig?.descripcion || null,
    whatsappContacto: storeConfig?.whatsapp || null,
    instagram:       storeConfig?.instagram || null,
    envioGratis:     storeConfig?.envioGratis || false,
    montoEnvioGratis: storeConfig?.montoEnvioGratis || null,
    // Estado
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
