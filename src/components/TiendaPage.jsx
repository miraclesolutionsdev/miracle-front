import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc } from '../utils/api'

export default function TiendaPage() {
  const { productos } = useProductos()
  const navigate = useNavigate()

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
            Tienda
          </h1>
        </header>

        {productos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay productos en la tienda.
            </p>
          </div>
        ) : productosActivos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No hay productos activos en la tienda por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productosActivos.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg ring-1 ring-black/5"
              >
                {getProductoImagenSrc(p, 0) && (
                  <img
                    src={getProductoImagenSrc(p, 0)}
                    alt={p.nombre}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="text-base font-semibold text-card-foreground">
                    {p.nombre}
                  </h2>
                  {p.precio && (
                    <p className="text-lg font-bold text-primary">{p.precio}</p>
                  )}
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {p.descripcion || 'Sin descripción.'}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                    </span>
                    {p.stock != null && <span>Stock: {p.stock}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/landing-producto/${p.id}`)}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
