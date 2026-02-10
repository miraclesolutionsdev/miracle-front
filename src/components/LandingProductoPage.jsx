import { useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'

function LandingProductoPage() {
  const { id } = useParams()
  const { findProductoById } = useProductos()

  const producto = findProductoById(id)

  if (!producto) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-10">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">
              {producto.nombre}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {producto.clienteNombre ? `${producto.clienteNombre} · ` : ''}
              {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
            </p>
          </div>
          {producto.precio && (
            <p className="text-2xl font-semibold text-primary">
              {producto.precio}
            </p>
          )}
        </header>

        {producto.imagenes?.length > 0 && (
          <section className="grid gap-3 sm:grid-cols-2">
            {producto.imagenes.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${producto.nombre} ${i + 1}`}
                className="h-64 w-full rounded-xl object-cover"
              />
            ))}
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-card-foreground">
            Descripción
          </h2>
          <p className="text-sm text-muted-foreground">
            {producto.descripcion || 'Sin descripción disponible.'}
          </p>
        </section>

        {producto.landing && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-card-foreground">
              Landing asociada
            </h2>
            <a
              href={producto.landing}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline break-all"
            >
              {producto.landing}
            </a>
          </section>
        )}

        {producto.vistaTienda && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-card-foreground">
              Vista de tienda / referencia
            </h2>
            <a
              href={producto.vistaTienda}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline break-all"
            >
              {producto.vistaTienda}
            </a>
          </section>
        )}
      </div>
    </main>
  )
}

export default LandingProductoPage

