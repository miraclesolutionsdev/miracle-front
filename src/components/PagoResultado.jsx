import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react'

const WA_BOT = '573243520379'

const ESTADOS = {
  exitoso: {
    icon: CheckCircle,
    iconColor: '#22c55e',
    glowColor: 'rgba(34,197,94,0.12)',
    titulo: '¡Pago exitoso!',
    subtitulo: 'Tu pago fue procesado correctamente.',
    mensaje: 'En breve recibirás la confirmación. Si tienes dudas, escríbenos por WhatsApp.',
    mostrarWhatsapp: true,
  },
  fallido: {
    icon: XCircle,
    iconColor: '#ef4444',
    glowColor: 'rgba(239,68,68,0.10)',
    titulo: 'Pago no completado',
    subtitulo: 'No pudimos procesar tu pago.',
    mensaje: 'Puedes intentarlo de nuevo o contactarnos por WhatsApp para coordinar otro método de pago.',
    mostrarWhatsapp: true,
  },
  pendiente: {
    icon: Clock,
    iconColor: '#f5b342',
    glowColor: 'rgba(245,179,66,0.10)',
    titulo: 'Pago en revisión',
    subtitulo: 'Tu pago está siendo procesado.',
    mensaje: 'MercadoPago está verificando tu transacción. Te notificaremos cuando se confirme. También puedes escribirnos.',
    mostrarWhatsapp: true,
  },
}

function PagoResultado({ tipo }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const estado = ESTADOS[tipo] || ESTADOS.pendiente
  const Icon = estado.icon

  const paymentId = searchParams.get('payment_id')
  const whatsappNumber = searchParams.get('wa') || ''
  const tenantSlug = searchParams.get('slug') || 'miraclesolutions'

  const handleWhatsapp = () => {
    const texto = [
      tipo === 'exitoso'
        ? 'Hola, acabo de realizar un pago en su tienda.'
        : tipo === 'fallido'
          ? 'Hola, tuve un problema con mi pago y quiero coordinar otra forma de pago.'
          : 'Hola, mi pago quedó pendiente de confirmación.',
      paymentId ? `ID de pago: ${paymentId}` : '',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
  }

  const handleVolverTienda = () => {
    const hostname = window.location.hostname

    // Si es dominio custom (no es localhost ni miraclesolutions.com.co), redirigir a la raíz
    if (hostname !== 'localhost' && !hostname.includes('miraclesolutions.com.co')) {
      window.location.href = '/'
      return
    }

    // Si es miraclesolutions.com.co o localhost, usar el slug del query param
    navigate(`/${tenantSlug}/tienda`)
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${estado.glowColor} 0%, #09090e 60%)`,
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">

        {/* Icono */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: `${estado.iconColor}15`, boxShadow: `0 0 40px ${estado.iconColor}20` }}
        >
          <Icon className="h-10 w-10" style={{ color: estado.iconColor }} strokeWidth={1.5} />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{estado.titulo}</h1>
          <p className="text-base font-medium text-white/60">{estado.subtitulo}</p>
          <p className="mt-1 text-sm text-white/35 leading-relaxed">{estado.mensaje}</p>
        </div>

        {/* Payment ID si existe */}
        {paymentId && (
          <div className="w-full rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
            <p className="text-[11px] text-white/30 uppercase tracking-wider">ID de transacción</p>
            <p className="mt-1 font-mono text-sm text-white/50">{paymentId}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex w-full flex-col gap-3">
          {tipo === 'pendiente' && (
            <button
              type="button"
              onClick={() => {
                const texto = `Hola, quiero consultar el estado de mi pago.${paymentId ? `\nID de pago: ${paymentId}` : ''}`
                window.open(`https://wa.me/${WA_BOT}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f5b342 0%, #e09500 100%)' }}
            >
              <RefreshCw className="h-4 w-4" />
              Revisar estado del pago
            </button>
          )}
          {estado.mostrarWhatsapp && whatsappNumber && (
            <button
              type="button"
              onClick={handleWhatsapp}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <MessageCircle className="h-4 w-4" />
              Contactar por WhatsApp
            </button>
          )}
          <button
            type="button"
            onClick={handleVolverTienda}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.05] py-3.5 text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </button>
        </div>
      </div>
    </main>
  )
}

export default PagoResultado
