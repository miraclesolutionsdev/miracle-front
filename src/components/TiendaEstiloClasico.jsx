import { useEffect, useMemo, useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, authApi } from '../utils/api'
import TiendaHeader from './TiendaHeader'

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

export default function TiendaEstiloClasico() {
  const { productos } = useProductos()
  const [tenant, setTenant] = useState(null)

  useEffect(() => {
    let cancelled = false
    authApi
      .obtenerPerfil()
      .then((data) => {
        if (cancelled) return
        if (data?.tenant) setTenant(data.tenant)
      })
      .catch(() => {
        // si no hay token o falla, dejamos tenant en null y usamos fallback
      })
    return () => {
      cancelled = true
    }
  }, [])

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <TiendaHeader tenant={tenant} variant="clasico" />

        {productos.length === 0 ? (
          <div className="rounded-2xl bg-neutral-900/60 p-12 text-center ring-1 ring-neutral-800">
            <p className="text-neutral-400">
              Aun no hay productos en la tienda.
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
                  {p.precio != null && (
                    <p className="text-xl font-bold text-pink-400">
                      {formatPrecio(p.precio)}
                    </p>
                  )}
                  <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
                    {p.descripcion || 'Sin descripcion.'}
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
