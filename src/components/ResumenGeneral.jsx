import { useState, useEffect } from 'react'
import { Users, Megaphone, Package, Coins, Film, TrendingUp } from 'lucide-react'
import { clientesApi, audiovisualApi, campanasApi } from '../utils/api'
import { useProductos } from '../context/ProductosContext.jsx'

const KPI_CARDS = [
  {
    key: 'clientes',
    label: 'Clientes',
    icon: Users,
    desc: 'Registrados',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    gradient: 'from-blue-500/10 to-transparent',
  },
  {
    key: 'productos',
    label: 'Productos',
    icon: Package,
    desc: 'Catálogo activo',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    gradient: 'from-emerald-500/10 to-transparent',
  },
  {
    key: 'campanas',
    label: 'Campañas',
    icon: Megaphone,
    desc: 'En plataforma',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/20',
    gradient: 'from-violet-500/10 to-transparent',
  },
  {
    key: 'piezas',
    label: 'Piezas',
    icon: Film,
    desc: 'Audiovisuales',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    ring: 'ring-rose-500/20',
    gradient: 'from-rose-500/10 to-transparent',
  },
  {
    key: 'coins',
    label: 'Miracle Coins',
    icon: Coins,
    desc: 'Disponibles',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    gradient: 'from-amber-500/10 to-transparent',
  },
]

export default function ResumenGeneral() {
  const { productos } = useProductos()
  const [totalClientes, setTotalClientes] = useState(null)
  const [totalPiezas, setTotalPiezas] = useState(null)
  const [totalCampanas, setTotalCampanas] = useState(null)

  useEffect(() => {
    let cancelled = false
    clientesApi
      .listar()
      .then((data) => {
        if (!cancelled) setTotalClientes(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => {
        if (!cancelled) setTotalClientes(0)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    audiovisualApi
      .listar()
      .then((data) => {
        if (!cancelled) setTotalPiezas(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => {
        if (!cancelled) setTotalPiezas(0)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    campanasApi
      .listar()
      .then((data) => {
        if (!cancelled) setTotalCampanas(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => {
        if (!cancelled) setTotalCampanas(0)
      })
    return () => { cancelled = true }
  }, [])

  const getValue = (key) => {
    if (key === 'clientes') return totalClientes !== null ? String(totalClientes) : '—'
    if (key === 'productos') return String(productos?.length ?? 0)
    if (key === 'piezas') return totalPiezas !== null ? String(totalPiezas) : '—'
    if (key === 'campanas') return totalCampanas !== null ? String(totalCampanas) : '—'
    if (key === 'coins') return '—'
    return '—'
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {KPI_CARDS.map(({ key, label, icon: Icon, desc, color, bg, ring, gradient }) => (
        <div
          key={key}
          className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/60 hover:shadow-md overflow-hidden"
        >
          {/* Fondo degradado sutil */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          {/* Línea superior */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="relative flex items-start justify-between">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ring-1 ${ring}`}>
              <Icon className={`h-4.5 w-4.5 ${color}`} style={{ width: '1.1rem', height: '1.1rem' }} aria-hidden />
            </div>
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
          </div>

          <div className="relative">
            {getValue(key) === '—' ? (
              <div className="h-8 w-10 animate-pulse rounded-md bg-muted" />
            ) : (
              <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {getValue(key)}
              </p>
            )}
            <p className="mt-0.5 text-[12px] font-medium text-foreground/80">{label}</p>
            <p className="text-[11px] text-muted-foreground/60">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
