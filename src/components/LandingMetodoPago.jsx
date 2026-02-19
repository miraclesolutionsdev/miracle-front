import { CreditCard, Lock, Shield } from 'lucide-react'

const formatPrecio = (valor) => {
  if (valor == null || valor === '') return null
  const num = Number(String(valor).replace(/[^0-9.]/g, ''))
  if (Number.isNaN(num) || num === 0) return null
  return `$${num.toLocaleString('es-CO')}`
}

const StripeLogo = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 60 25" fill="currentColor" aria-hidden>
    <path d="M59.64 14.28h-8.06c.19 1.03 1.6 1.59 2.59 1.59 1.64 0 2.96-.37 2.96-1.59 0-.65-.31-1.07-2.34-1.18-2.84-.14-4.52-.73-4.52-2.86 0-1.92 1.75-2.99 4.39-2.99 2.09 0 3.78.49 4.55 1.19.77.7 1.07 1.65 1.07 2.76h-7.95c-.23-1.2-1.34-1.86-2.54-1.86-1.46 0-2.58.47-2.58 1.5 0 .98.79 1.32 2.5 1.4 2.87.12 4.57.66 4.57 2.8 0 2.1-1.68 3.2-4.7 3.2-2.4 0-4.22-.68-5.06-1.64-.84-.96-1.1-2.15-1.1-3.4z" />
  </svg>
)

const MercadoPagoLogo = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 100 24" fill="none" aria-hidden>
    <path d="M20.5 4h-17C1.57 4 0 5.57 0 7.5v9c0 1.93 1.57 3.5 3.5 3.5h17c1.93 0 3.5-1.57 3.5-3.5v-9C24 5.57 22.43 4 20.5 4z" fill="#009EE3" />
    <path d="M12 8.5c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" fill="#FFF" />
    <path d="M30 8h4v8h-4V8zm8 0h4l2 5 2-5h4v8h-4v-5l-1 2-1-2v5h-4V8z" fill="#333" />
  </svg>
)

const PayPalLogo = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 100 24" fill="none" aria-hidden>
    <path d="M42.5 2C39.4 2 36.5 3.5 34.6 6L24 20 13.4 6C11.5 3.5 8.6 2 5.5 2H0V22H6V10.5L12 18L18 10.5V22H24V2H42.5z" fill="#003087" />
    <path d="M42.5 2C45.6 2 48.5 3.5 50.4 6L61 20 71.6 6C73.5 3.5 76.4 2 79.5 2H85V22H79V10.5L73 18L67 10.5V22H61V2H42.5z" fill="#009CDE" />
  </svg>
)

function LandingMetodoPago({ producto }) {
  const precioFormateado = formatPrecio(producto?.precio) || producto?.precio

  const handlePagar = () => {
    // Próximamente: llamar API y redirigir al checkout
    console.info('[Pago] Próximamente conectado al backend.')
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#141418] p-6 ring-1 ring-white/[0.06] transition-all duration-200 hover:ring-amber-400/20 sm:p-8">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <CreditCard className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Pagar con seguridad
            </h2>
            <p className="text-sm text-white/40">
              Aceptamos tarjeta y métodos seguros mediante nuestras pasarelas.
            </p>
          </div>
        </div>

        {precioFormateado && (
          <div className="flex items-baseline justify-between rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06]">
            <span className="text-sm font-medium text-white/60">Total</span>
            <span className="text-xl font-bold text-amber-400">{precioFormateado}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
            Pasarelas disponibles
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#32329f]/20 px-3 text-[#a5a5f8]" title="Stripe">
              <StripeLogo className="h-5" />
            </span>
            <span className="inline-flex h-9 items-center rounded-lg bg-[#009EE3]/15 px-3 text-[#009EE3]" title="Mercado Pago">
              <MercadoPagoLogo className="h-5" />
            </span>
            <span className="inline-flex h-9 items-center rounded-lg bg-[#003087]/15 px-3" title="PayPal">
              <PayPalLogo className="h-5" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/35">
          <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span>Conexión segura. El pago se procesará en la pasarela elegida.</span>
        </div>

        <button
          type="button"
          onClick={handlePagar}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-semibold text-[#0d0d10] shadow-md shadow-amber-400/20 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-[#141418]"
          aria-label="Pagar ahora (próximamente)"
        >
          <Shield className="h-4 w-4" strokeWidth={2} />
          Pagar ahora
        </button>
      </div>
    </div>
  )
}

export default LandingMetodoPago
