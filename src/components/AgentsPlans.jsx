/**
 * Audiovisuales recientes — reemplaza los planes de agentes hardcodeados.
 * Muestra las últimas piezas cargadas en la plataforma.
 */
import { useState, useEffect } from 'react'
import { audiovisualApi } from '../utils/api'
import SectionCard from './SectionCard'
import { Film, Image, Music, FileVideo, AlertCircle, Clock } from 'lucide-react'

const TIPO_CONFIG = {
  video:  { label: 'Video',  Icon: FileVideo, cls: 'bg-violet-500/15 text-violet-400' },
  imagen: { label: 'Imagen', Icon: Image,     cls: 'bg-rose-500/15 text-rose-400' },
  audio:  { label: 'Audio',  Icon: Music,     cls: 'bg-blue-500/15 text-blue-400' },
}

const ESTADO_CONFIG = {
  listo:      { label: 'Listo',      cls: 'bg-emerald-500/15 text-emerald-400' },
  pendiente:  { label: 'Pendiente',  cls: 'bg-amber-500/15 text-amber-400' },
  revisión:   { label: 'Revisión',   cls: 'bg-blue-500/15 text-blue-400' },
  revision:   { label: 'Revisión',   cls: 'bg-blue-500/15 text-blue-400' },
  rechazado:  { label: 'Rechazado',  cls: 'bg-red-500/15 text-red-400' },
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

export function AgentsPlans() {
  const [piezas, setPiezas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    audiovisualApi
      .listar()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt || b.fechaCreacion || 0) - new Date(a.createdAt || a.fechaCreacion || 0)
        )
        setPiezas(sorted.slice(0, 8))
      })
      .catch(() => setPiezas([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionCard title="Audiovisuales recientes" description="Últimas piezas cargadas en la plataforma">
      {loading ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : piezas.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Film className="h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">Sin piezas audiovisuales aún.</p>
          <p className="text-xs text-muted-foreground/60">
            Sube imágenes, videos o audios en la sección Audiovisual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {piezas.map((pieza) => {
            const tipo = TIPO_CONFIG[pieza.tipo] ?? { label: pieza.tipo ?? 'Archivo', Icon: Film, cls: 'bg-muted text-muted-foreground' }
            const estado = ESTADO_CONFIG[pieza.estado] ?? { label: pieza.estado ?? '', cls: 'bg-muted text-muted-foreground' }
            const { Icon } = tipo
            const fecha = pieza.createdAt || pieza.fechaCreacion

            return (
              <div
                key={pieza.id || pieza._id}
                className="group flex flex-col gap-2 rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tipo.cls}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {pieza.estado && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${estado.cls}`}>
                      {estado.label}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground leading-tight">
                    {pieza.nombre || pieza.titulo || pieza.descripcion?.slice(0, 30) || 'Sin nombre'}
                  </p>
                  {pieza.campana && (
                    <p className="truncate text-[10px] text-muted-foreground">{pieza.campana}</p>
                  )}
                </div>
                {fecha && (
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Clock className="h-2.5 w-2.5" />
                    {timeAgo(fecha)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}

export default AgentsPlans
