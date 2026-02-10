import { useRef } from 'react'
import SectionCard from './SectionCard'

const COLUMNAS = [
  'ID',
  'Nombre / Empresa',
  'Cédula / NIT',
  'Email',
  'WhatsApp',
  'Ciudad / Barrio',
  'Estado',
  'Miracle Coins',
  'Fecha creación',
  'Acciones',
]

function ClientesList({ clientes, onCrear, onVer, onEditar, onExportExcel, onImportExcel }) {
  const inputFileRef = useRef(null)

  const handleImportClick = () => inputFileRef.current?.click()
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onImportExcel) onImportExcel(file)
    e.target.value = ''
  }

  return (
    <SectionCard title="Clientes">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <input
          ref={inputFileRef}
          type="file"
          accept=".xlsx,.xls"
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
          Crear cliente
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
            {clientes.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">{c.id}</td>
                <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">{c.nombreEmpresa}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.cedulaNit || '—'}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.email}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.whatsapp}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.ciudadBarrio || '—'}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.estado === 'activo'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">{c.miracleCoins}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.fechaCreacion}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onVer(c)}
                      className="text-primary hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditar(c)}
                      className="text-primary hover:underline"
                    >
                      Editar
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

export default ClientesList
