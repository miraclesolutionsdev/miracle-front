import { useNavigate } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import SectionCard from './SectionCard'

function VistaTienda() {
  const { productos } = useProductos()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <SectionCard title="Tienda de productos">
        {productos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay productos creados. Crea productos desde la sección &quot;Productos&quot; para verlos aquí.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
              >
                {p.imagenes?.[0] && (
                  <img
                    src={p.imagenes[0]}
                    alt={p.nombre}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-semibold text-card-foreground">
                      {p.nombre}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.estado === 'activo'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {p.precio && (
                    <p className="text-base font-semibold text-primary">
                      {p.precio}
                    </p>
                  )}
                  <p className="line-clamp-3 text-xs text-muted-foreground">
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
                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
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

