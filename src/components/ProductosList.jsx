import { useRef } from 'react'
import SectionCard from './SectionCard'
import { getProductoImagenSrc } from '../utils/api'

const COLUMNAS = [
  'ID',
  'Stock',
  'Nombre',
  'Tipo',
  'Precio (COP)',
  'Estado',
  'Acciones',
]

const formatPrecio = (valor) =>
  (Number(valor) || 0).toLocaleString('es-CO')

function ProductosList({
  productos,
  onCrear,
  onEditar,
  onToggleEstado,
  onExportExcel,
  onImportExcel,
}) {
  const inputFileRef = useRef(null)

  const handleImportClick = () => inputFileRef.current?.click()
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onImportExcel) onImportExcel(file)
    e.target.value = ''
  }

  return (
    <SectionCard title="Productos y servicios">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <input
          ref={inputFileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
        />
        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted/50"
          >
            Exportar Excel
          </button>
        )}
        {onImportExcel && (
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted/50"
          >
            Importar Excel
          </button>
        )}
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
                    {getProductoImagenSrc(p, 0) && (
                      <img
                        src={getProductoImagenSrc(p, 0)}
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
                <td className="py-3 pr-4 text-card-foreground">
                  {formatPrecio(p.precio)}
                </td>
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
                      onClick={() => window.open(`${window.location.origin}/landing-producto/${p.id}`, '_blank', 'noopener,noreferrer')}
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

