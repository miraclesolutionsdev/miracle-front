import SectionCard from './SectionCard'
import { TrendingUp } from 'lucide-react'
import { useProductos } from '../context/ProductosContext.jsx'

function formatPrecio(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export function ProductsSection() {
  const { productos } = useProductos()
  const destacados = (productos || []).filter((p) => p.estado !== 'inactivo').slice(0, 4)

  return (
    <SectionCard title="Productos destacados">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {destacados.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
            Aún no hay productos. Crea algunos en la sección Productos.
          </p>
        ) : (
          destacados.map((p) => (
            <div
              key={p.id || p.nombre}
              className="group flex flex-col justify-between rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/30 hover:bg-accent/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{p.nombre || 'Sin nombre'}</p>
                <p className="mt-2 text-xl font-bold tracking-tight text-primary">
                  {formatPrecio(p.precio)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <p className="text-[11px] text-muted-foreground">
                  Stock: {Number(p.stock) ?? 0} unidades
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  )
}

export default ProductsSection
