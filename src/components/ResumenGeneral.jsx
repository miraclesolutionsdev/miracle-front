import { useState, useEffect } from 'react'
import SectionCard from './SectionCard'
import { Users, Megaphone, Package, Coins, Film } from 'lucide-react'
import { clientesApi } from '../utils/api'
import { useProductos } from '../context/ProductosContext.jsx'

const KPI_CARDS = [
  {
    key: 'clientes',
    label: 'Clientes',
    value: null,
    icon: Users,
    desc: 'Clientes registrados',
  },
  {
    key: 'productos',
    label: 'Productos',
    value: null,
    icon: Package,
    desc: 'Productos/servicios',
  },
  {
    key: 'campanas',
    label: 'Campañas',
    value: '2',
    icon: Megaphone,
    desc: 'Campañas en curso',
  },
  {
    key: 'piezas',
    label: 'Piezas Audiovisuales',
    value: '—',
    icon: Film,
    desc: 'Piezas audiovisuales',
  },
  {
    key: 'coins',
    label: 'Miracle Coins',
    value: '4,750',
    icon: Coins,
    desc: 'En circulación',
  },
]

export default function ResumenGeneral() {
  const { productos } = useProductos()
  const [totalClientes, setTotalClientes] = useState(null)

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

  const getValue = (key, fallback) => {
    if (key === 'clientes') return totalClientes !== null ? String(totalClientes) : '—'
    if (key === 'productos') return String(productos?.length ?? 0)
    return fallback
  }

  return (
    <SectionCard title="Vista general">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPI_CARDS.map(({ key, label, value, icon: Icon, desc }) => (
          <div
            key={key}
            className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-xl font-semibold text-card-foreground">{getValue(key, value)}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
