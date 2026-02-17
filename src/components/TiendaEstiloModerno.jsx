import { useMemo } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc } from '../utils/api'

export default function TiendaEstiloModerno() {
  const { productos } = useProductos()

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  return (
    <main className="min-h-screen bg-[#0d0d10] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <header className="mb-12 border-b border-white/[0.04] pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tienda
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Explora nuestro catalogo
          </p>
        </header>

        {productos.length === 0 ? (
          <div className="rounded-2xl bg-[#141418] p-12 text-center ring-1 ring-white/[0.06]">
            <p className="text-white/40">
              Aun no hay productos en la tienda.
            </p>
          </div>
        ) : productosActivos.length === 0 ? (
          <div className="rounded-2xl bg-[#141418] p-12 text-center ring-1 ring-white/[0.06]">
            <p className="text-white/40">
              No hay productos activos en la tienda por el momento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {productosActivos.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-[#141418] ring-1 ring-white/[0.06] transition-colors hover:ring-white/10 sm:flex-row"
              >
                {getProductoImagenSrc(p, 0) && (
                  <div className="h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
                    <img
                      src={getProductoImagenSrc(p, 0)}
                      alt={p.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div>
                    <span className="inline-flex rounded-full bg-amber-400/10 px-3 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-amber-400">
                      {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                    </span>
                    <h2 className="mt-3 text-xl font-semibold text-white">
                      {p.nombre}
                    </h2>
                    {p.precio && (
                      <p className="mt-1 text-2xl font-bold text-amber-400">{p.precio}</p>
                    )}
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">
                      {p.descripcion || 'Sin descripcion.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    {p.stock != null && (
                      <span className="flex items-center gap-2 text-xs text-white/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {p.stock} en stock
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => window.open(`${window.location.origin}/landing-producto/${p.id}`, '_blank', 'noopener,noreferrer')}
                      className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-amber-400/20 transition-colors hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-[#0d0d10]"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
