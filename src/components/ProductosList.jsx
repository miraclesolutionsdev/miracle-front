import { useNavigate } from 'react-router-dom'
import SectionCard from './SectionCard'

const COLUMNAS = [
  'ID',
  'Stock',
  'Nombre',
  'Tipo',
  'Precio',
  'Estado',
  'Acciones',
]

function ProductosList({ productos, onCrear, onEditar, onToggleEstado }) {
  const navigate = useNavigate()
  return (
    <SectionCard title="Productos y servicios">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onCrear}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Crear producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {COLUMNAS.map((c) => (
                <th key={c} className="pb-3 pr-4 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-3 pr-4 text-card-foreground">{p.id}</td>
                <td className="py-3 pr-4 text-card-foreground">
                  {p.stock ?? '—'}
                </td>
                <td className="py-3 pr-4 text-card-foreground">
                  <div className="flex items-center gap-2">
                    {p.imagenes?.[0] && (
                      <img
                        src={p.imagenes[0]}
                        alt={p.nombre}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <span>{p.nombre}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                </td>
                <td className="py-3 pr-4 text-card-foreground">{p.precio}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.estado === 'activo'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditar(p)}
                      className="text-primary hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/landing-producto/${p.id}`)}
                      className="text-primary hover:underline"
                    >
                      Ver landing
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleEstado(p)}
                      className="text-primary hover:underline"
                    >
                      {p.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

export default ProductosList

