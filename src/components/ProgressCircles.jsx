/**
 * Estado del catálogo — reemplaza los círculos de métricas falsas.
 * Porcentajes calculados en tiempo real desde productos reales.
 */
import { useMemo } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import SectionCard from './SectionCard'

function CircleProgress({ value, label, sublabel, stroke }) {
  const radius = 36
  const circ = 2 * Math.PI * radius
  const offset = circ - (Math.min(value, 100) / 100) * circ
  const display = Number.isFinite(value) ? `${Math.round(value)}%` : '—'

  return (
    <div className="flex flex-col items-center gap-2.5">
      <svg width="88" height="88" viewBox="0 0 88 88" aria-label={`${label}: ${display}`} role="img">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={radius}
          fill="none" stroke={stroke} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text
          x="44" y="44"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: stroke, fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
        >
          {display}
        </text>
      </svg>
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  )
}

export function ProgressCircles() {
  const { productos } = useProductos()

  const stats = useMemo(() => {
    const total = productos.length
    const activos = productos.filter((p) => p.estado === 'activo').length
    const fisicos = productos.filter((p) => p.tipo === 'producto')
    const conStock = fisicos.filter((p) => p.stock != null && p.stock > 0).length
    const servicios = productos.filter((p) => p.tipo === 'servicio').length

    return {
      activosPct: total > 0 ? (activos / total) * 100 : 0,
      stockPct: fisicos.length > 0 ? (conStock / fisicos.length) * 100 : 0,
      serviciosPct: total > 0 ? (servicios / total) * 100 : 0,
      activosLabel: total > 0 ? `${activos} de ${total}` : 'Sin productos',
      stockLabel: fisicos.length > 0 ? `${conStock} de ${fisicos.length}` : 'Sin físicos',
      serviciosLabel: `${servicios} en catálogo`,
    }
  }, [productos])

  return (
    <SectionCard title="Estado del catálogo" description="Calculado desde productos reales">
      <div className="flex items-center justify-around py-2">
        <CircleProgress
          value={stats.activosPct}
          label="Activos"
          sublabel={stats.activosLabel}
          stroke="hsl(258,84%,66%)"
        />
        <CircleProgress
          value={stats.stockPct}
          label="Con stock"
          sublabel={stats.stockLabel}
          stroke="hsl(173,58%,44%)"
        />
        <CircleProgress
          value={stats.serviciosPct}
          label="Servicios"
          sublabel={stats.serviciosLabel}
          stroke="hsl(43,80%,62%)"
        />
      </div>
    </SectionCard>
  )
}

export default ProgressCircles
