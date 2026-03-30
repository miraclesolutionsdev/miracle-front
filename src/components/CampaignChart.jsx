import { useState, useEffect } from 'react'
import { campanasApi } from '../utils/api'
import SectionCard from './SectionCard'

const ESTADOS = [
  { key: 'activa',     label: 'Activas',     color: 'bg-emerald-500' },
  { key: 'pausada',    label: 'Pausadas',    color: 'bg-amber-500' },
  { key: 'borrador',   label: 'Borrador',    color: 'bg-slate-400' },
  { key: 'finalizada', label: 'Finalizadas', color: 'bg-blue-400' },
]

export function CampaignChart() {
  const [campanas, setCampanas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    campanasApi
      .listar()
      .then((data) => setCampanas(Array.isArray(data) ? data : []))
      .catch(() => setCampanas([]))
      .finally(() => setLoading(false))
  }, [])

  const total = campanas.length

  return (
    <SectionCard title="Campañas por estado">
      {loading ? (
        <div className="py-6 text-center text-sm text-muted-foreground">Cargando…</div>
      ) : total === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">Sin campañas registradas.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {ESTADOS.map((e) => {
            const count = campanas.filter((c) => c.estado === e.key).length
            const percent = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={e.key} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-[13px] font-medium text-muted-foreground">
                  {e.label}
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${e.color} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-16 text-right text-[13px] font-semibold tabular-nums text-foreground">
                  {count} ({percent}%)
                </span>
              </div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}

export default CampaignChart
