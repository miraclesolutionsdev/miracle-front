import SectionCard from './SectionCard'

const CAMPAIGNS_BY_PRODUCT = [
  'Pack Social Media — 4 campanas activas',
  'Video Corporativo — 2 campanas activas',
  'Google Ads — 6 campanas activas',
  'Diseno de Marca — 1 campana activa',
]

const REQUIREMENTS = [
  'Brief creativo aprobado por cliente',
  'Materiales graficos en alta resolucion',
  'Acceso a cuentas publicitarias',
  'Presupuesto mensual definido',
  'KPIs y objetivos claros',
]

export function CampaignsRequirements() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SectionCard title="Campanas por producto">
        <ul className="flex flex-col gap-2">
          {CAMPAIGNS_BY_PRODUCT.map((item) => (
            <li
              key={item}
              className="rounded-lg bg-muted/40 px-4 py-2.5 text-sm text-card-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Requerimientos de campanas">
        <ul className="flex flex-col gap-2 pl-1">
          {REQUIREMENTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-card-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}

export default CampaignsRequirements
