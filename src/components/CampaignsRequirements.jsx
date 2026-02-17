import SectionCard from './SectionCard'
import { Check } from 'lucide-react'

const CAMPAIGNS_BY_PRODUCT = [
  'Pack Social Media -- 4 campanas activas',
  'Video Corporativo -- 2 campanas activas',
  'Google Ads -- 6 campanas activas',
  'Diseno de Marca -- 1 campana activa',
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionCard title="Campanas por producto">
        <ul className="flex flex-col gap-2">
          {CAMPAIGNS_BY_PRODUCT.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border bg-background/50 px-4 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent/30"
            >
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Requerimientos de campanas">
        <ul className="flex flex-col gap-2.5 pl-0.5">
          {REQUIREMENTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[13px] text-foreground"
            >
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Check className="h-2.5 w-2.5 text-primary" />
              </div>
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}

export default CampaignsRequirements
