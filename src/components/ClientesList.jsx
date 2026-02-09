import SectionCard from './SectionCard'

const COLUMNAS = [
  'ID',
  'Nombre / Empresa',
  'Email',
  'WhatsApp',
  'Estado',
  'Plan',
  'Miracle Coins',
  'Fecha creación',
  'Acciones',
]

function ClientesList({ clientes, onCrear, onVer, onEditar }) {
  return (
    <SectionCard title="Clientes">
      <div className="mb-4 flex justify-end">
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
                <td className="py-3 pr-4 text-card-foreground">{c.id}</td>
                <td className="py-3 pr-4 text-card-foreground">{c.nombreEmpresa}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.email}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.whatsapp}</td>
                <td className="py-3 pr-4">
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
                <td className="py-3 pr-4 text-card-foreground">{c.plan}</td>
                <td className="py-3 pr-4 text-card-foreground">{c.miracleCoins}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.fechaCreacion}</td>
                <td className="py-3 pr-4">
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
