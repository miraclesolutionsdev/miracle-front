/**
 * Últimas campañas + Órdenes recientes.
 * Reemplaza los datos hardcodeados con información real de la plataforma.
 */
import { useState, useEffect } from 'react'
import { campanasApi, ordenesApi } from '../utils/api'
import SectionCard from './SectionCard'
import { Clock, ShoppingCart, AlertCircle } from 'lucide-react'

const ESTADO_CAMPANA = {
  activa:     { label: 'Activa',     cls: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20' },
  pausada:    { label: 'Pausada',    cls: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20' },
  borrador:   { label: 'Borrador',   cls: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20' },
  finalizada: { label: 'Finalizada', cls: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20' },
}

const ESTADO_ORDEN = {
  pendiente:   { label: 'Pendiente',   cls: 'bg-amber-500/15 text-amber-400' },
  procesando:  { label: 'Procesando',  cls: 'bg-blue-500/15 text-blue-400' },
  completada:  { label: 'Completada',  cls: 'bg-emerald-500/15 text-emerald-400' },
  entregada:   { label: 'Entregada',   cls: 'bg-emerald-500/15 text-emerald-400' },
  cancelada:   { label: 'Cancelada',   cls: 'bg-red-500/15 text-red-400' },
}

function fmt(v) {
  return `$${(Number(v) || 0).toLocaleString('es-CO')}`
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

function UltimasCampanas() {
  const [campanas, setCampanas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    campanasApi
      .listar()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        setCampanas(sorted.slice(0, 6))
      })
      .catch(() => setCampanas([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionCard title="Últimas campañas" description="Las más recientes de la plataforma">
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : campanas.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">Sin campañas registradas.</p>
          <p className="text-xs text-muted-foreground/60">Crea tu primera campaña en la sección Campañas.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {campanas.map((c) => {
            const estado = ESTADO_CAMPANA[c.estado] ?? { label: c.estado, cls: 'bg-muted text-muted-foreground' }
            return (
              <li
                key={c.id || c._id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-3 py-2.5 transition-colors hover:bg-accent/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.nombre || 'Sin nombre'}</p>
                  {c.producto && (
                    <p className="truncate text-[11px] text-muted-foreground">Producto: {c.producto}</p>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {c.createdAt && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Clock className="h-2.5 w-2.5" />
                      {timeAgo(c.createdAt)}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${estado.cls}`}>
                    {estado.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function OrdenesRecientes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordenesApi
      .listar()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.createdAt || a.fechaCreacion || 0)
          const db = new Date(b.createdAt || b.fechaCreacion || 0)
          return db - da
        })
        setOrdenes(sorted.slice(0, 6))
      })
      .catch(() => setOrdenes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionCard title="Órdenes recientes" description="Últimas compras registradas">
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : ordenes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">Sin órdenes aún.</p>
          <p className="text-xs text-muted-foreground/60">Las compras de tu tienda aparecerán aquí.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordenes.map((o) => {
            const estado = ESTADO_ORDEN[o.estado] ?? { label: o.estado, cls: 'bg-muted text-muted-foreground' }
            const fecha = o.createdAt || o.fechaCreacion
            const nombre = o.clienteNombre || o.cliente?.nombre || 'Cliente'
            const producto = o.productoNombre || o.producto?.nombre || o.nombreProducto || '—'
            return (
              <li
                key={o.id || o._id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-3 py-2.5 transition-colors hover:bg-accent/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{nombre}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{producto}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {o.total != null && (
                    <span className="text-[11px] font-semibold text-primary tabular-nums">
                      {fmt(o.total)}
                    </span>
                  )}
                  {fecha && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Clock className="h-2.5 w-2.5" />
                      {timeAgo(fecha)}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${estado.cls}`}>
                    {estado.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

export function CampaignsRequirements() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <UltimasCampanas />
      <OrdenesRecientes />
    </div>
  )
}

export default CampaignsRequirements
