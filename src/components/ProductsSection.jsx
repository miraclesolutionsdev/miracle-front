import SectionCard from './SectionCard'
import { TrendingUp } from 'lucide-react'

const PRODUCTS = [
  { name: 'Pack Social Media', price: '$1,200', stock: 14 },
  { name: 'Video Corporativo', price: '$3,500', stock: 5 },
  { name: 'Campana Google Ads', price: '$800', stock: 22 },
  { name: 'Diseno de Marca', price: '$2,000', stock: 8 },
]

export function ProductsSection() {
  return (
    <SectionCard title="Productos destacados">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <div
            key={p.name}
            className="group flex flex-col justify-between rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/30 hover:bg-accent/40"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{p.name}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-primary">{p.price}</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <p className="text-[11px] text-muted-foreground">
                Stock: {p.stock} unidades
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default ProductsSection
