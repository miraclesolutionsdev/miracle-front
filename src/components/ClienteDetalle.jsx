import { useState, useEffect } from 'react'
import { ordenesApi } from '../utils/api'

const TABS = [
  { id: 'ventas',  label: 'Ventas asociadas' },
  { id: 'coins',   label: 'Miracle Coins' },
]

const ESTADO_COLOR = {
  pendiente:   'text-amber-500',
  procesando:  'text-blue-400',
  completada:  'text-emerald-500',
  entregada:   'text-emerald-600',
  cancelada:   'text-red-500',
}

function ClienteDetalle({ cliente, onCerrar }) {
  const [tab, setTab] = useState('ventas')
  const [ventas, setVentas] = useState([])
  const [loadingVentas, setLoadingVentas] = useState(true)

  useEffect(() => {
    if (!cliente?.email) { setLoadingVentas(false); return }
    setLoadingVentas(true)
    ordenesApi
      .listar({ email: cliente.email, limit: 50 })
      .then((data) => setVentas(Array.isArray(data?.ordenes) ? data.ordenes : []))
      .catch(() => setVentas([]))
      .finally(() => setLoadingVentas(false))
  }, [cliente?.email])

  if (!cliente) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-lg flex flex-col">
        <div className="border-b border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{cliente.nombreEmpresa}</h2>
              <p className="text-sm text-muted-foreground">{cliente.id} · {cliente.email}</p>
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
              <dt className="text-muted-foreground">Cédula / NIT</dt>
              <dd className="text-card-foreground">{cliente.cedulaNit || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="text-card-foreground">{cliente.whatsapp || '—'}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Dirección</dt>
              <dd className="text-card-foreground">{cliente.direccion || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ciudad y Barrio</dt>
              <dd className="text-card-foreground">{cliente.ciudadBarrio || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="text-card-foreground">{cliente.estado}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Miracle Coins</dt>
              <dd className="text-card-foreground font-semibold">{cliente.miracleCoins ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fecha de creación</dt>
              <dd className="text-card-foreground">
                {cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString('es-CO') : '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex border-b border-border px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {tab === 'ventas' && (
            loadingVentas ? (
              <p className="text-sm text-muted-foreground">Cargando ventas…</p>
            ) : ventas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Este cliente no tiene ventas registradas.</p>
            ) : (
              <ul className="space-y-2">
                {ventas.map((v) => (
                  <li key={v._id || v.ordenNumero} className="flex justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
                    <span className="text-card-foreground font-medium">{v.ordenNumero}</span>
                    <span className="text-muted-foreground">
                      ${(v.totalMonto ?? 0).toLocaleString('es-CO')}
                      {' · '}
                      <span className={ESTADO_COLOR[v.estado] || ''}>
                        {v.estado}
                      </span>
                      {' · '}
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-CO') : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )
          )}

          {tab === 'coins' && (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <p className="text-5xl font-bold text-amber-500">{(cliente.miracleCoins ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Miracle Coins disponibles para este cliente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClienteDetalle
