import { Check, Sparkles } from 'lucide-react'

const PRICING_PLANS = [
  {
    id: 'spark',
    name: 'Spark',
    tagline: 'Gestión de campañas y administración digital',
    price: '490.000',
    currency: 'COP / mes',
    cta: 'Elegir Spark',
    hasCredits: false,
    sections: [
      {
        label: null,
        items: [
          { icon: '📣', text: 'Campañas en hasta 2 plataformas (Meta, Google o TikTok Ads)' },
          { icon: '⚙️', text: 'Configuración, segmentación y lanzamiento de campañas' },
          { icon: '🔄', text: 'Optimización continua de presupuesto y audiencias' },
          { icon: '🧪', text: 'A/B testing de anuncios básicos' },
          { icon: '📱', text: 'Gestión de hasta 2 redes sociales' },
          { icon: '📅', text: 'Programación y publicación de contenido' },
          { icon: '💻', text: 'Acceso completo al dashboard Miracle en tiempo real' },
          { icon: '📊', text: 'Reporte mensual: alcance, conversiones, CTR y ROI' },
          { icon: '💬', text: 'Soporte por chat y ticket (respuesta en 48h)' },
        ],
      },
    ],
  },
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'Marca, web y campañas. Todo en un solo lugar.',
    price: '1.190.000',
    currency: 'COP / mes',
    cta: 'Elegir Launch',
    hasCredits: true,
    credits: '150 créditos / mes',
    creditNote: 'Acumulables hasta 1 mes · Para piezas publicitarias',
    sections: [
      {
        label: 'Todo lo del plan Spark, más:',
        items: [
          { icon: '🎨', text: 'Diseño de logotipo profesional (3 propuestas)' },
          { icon: '🎨', text: 'Paleta de colores y tipografía corporativa' },
          { icon: '📄', text: 'Guía de marca básica en PDF' },
          { icon: '🌐', text: 'Página web con 1 template a elegir entre 3 opciones' },
          { icon: '🔗', text: 'Conexión y configuración de dominio' },
          { icon: '📝', text: 'Hasta 5 secciones de contenido + diseño responsivo' },
          { icon: '🛠️', text: 'Actualizaciones de contenido web: hasta 2 veces/mes' },
          { icon: '📱', text: 'Gestión de hasta 3 redes sociales' },
          { icon: '💬', text: 'Soporte prioritario (respuesta en 24h)' },
        ],
      },
    ],
  },
  {
    id: 'miracle',
    name: 'Miracle',
    tagline: 'Estrategia, branding, piezas y asesoría personalizada.',
    price: '2.490.000',
    currency: 'COP / mes',
    cta: 'Elegir Miracle',
    hasCredits: true,
    credits: '400 créditos / mes',
    creditNote: 'Acumulables hasta 3 meses · Precio preferencial en packs extra',
    sections: [
      {
        label: 'Todo lo del plan Launch, más:',
        items: [
          { icon: '🏷️', text: 'Manual de marca extendido (voz, tono, valores de marca)' },
          { icon: '🖼️', text: 'Brand kit digital completo + plantillas para redes (5 formatos)' },
          { icon: '✏️', text: 'Personalización de diseño sobre el template web elegido' },
          { icon: '🖼️', text: 'Piezas publicitarias: banners, stories, posts y artes para anuncios' },
          { icon: '🧠', text: 'Plan de contenido mensual con calendario editorial' },
          { icon: '🔍', text: 'Análisis de competencia y posicionamiento de marca' },
          { icon: '👤', text: 'Definición de buyer persona y propuesta de valor' },
          { icon: '📈', text: 'Estrategia de crecimiento en redes y pauta digital' },
          { icon: '📞', text: '2 sesiones de asesoría estratégica al mes (1h c/u)' },
          { icon: '💬', text: 'Canal dedicado por WhatsApp' },
          { icon: '📊', text: 'Reportes semanales + análisis de ROI mensual detallado' },
          { icon: '📱', text: 'Gestión de hasta 4 redes sociales' },
          { icon: '🤖', text: 'Agente de IA: atención automática por WhatsApp chat y llamadas' },
          { icon: '📞', text: 'Respuestas inteligentes 24/7 sin intervención humana' },
          { icon: '🧩', text: 'Entrenado con la información de tu negocio (productos, precios, preguntas frecuentes)' },
          { icon: '⚡', text: 'Integración directa desde la plataforma Miracle' },
        ],
      },
    ],
  },
]

export default function LandingPlataforma() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      {/* Hero */}
      <section className="px-6 pt-20 pb-12 max-w-5xl mx-auto">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="h-3 w-3" /> La forma fácil de hacer campañas inteligentes
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Miracle Platform: campañas publicitarias, productos y contenido
              en un solo lugar.
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Centraliza tus clientes, productos y piezas creativas. Lanza campañas en Meta,
              Google y TikTok en minutos, con flujos asistidos por IA que te guían paso a paso,
              aunque no seas experto en marketing.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>Configura tu tienda y múltiples tenants (ej. agencias con varios clientes).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>Crea campañas multi-plataforma con presets inteligentes y plantillas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>Genera copys y piezas con IA y reutiliza assets audiovisuales en segundos.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>Sigue el rendimiento en tiempo real con un dashboard pensado para no-marketers.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Pensado para
            </p>
            <div className="space-y-2 text-sm text-foreground">
              <p>✅ Agencias pequeñas que necesitan ordenar campañas y reportes.</p>
              <p>✅ E-commerce y negocios locales que quieren vender sin depender de terceros.</p>
              <p>✅ Emprendedores que quieren un &quot;equipo de marketing&quot; listo desde el día uno.</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Miracle Platform es la capa de software sobre la que estamos construyendo toda la
              experiencia: multi-tenant, productos, campañas, piezas y agentes de IA para tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Bloque de beneficios rápidos */}
      <section className="px-6 py-6 max-w-5xl mx-auto">
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              01 · Setup guiado
            </p>
            <p className="mt-2 text-foreground">
              Configura tu cuenta, tiendas y productos una sola vez. A partir de ahí, lanzar campañas
              es cuestión de minutos, no de días.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              02 · Creatividades con IA
            </p>
            <p className="mt-2 text-foreground">
              Genera copys, variaciones de anuncios y creatividades apoyadas en IA, usando tus propios
              productos y materiales audiovisuales.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              03 · Rendimiento claro
            </p>
            <p className="mt-2 text-foreground">
              Métricas accionables: campañas activas, inversión estimada, Miracle Coins y resultados sin
              tener que abrir 5 dashboards diferentes.
            </p>
          </div>
        </div>
      </section>

      {/* Planes Spark / Launch / Miracle */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Elige el plan Miracle que conecta con tu negocio
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Todos los planes incluyen acceso a Miracle Platform, configuración inicial y soporte.
            La diferencia está en cuánto delegas en nuestro equipo: solo campañas, campañas + marca
            o estrategia completa con agente de IA.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-2xl border bg-card/80 p-5 shadow-sm ${
                plan.id === 'launch' || plan.id === 'miracle'
                  ? 'border-primary/60 ring-1 ring-primary/20'
                  : 'border-border'
              }`}
            >
              <header className="mb-3">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>
              </header>
              <div className="mb-3">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  ${plan.price}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">{plan.currency}</span>
              </div>
              {plan.hasCredits && (
                <div className="mb-3 rounded-lg bg-muted px-3 py-2 text-xs text-foreground">
                  <div className="font-semibold flex items-center gap-1">
                    🪙 {plan.credits}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{plan.creditNote}</div>
                </div>
              )}
              <button
                type="button"
                className={`mb-4 mt-1 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  plan.id === 'miracle'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background hover:bg-accent'
                }`}
              >
                {plan.cta}
              </button>
              <div className="space-y-3 text-xs text-foreground">
                {plan.sections.map((section, si) => (
                  <div key={si}>
                    {section.label && (
                      <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
                        {section.label}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-2">
                          <span className="mt-0.5 text-sm shrink-0">{item.icon}</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          🪙 1 crédito = 1 pieza publicitaria generada (story, banner, post, anuncio, etc.). Sin contratos
          de permanencia. Cancela cuando quieras.
        </p>
      </section>
    </div>
  )
}
