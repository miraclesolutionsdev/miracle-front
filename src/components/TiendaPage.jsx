import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MiracleStore from './MiracleStore'
import { BASE_URL } from '../utils/api'

const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

/**
 * Detecta si el usuario entró desde un dominio custom (ej. venompharmacol.com).
 * Si es así, consulta al backend qué tenant le corresponde y renderiza su tienda.
 * Si es un dominio propio (miraclesolutions.com.co), usa el slug de la URL.
 */
export default function TiendaPage({ defaultSlug } = {}) {
  const { slug: slugFromUrl } = useParams()
  const navigate = useNavigate()
  const [slug, setSlug] = useState(slugFromUrl || defaultSlug || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const hostname = window.location.hostname
    const isMainDomain =
      hostname === 'localhost' ||
      hostname === MAIN_DOMAIN ||
      hostname === `www.${MAIN_DOMAIN}`

    // Si el hostname es el dominio principal, el slug viene de la URL o de la prop
    if (isMainDomain) {
      setSlug(slugFromUrl || defaultSlug || null)
      return
    }

    // Hostname custom (ej. venompharmacol.com) — consultar backend
    setLoading(true)
    fetch(`${BASE_URL}/store-config/dominio?hostname=${encodeURIComponent(hostname)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.slug) {
          setSlug(data.slug)
        } else {
          setError('Tienda no encontrada para este dominio.')
        }
      })
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setLoading(false))
  }, [slugFromUrl, defaultSlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        {error}
      </div>
    )
  }

  useEffect(() => {
    document.title = 'Miracle Store'
    return () => { document.title = 'Miracle Solutions - Dashboard' }
  }, [])

  if (!slug) return null

  return <MiracleStore slug={slug} />
}
