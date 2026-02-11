import SectionCard from './SectionCard'

const COLUMNAS = [
  'ID',
  'Producto',
  'Pieza (Creativo)',
  'Plataforma',
  'Miracle Coins',
  'Estado',
  'Acciones',
]

function CampañasList({
  campañas,
  onCrear,
  onVer,
  onEditar,
  onLanzar,
  onActivarPausar,
  onFinalizar,
}) {
  return (
    <SectionCard title="Campañas">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onCrear}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Crear campaña
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
            {campañas.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3 pr-4 text-card-foreground">{c.id}</td>
                <td className="py-3 pr-4 text-card-foreground">{c.producto}</td>
                <td className="py-3 pr-4 text-card-foreground">{c.piezaCreativo ?? '—'}</td>
                <td className="py-3 pr-4 text-muted-foreground">{c.plataforma}</td>
                <td className="py-3 pr-4 text-card-foreground">{c.miracleCoins}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.estado === 'activa'
                        ? 'bg-primary/10 text-primary'
                        : c.estado === 'pausada'
                          ? 'bg-muted text-muted-foreground'
                          : c.estado === 'finalizada'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {c.estado ? c.estado.charAt(0).toUpperCase() + c.estado.slice(1) : ''}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {onLanzar && (
                      <button
                        type="button"
                        onClick={() => onLanzar(c)}
                        className="text-primary hover:underline"
                      >
                        Lanzar
                      </button>
                    )}
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
                    {(c.estado === 'activa' || c.estado === 'pausada') && (
                      <button
                        type="button"
                        onClick={() => onActivarPausar(c)}
                        className="text-primary hover:underline"
                      >
                        {c.estado === 'activa' ? 'Pausar' : 'Activar'}
                      </button>
                    )}
                    {c.estado !== 'finalizada' && (
                      <button
                        type="button"
                        onClick={() => onFinalizar(c)}
                        className="text-muted-foreground hover:underline"
                      >
                        Finalizar
                      </button>
                    )}
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

export default CampañasList
