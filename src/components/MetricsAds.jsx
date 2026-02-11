import { useState } from 'react'
import SectionCard from './SectionCard'

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

export default function MetricsAds() {
  const [plataforma, setPlataforma] = useState('')
  const [rangoFechas, setRangoFechas] = useState('30d')

  const campanasFiltradas = CAMPANAS_DEMO.filter((c) =>
    plataforma ? c.plataforma.toLowerCase().includes(plataforma) : true,
  )

  const kpis = calcularKpis(campanasFiltradas)

  const handleVerCampana = (c) => {
    // eslint-disable-next-line no-alert
    alert(`Ver métricas detalladas de la campaña ${c.id} - ${c.nombre}.`)
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
        {/* Objetivo + filtros */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Visualiza el rendimiento de tus campañas publicitarias y analiza sus resultados.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                Plataforma
              </label>
              <select
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value)}
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
        </div>

        {/* KPIs globales */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
            <p className="text-lg font-semibold text-card-foreground">
              {kpis.conversiones}
            </p>
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
            <p className="text-lg font-semibold text-card-foreground">
              {kpis.miracleCoins}
            </p>
          </div>
        </div>

        {/* Tabla de métricas por campaña */}
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
                        Ver por campaña
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
      </SectionCard>
    </div>
  )
}

