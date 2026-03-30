import { useState, useEffect } from 'react'
import { campanasApi } from '../utils/api'
import SectionCard from './SectionCard'

const ESTADO_LABEL = {
  activa: 'Activa',
  pausada: 'Pausada',
  borrador: 'Borrador',
  finalizada: 'Finalizada',
}

const ESTADO_COLOR = {
  activa: 'text-emerald-500',
  pausada: 'text-amber-500',
  borrador: 'text-muted-foreground',
  finalizada: 'text-blue-400',
}

export default function MetricsAds() {
  const [campanas, setCampanas] = useState([])
  const [loading, setLoading] = useState(true)
  const [campanaSeleccionadaId, setCampanaSeleccionadaId] = useState('')
  const [plataformaFiltro, setPlataformaFiltro] = useState('')

  useEffect(() => {
    campanasApi
      .listar()
      .then((data) => setCampanas(Array.isArray(data) ? data : []))
      .catch(() => setCampanas([]))
      .finally(() => setLoading(false))
  }, [])

  const plataformas = [...new Set(campanas.map((c) => c.plataforma).filter(Boolean))]

  const campanasFiltradas = campanas.filter((c) =>
    plataformaFiltro ? c.plataforma === plataformaFiltro : true
  )

  const campanaSeleccionada = campanaSeleccionadaId
    ? campanasFiltradas.find((c) => c.id === campanaSeleccionadaId) || null
    : null

  const totalCoins = campanasFiltradas.reduce((acc, c) => acc + (c.miracleCoins || 0), 0)
  const activas = campanasFiltradas.filter((c) => c.estado === 'activa').length

  if (loading) {
    return (
      <SectionCard title="Métricas Ads">
        <div className="py-8 text-center text-sm text-muted-foreground">Cargando campañas…</div>
      </SectionCard>
    )
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Métricas Ads">
        <p className="mb-4 text-sm text-muted-foreground">
          Visualiza el rendimiento de tus campañas. Selecciona una para ver sus detalles.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
          <div className="min-w-[200px] flex-1 space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Seleccionar campaña</label>
            <select
              value={campanaSeleccionadaId}
              onChange={(e) => setCampanaSeleccionadaId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas las campañas…</option>
              {campanasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.producto || 'Sin producto'} — {c.plataforma || 'Sin plataforma'}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Plataforma</label>
            <select
              value={plataformaFiltro}
              onChange={(e) => { setPlataformaFiltro(e.target.value); setCampanaSeleccionadaId('') }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas</option>
              {plataformas.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {campanaSeleccionada ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div>
                <h3 className="text-base font-semibold text-card-foreground">
                  {campanaSeleccionada.producto || 'Sin producto'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {campanaSeleccionada.plataforma || 'Sin plataforma'}
                  {campanaSeleccionada.piezaCreativo ? ` · ${campanaSeleccionada.piezaCreativo}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCampanaSeleccionadaId('')}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Ver todas
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Miracle Coins asignadas</p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {(campanaSeleccionada.miracleCoins || 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Créditos asignados a esta campaña</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Plataforma</p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campanaSeleccionada.plataforma || '—'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Canal de publicación</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">Estado</p>
                <p className={`mt-1 text-2xl font-bold ${ESTADO_COLOR[campanaSeleccionada.estado] || ''}`}>
                  {ESTADO_LABEL[campanaSeleccionada.estado] || campanaSeleccionada.estado}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Estado actual de la campaña</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Total campañas</p>
                <p className="text-lg font-semibold text-card-foreground">{campanasFiltradas.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Activas</p>
                <p className="text-lg font-semibold text-emerald-500">{activas}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Miracle Coins totales</p>
                <p className="text-lg font-semibold text-card-foreground">{totalCoins.toLocaleString()}</p>
              </div>
            </div>

            {campanasFiltradas.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No hay campañas registradas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Producto</th>
                      <th className="pb-3 pr-4 font-medium">Plataforma</th>
                      <th className="pb-3 pr-4 font-medium">Pieza creativo</th>
                      <th className="pb-3 pr-4 font-medium">Miracle Coins</th>
                      <th className="pb-3 pr-4 font-medium">Estado</th>
                      <th className="pb-3 font-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanasFiltradas.map((c) => (
                      <tr key={c.id} className="border-b border-border">
                        <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">{c.producto || '—'}</td>
                        <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.plataforma || '—'}</td>
                        <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{c.piezaCreativo || '—'}</td>
                        <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{(c.miracleCoins || 0).toLocaleString()}</td>
                        <td className={`py-3 pr-4 whitespace-nowrap font-medium ${ESTADO_COLOR[c.estado] || ''}`}>
                          {ESTADO_LABEL[c.estado] || c.estado}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => setCampanaSeleccionadaId(c.id)}
                            className="text-primary hover:underline text-xs"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  )
}
