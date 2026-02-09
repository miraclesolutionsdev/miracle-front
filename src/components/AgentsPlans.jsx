import SectionCard from './SectionCard'
import { Check } from 'lucide-react'

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
    <SectionCard title="Agentes disponibles">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-5 ${
              plan.highlighted
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30'
            }`}
          >
            <h3 className="text-base font-semibold text-card-foreground">
              {plan.name}
            </h3>
            <p className="mt-1 text-2xl font-bold text-primary">{plan.price}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default AgentsPlans
