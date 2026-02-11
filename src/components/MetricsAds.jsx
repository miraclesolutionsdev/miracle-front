import { useState } from 'react'
import SectionCard from './SectionCard'

function calcularKpis(campanas) {
  const totImpresiones = campanas.reduce((acc, c) => acc + c.impresiones, 0)
  const totClicks = campanas.reduce((acc, c) => acc + c.clicks, 0)
  const totConversiones = campanas.reduce((acc, c) => acc + c.conversiones, 0)
  const totCoins = campanas.reduce((acc, c) => acc + c.miracleCoins, 0)
  const ctrPromedio =
    totImpresiones > 0 ? ((totClicks / totImpresiones) * 100).toFixed(2) : '0.00'

  return {
    impresiones: totImpresiones.toLocaleString(),
    clicks: totClicks.toLocaleString(),
    ctr: `${ctrPromedio}%`,
    conversiones: totConversiones.toLocaleString(),
    gasto: campanas.reduce(
      (acc, c) => acc + Number(c.gasto.replace(/[^0-9.]/g, '') || 0),
      0,
    ),
    miracleCoins: totCoins.toLocaleString(),
  }
}

const CAMPANAS_DEMO = [
  {
    id: 'CP-001',
    nombre: 'Lanzamiento Q2',
    plataforma: 'Meta',
    impresiones: 50321,
    clicks: 2103,
    ctr: 4.18,
    conversiones: 120,
    gasto: '$850.00',
    miracleCoins: 320,
    cliente: 'Acme Corp',
  },
  {
    id: 'CP-002',
    nombre: 'Remarketing sitio web',
    plataforma: 'Google Ads',
    impresiones: 73210,
    clicks: 1890,
    ctr: 2.58,
    conversiones: 95,
    gasto: '$620.00',
    miracleCoins: 250,
    cliente: 'Startup XYZ',
  },
  {
    id: 'CP-003',
    nombre: 'Promo fin de mes',
    plataforma: 'Meta',
    impresiones: 21045,
    clicks: 328,
    ctr: 1.56,
    conversiones: 32,
    gasto: '$310.00',
    miracleCoins: 140,
    cliente: 'Tienda Digital',
  },
]

export default function MetricsAds() {
  const [campañaSeleccionadaId, setCampañaSeleccionadaId] = useState('')
  const [plataforma, setPlataforma] = useState('')
  const [rangoFechas, setRangoFechas] = useState('30d')

  const campanasFiltradas = CAMPANAS_DEMO.filter((c) =>
    plataforma ? c.plataforma.toLowerCase().includes(plataforma) : true,
  )

  const campañaSeleccionada = campañaSeleccionadaId
    ? campanasFiltradas.find((c) => c.id === campañaSeleccionadaId) || null
    : null

  const kpis = calcularKpis(campanasFiltradas)

  const handleVerCampana = (c) => {
    setCampañaSeleccionadaId(c.id)
  }

  const handleVerCliente = (c) => {
    // eslint-disable-next-line no-alert
    alert(`Ver métricas agregadas del cliente ${c.cliente}.`)
  }

  const handleComparar = (c) => {
    // eslint-disable-next-line no-alert
    alert(`Comparar la campaña ${c.id} con otras campañas.`)
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Métricas Ads">
        <p className="mb-4 text-sm text-muted-foreground">
          Visualiza el rendimiento de tus campañas publicitarias. Selecciona una campaña para ver
          sus métricas detalladas.
        </p>

        {/* Selector de campaña + filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
          <div className="min-w-[200px] flex-1 space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Seleccionar campaña
            </label>
            <select
              value={campañaSeleccionadaId}
              onChange={(e) => setCampañaSeleccionadaId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Seleccione una campaña...</option>
              {campanasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.plataforma})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Plataforma</label>
            <select
              value={plataforma}
              onChange={(e) => {
                setPlataforma(e.target.value)
                if (campañaSeleccionadaId) setCampañaSeleccionadaId('')
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas</option>
              <option value="meta">Meta (Facebook/Instagram)</option>
              <option value="google">Google Ads</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Rango de fechas
            </label>
            <select
              value={rangoFechas}
              onChange={(e) => setRangoFechas(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
          </div>
        </div>

        {/* Vista detallada de una sola campaña */}
        {campañaSeleccionada ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div>
                <h3 className="text-base font-semibold text-card-foreground">
                  {campañaSeleccionada.nombre}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {campañaSeleccionada.plataforma}
                  {campañaSeleccionada.cliente
                    ? ` · Cliente: ${campañaSeleccionada.cliente}`
                    : ''}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Datos del rango: {rangoFechas === '7d' ? 'Últimos 7 días' : rangoFechas === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCampañaSeleccionadaId('')}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Ver todas las campañas
              </button>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Métricas de esta campaña
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Impresiones totales de la campaña
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.impresiones.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Veces que se mostró el anuncio
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Clicks totales
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.clicks.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Interacciones en el anuncio
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  CTR (tasa de clics)
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.ctr}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Porcentaje de impresiones que generaron clic
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Conversiones de la campaña
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.conversiones.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Objetivos completados (ventas, registros, etc.)
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Gasto publicitario
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.gasto}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Inversión en esta campaña
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">
                  Miracle Coins consumidas
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {campañaSeleccionada.miracleCoins.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Créditos usados en la campaña
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Elige una campaña en el selector de arriba para ver sus métricas, o revisa el listado
              y haz clic en &quot;Ver métricas&quot;.
            </p>

            {/* KPIs globales (todas las campañas filtradas) */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Impresiones</p>
                <p className="text-lg font-semibold text-card-foreground">{kpis.impresiones}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Clicks</p>
                <p className="text-lg font-semibold text-card-foreground">{kpis.clicks}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">CTR</p>
                <p className="text-lg font-semibold text-card-foreground">{kpis.ctr}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Conversiones</p>
                <p className="text-lg font-semibold text-card-foreground">{kpis.conversiones}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Gasto aprox.</p>
                <p className="text-lg font-semibold text-card-foreground">
                  $
                  {kpis.gasto.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Miracle Coins</p>
                <p className="text-lg font-semibold text-card-foreground">{kpis.miracleCoins}</p>
              </div>
            </div>

            {/* Tabla de todas las campañas */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Campaña</th>
                    <th className="pb-3 pr-4 font-medium">Plataforma</th>
                    <th className="pb-3 pr-4 font-medium">Impresiones</th>
                    <th className="pb-3 pr-4 font-medium">Clicks</th>
                    <th className="pb-3 pr-4 font-medium">CTR</th>
                    <th className="pb-3 pr-4 font-medium">Conversiones</th>
                    <th className="pb-3 pr-4 font-medium">Gasto</th>
                    <th className="pb-3 pr-4 font-medium">Miracle Coins</th>
                    <th className="pb-3 pr-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {campanasFiltradas.map((c) => (
                    <tr key={c.id} className="border-b border-border">
                      <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">
                        {c.nombre}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.plataforma}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.impresiones.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.ctr}%
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.conversiones.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.gasto}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {c.miracleCoins.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerCampana(c)}
                            className="text-primary hover:underline"
                          >
                            Ver métricas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerCliente(c)}
                            className="text-primary hover:underline"
                          >
                            Ver por cliente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleComparar(c)}
                            className="text-primary hover:underline"
                          >
                            Comparar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  )
}
