import { useState } from 'react'
import { ExternalLink, Globe } from 'lucide-react'
import SectionCard from './SectionCard'
import { useAuth } from '../context/AuthContext'
import { getTenantSlug, storeConfigApi } from '../utils/api'

export default function VistaTienda() {
  const { user } = useAuth()
  const tenantNombre = user?.tenantNombre || 'Mi Tienda'
  const slug = getTenantSlug() || user?.tenantSlug

  const [dominio, setDominio] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const abrirTienda = () =>
    window.open(`${window.location.origin}/${slug}/tienda`, '_blank', 'noopener,noreferrer')

  const handleGuardar = async (e) => {
    e.preventDefault()
    setMensaje(null)
    setError(null)
    const val = dominio.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
    if (!val) return
    setGuardando(true)
    try {
      await storeConfigApi.guardarDominio(val)
      setMensaje(`Dominio "${val}" guardado correctamente.`)
      setDominio('')
    } catch (err) {
      setError(err.message || 'Error al guardar el dominio.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title={`${tenantNombre} Store`}
        description="Tu tienda pública de productos y servicios."
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            La tienda está activa y es accesible públicamente en{' '}
            <span className="font-mono text-primary">/{slug}/tienda</span>. Solo se muestran
            los productos marcados como <strong className="text-foreground">activos</strong>.
            Los productos inactivos son visibles únicamente desde esta plataforma.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={abrirTienda}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir tienda
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Dominio personalizado"
        description="Conecta tu propio dominio para que tus clientes accedan directamente a tu tienda."
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si tienes un dominio propio (ej. <span className="font-mono">venompharmacol.com</span>),
            ingrésalo aquí. Asegúrate de que el DNS esté apuntando a Vercel antes de guardarlo.
          </p>

          <form onSubmit={handleGuardar} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={dominio}
                  onChange={(e) => setDominio(e.target.value)}
                  placeholder="tudominio.com"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={guardando || !dominio.trim()}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

            {mensaje && (
              <p className="text-[13px] text-emerald-600">{mensaje}</p>
            )}
            {error && (
              <p className="text-[13px] text-destructive">{error}</p>
            )}
          </form>
        </div>
      </SectionCard>
    </div>
  )
}
