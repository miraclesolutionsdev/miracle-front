import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import SectionCard from './SectionCard'
import { getProductoImagenSrc } from '../utils/api'

function VistaTienda() {
  const { productos } = useProductos()
  const navigate = useNavigate()

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  return (
    <div className="space-y-6">
      <SectionCard title="Tienda de productos" className="border-neutral-800 bg-neutral-900/40 [&_h2]:text-white">
        {productos.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Aún no hay productos creados. Crea productos desde la sección &quot;Productos&quot; para verlos aquí.
          </p>
        ) : productosActivos.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No hay productos activos en la tienda por el momento. Activa alguno desde la sección &quot;Productos&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productosActivos.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-neutral-800/60 ring-1 ring-neutral-700"
              >
                {getProductoImagenSrc(p, 0) && (
                  <div className="overflow-hidden">
                    <img
                      src={getProductoImagenSrc(p, 0)}
                      alt={p.nombre}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-semibold text-white">
                      {p.nombre}
                    </h2>
                    <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-medium text-pink-400">
                      {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {p.precio && (
                    <p className="text-base font-bold text-pink-400">
                      {p.precio}
                    </p>
                  )}
                  <p className="line-clamp-3 text-xs text-neutral-400">
                    {p.descripcion || 'Sin descripción.'}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span>{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
                    {p.stock != null && <span>Stock: {p.stock}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/landing-producto/${p.id}`)}
                    className="mt-3 w-full rounded-xl bg-pink-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default VistaTienda

