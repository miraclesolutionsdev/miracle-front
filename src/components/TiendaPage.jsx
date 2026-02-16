import { useMemo } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc } from '../utils/api'

export default function TiendaPage() {
  const { productos } = useProductos()

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tienda
          </h1>
        </header>

        {productos.length === 0 ? (
          <div className="rounded-2xl bg-neutral-900/60 p-12 text-center ring-1 ring-neutral-800">
            <p className="text-neutral-400">
              Aún no hay productos en la tienda.
            </p>
          </div>
        ) : productosActivos.length === 0 ? (
          <div className="rounded-2xl bg-neutral-900/60 p-12 text-center ring-1 ring-neutral-800">
            <p className="text-neutral-400">
              No hay productos activos en la tienda por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {productosActivos.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-neutral-900/60 shadow-xl ring-1 ring-neutral-800 transition-shadow hover:ring-neutral-700"
              >
                {getProductoImagenSrc(p, 0) && (
                  <div className="overflow-hidden">
                    <img
                      src={getProductoImagenSrc(p, 0)}
                      alt={p.nombre}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="inline-flex w-fit rounded-full bg-pink-500/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-pink-400">
                    {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    {p.nombre}
                  </h2>
                  {p.precio && (
                    <p className="text-xl font-bold text-pink-400">{p.precio}</p>
                  )}
                  <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
                    {p.descripcion || 'Sin descripción.'}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span>{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
                    {p.stock != null && <span>Stock: {p.stock}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open(`${window.location.origin}/landing-producto/${p.id}`, '_blank', 'noopener,noreferrer')}
                    className="mt-5 w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
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
