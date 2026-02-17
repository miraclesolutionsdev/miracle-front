import SectionCard from './SectionCard'
import { Check, Sparkles } from 'lucide-react'

const PLANS = [
  {
    name: 'Basico',
    price: '$299/mes',
    features: [
      '1 agente dedicado',
      'Soporte en horario laboral',
      'Reportes mensuales',
      'Hasta 3 campanas',
    ],
  },
  {
    name: 'Pro',
    price: '$599/mes',
    highlighted: true,
    features: [
      '3 agentes dedicados',
      'Soporte 24/7',
      'Reportes semanales',
      'Hasta 10 campanas',
      'Optimizacion automatica',
    ],
  },
  {
    name: 'Enterprise',
    price: '$1,299/mes',
    features: [
      'Equipo completo',
      'Soporte prioritario 24/7',
      'Reportes en tiempo real',
      'Campanas ilimitadas',
      'Estrategia personalizada',
      'Account manager dedicado',
    ],
  },
]

export function AgentsPlans() {
  return (
    <SectionCard title="Planes de agentes">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-xl border p-5 transition-colors ${
              plan.highlighted
                ? 'border-primary/50 bg-primary/5'
                : 'border-border bg-background/50 hover:border-border/80'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                <Sparkles className="h-3 w-3" />
                Recomendado
              </div>
            )}
            <h3 className="text-sm font-semibold text-foreground">
              {plan.name}
            </h3>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-primary">{plan.price}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-5 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                plan.highlighted
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-border bg-accent/50 text-foreground hover:bg-accent'
              }`}
            >
              Seleccionar plan
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default AgentsPlans
