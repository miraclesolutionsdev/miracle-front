import SectionCard from './SectionCard'
import { Users, Megaphone, Package, Coins } from 'lucide-react'

const KPI_CARDS = [
  {
    key: 'clientes',
    label: 'Total clientes',
    value: '3',
    icon: Users,
    desc: 'Clientes registrados',
  },
  {
    key: 'campanas',
    label: 'Campañas activas',
    value: '2',
    icon: Megaphone,
    desc: 'Campañas en curso',
  },
  {
    key: 'productos',
    label: 'Productos',
    value: '5',
    icon: Package,
    desc: 'Productos/servicios',
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
  return (
    <SectionCard title="Vista general">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-xl font-semibold text-card-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
