import { ExternalLink } from 'lucide-react'
import SectionCard from './SectionCard'
import { useAuth } from '../context/AuthContext'

export default function VistaTienda() {
  const { user } = useAuth()
  const tenantNombre = user?.tenantNombre || 'Mi Tienda'
  const abrirTienda = () =>
    window.open(`${window.location.origin}/tienda`, '_blank', 'noopener,noreferrer')

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title={`${tenantNombre} Store`}
        description="Tu tienda pública de productos y servicios."
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            La tienda está activa y es accesible públicamente en{' '}
            <span className="font-mono text-primary">/tienda</span>. Solo se muestran
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
    </div>
  )
}
