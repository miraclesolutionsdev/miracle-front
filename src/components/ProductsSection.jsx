import SectionCard from './SectionCard'

const PRODUCTS = [
  { name: 'Pack Social Media', price: '$1,200', stock: 14 },
  { name: 'Video Corporativo', price: '$3,500', stock: 5 },
  { name: 'Campana Google Ads', price: '$800', stock: 22 },
  { name: 'Diseno de Marca', price: '$2,000', stock: 8 },
]

export function ProductsSection() {
  return (
    <SectionCard title="Productos">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <div
            key={p.name}
            className="rounded-lg border border-border bg-muted/40 p-4"
          >
            <p className="text-sm font-medium text-card-foreground">{p.name}</p>
            <p className="mt-1 text-xl font-bold text-primary">{p.price}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Stock: {p.stock} unidades
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default ProductsSection
