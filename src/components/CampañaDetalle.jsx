import { useState } from 'react'
import SectionCard from './SectionCard'

function CampañaDetalle({ campaña, piezas = [], onCerrar, onAsociarMaterial, onActivarPausar, onFinalizar }) {
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [piezaSeleccionada, setPiezaSeleccionada] = useState('')

  if (!campaña) return null

  const puedeActivarPausar = campaña.estado === 'activa' || campaña.estado === 'pausada'
  const puedeFinalizar = campaña.estado !== 'finalizada'

  const handleConfirmarAsociar = () => {
    if (!piezaSeleccionada) return
    onAsociarMaterial?.(campaña, piezaSeleccionada)
    setMostrarSelector(false)
    setPiezaSeleccionada('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card shadow-lg flex flex-col">
        <div className="border-b border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{campaña.id} · {campaña.producto}</h2>
              <p className="text-sm text-muted-foreground">{campaña.plataforma}{campaña.piezaCreativo ? ` · ${campaña.piezaCreativo}` : ''}</p>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Miracle Coins Asignadas</dt>
              <dd className="text-card-foreground">{campaña.miracleCoins}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="text-card-foreground">{campaña.estado ? campaña.estado.charAt(0).toUpperCase() + campaña.estado.slice(1) : ''}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMostrarSelector(true)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-card-foreground hover:bg-muted"
            >
              Asociar material audiovisual
            </button>
            {puedeActivarPausar && (
              <button
                type="button"
                onClick={() => onActivarPausar?.(campaña)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"
              >
                {campaña.estado === 'activa' ? 'Pausar campaña' : 'Activar campaña'}
              </button>
            )}
            {puedeFinalizar && (
              <button
                type="button"
                onClick={() => onFinalizar?.(campaña)}
                className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/80"
              >
                Finalizar campaña
              </button>
            )}
          </div>
        </div>

        {mostrarSelector && (
          <div className="border-b border-border bg-muted/30 p-6 space-y-3">
            <p className="text-sm font-semibold text-card-foreground">Selecciona una pieza audiovisual</p>
            {piezas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay piezas disponibles en la biblioteca.</p>
            ) : (
              <select
                value={piezaSeleccionada}
                onChange={(e) => setPiezaSeleccionada(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Selecciona una pieza…</option>
                {piezas.map((p) => (
                  <option key={p.id} value={p.nombre}>{p.nombre}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmarAsociar}
                disabled={!piezaSeleccionada}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Asociar
              </button>
              <button
                type="button"
                onClick={() => { setMostrarSelector(false); setPiezaSeleccionada('') }}
                className="rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-card-foreground">Material asociado</h3>
          {campaña.piezaCreativo ? (
            <SectionCard title="Pieza creativo" className="!p-4">
              <p className="text-sm text-muted-foreground">{campaña.piezaCreativo}</p>
            </SectionCard>
          ) : (
            <p className="text-sm text-muted-foreground">Sin material asociado. Usa el botón de arriba para vincular una pieza audiovisual.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampañaDetalle
