import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/api'
import { getStoreTemplate } from '../templates'
import MiniCart from './MiniCart'

const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

/**
 * Detecta si el usuario entró desde un dominio custom (ej. venompharmacol.com).
 * Si es así, consulta al backend qué tenant le corresponde y renderiza su tienda.
 * Si es un dominio propio (miraclesolutions.com.co), usa el slug de la URL.
 * Carga la plantilla visual según la configuración del tenant.
 */
export default function TiendaPage({ defaultSlug } = {}) {
  const { slug: slugFromUrl } = useParams()
  const navigate = useNavigate()
  const [slug, setSlug] = useState(slugFromUrl || defaultSlug || null)
  const [plantilla, setPlantilla] = useState('luxury')
  const [loading, setLoading] = useState(!slugFromUrl && !defaultSlug)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Miracle Store'
    return () => { document.title = 'Miracle Solutions - Dashboard' }
  }, [])

  useEffect(() => {
    const hostname = window.location.hostname
    const isMainDomain =
      hostname === 'localhost' ||
      hostname === MAIN_DOMAIN ||
      hostname === `www.${MAIN_DOMAIN}`

    // Si el hostname es el dominio principal, el slug viene de la URL o de la prop
    if (isMainDomain) {
      setSlug(slugFromUrl || defaultSlug || null)
      setLoading(false)
      return
    }

    // Hostname custom (ej. venompharmacol.com) — consultar backend
    setLoading(true)
    fetch(`${BASE_URL}/store-config/dominio?hostname=${encodeURIComponent(hostname)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.slug) {
          setSlug(data.slug)
          if (data.plantilla) setPlantilla(data.plantilla)
        } else {
          setError('Tienda no encontrada para este dominio.')
        }
      })
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setLoading(false))
  }, [slugFromUrl, defaultSlug])

  // Fetch plantilla when slug is known (for main domain routes)
  useEffect(() => {
    if (!slug) return
    fetch(`${BASE_URL}/store-config/info?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.plantilla) setPlantilla(d.plantilla) })
      .catch(() => {})
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFFFF' }}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm" style={{ background: '#FFFFFF' }}>
        {error}
      </div>
    )
  }

  if (!slug) return null

  const StoreComponent = getStoreTemplate(plantilla)
  return (
    <>
      <MiniCart position="floating" />
      <StoreComponent slug={slug} />
    </>
  )
}
