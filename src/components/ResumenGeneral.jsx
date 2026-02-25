import { useState, useEffect } from 'react'
import { Users, Megaphone, Package, Coins, Film } from 'lucide-react'
import { clientesApi, audiovisualApi, campanasApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useProductos } from '../context/ProductosContext.jsx'

const KPI_CARDS = [
  {
    key: 'clientes',
    label: 'Clientes',
    icon: Users,
    desc: 'Clientes registrados',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'productos',
    label: 'Productos',
    icon: Package,
    desc: 'Productos/servicios',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    key: 'campanas',
    label: 'Campañas',
    icon: Megaphone,
    desc: 'Campañas en curso',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    key: 'piezas',
    label: 'Piezas Audiovisuales',
    icon: Film,
    desc: 'Piezas audiovisuales',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  {
    key: 'coins',
    label: 'Miracle Coins',
    icon: Coins,
    desc: 'En circulación',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
]

export default function ResumenGeneral() {
  const { user } = useAuth()
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
  }, [user?.tenantId])

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
  }, [user?.tenantId])

  useEffect(() => {
    if (!user?.tenantId) {
      setTotalCampanas(null)
      return
    }
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
  }, [user?.tenantId])

  const getValue = (key) => {
    if (key === 'clientes') return totalClientes !== null ? String(totalClientes) : '--'
    if (key === 'productos') return String(productos?.length ?? 0)
    if (key === 'piezas') return totalPiezas !== null ? String(totalPiezas) : '--'
    if (key === 'campanas') return totalCampanas !== null ? String(totalCampanas) : '--'
    if (key === 'coins') return '--'
    return '--'
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {KPI_CARDS.map(({ key, label, icon: Icon, desc, color, bg }) => (
        <div
          key={key}
          className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30"
        >
          <div className={`rounded-lg p-2.5 ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground">{getValue(key)}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
