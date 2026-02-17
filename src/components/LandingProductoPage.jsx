import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc } from '../utils/api'
import { ArrowLeft, Check, Package, ChevronRight } from 'lucide-react'
import LandingMetodoPago from './LandingMetodoPago'

// Cambia este numero por el tuyo en formato internacional, sin "+"
const WHATSAPP_NUMBER = '573001234567'

const WhatsAppIcon = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const GALLERY_INTERVAL_MS = 5000

function ImageGallery({ producto }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const images = (producto.imagenes || [])
    .map((_, i) => getProductoImagenSrc(producto, i))
    .filter(Boolean)

  // Auto-avance cada 5 segundos con animación fluida
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % images.length)
    }, GALLERY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [images.length])

  const goTo = (i) => setSelectedIndex(i)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#141418] ring-1 ring-white/[0.06]">
        <Package className="h-16 w-16 text-white/10" strokeWidth={1} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#141418] ring-1 ring-white/[0.06]">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(100 / images.length) * selectedIndex}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex h-full flex-shrink-0 items-center justify-center"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={src}
                alt={`${producto.nombre} ${i + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/50 px-2 py-1.5 backdrop-blur-sm">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? 'w-5 bg-amber-400'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-200 ${
                i === selectedIndex
                  ? 'ring-amber-400 shadow-[0_0_12px_rgba(245,179,66,0.2)]'
                  : 'ring-white/[0.06] hover:ring-white/20'
              }`}
            >
              <img
                src={src}
                alt={`${producto.nombre} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LandingProductoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { findProductoById } = useProductos()

  const producto = findProductoById(id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [showWhatsappForm, setShowWhatsappForm] = useState(false)

  if (!producto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d10]">
        <div className="flex flex-col items-center gap-4">
          <Package className="h-12 w-12 text-white/20" strokeWidth={1} />
          <p className="text-white/40">Producto no encontrado.</p>
          <button
            type="button"
            onClick={() => navigate('/tienda')}
            className="mt-2 flex items-center gap-2 rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </button>
        </div>
      </main>
    )
  }

  const handleWhatsapp = (e) => {
    e.preventDefault()
    const base = `https://wa.me/${WHATSAPP_NUMBER}`
    const texto = [
      'Hola, estoy interesado en el siguiente producto:',
      `Producto: ${producto.nombre}`,
      producto.precio ? `Precio mostrado: ${producto.precio}` : '',
      nombre ? `Mi nombre: ${nombre}` : '',
      telefono ? `Mi numero de contacto: ${telefono}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    const url = `${base}?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#0d0d10] text-white">
      <nav className="border-b border-white/[0.04]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate('/tienda')
            }
            className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <ChevronRight className="h-4 w-4 text-white/20" />
          <span className="text-sm text-white/40">
            {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
          </span>
          <ChevronRight className="h-4 w-4 text-white/20" />
          <span className="truncate text-sm text-white/70">{producto.nombre}</span>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ImageGallery producto={producto} />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-amber-400">
                {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
              </span>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                {producto.nombre}
              </h1>
              {producto.precio && (
                <p className="text-3xl font-bold tracking-tight text-amber-400 sm:text-4xl">
                  {producto.precio}
                </p>
              )}
              {producto.stock != null && (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-white/50">
                    {producto.stock} en stock
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                Descripcion
              </h2>
              <p className="text-base leading-relaxed text-white/60">
                {producto.descripcion || 'Sin descripcion disponible.'}
              </p>
            </div>

            {producto.usos?.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Usos
                </h2>
                <ul className="flex flex-col gap-3">
                  {producto.usos.map((uso, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-400/10">
                        <Check className="h-3 w-3 text-amber-400" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed text-white/60">{uso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {producto.caracteristicas?.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Caracteristicas
                </h2>
                <ul className="flex flex-col gap-3">
                  {producto.caracteristicas.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                        <Check className="h-3 w-3 text-white/50" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed text-white/60">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="h-px bg-white/[0.06]" />

            <section className="flex flex-col gap-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Completa tu compra
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Consulta por WhatsApp o paga de forma segura.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch">
                <div className="flex flex-col rounded-2xl bg-[#141418] p-6 ring-1 ring-white/[0.06] sm:p-8">
                  {!showWhatsappForm ? (
                    <button
                      type="button"
                      onClick={() => setShowWhatsappForm(true)}
                      className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#25D366]/30 bg-[#25D366]/[0.04] py-8 transition-all duration-200 hover:border-[#25D366]/60 hover:bg-[#25D366]/[0.08] focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:ring-offset-2 focus:ring-offset-[#141418]"
                      aria-label="Abrir formulario de contacto por WhatsApp"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20">
                        <WhatsAppIcon className="h-7 w-7" />
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-center">
                        <span className="text-sm font-semibold text-white">
                          Consulta por WhatsApp
                        </span>
                        <span className="text-xs text-white/40">
                          Deja tus datos y te redirigimos al chat
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                          <WhatsAppIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            Hablemos por WhatsApp
                          </h3>
                          <p className="text-xs text-white/40">
                            Completa y te redirigimos al chat.
                          </p>
                        </div>
                      </div>
                      <form onSubmit={handleWhatsapp} className="flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-white/60">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-[#25D366]/40 focus:outline-none focus:ring-1 focus:ring-[#25D366]/20"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-white/60">
                              Celular
                            </label>
                            <input
                              type="tel"
                              value={telefono}
                              onChange={(e) => setTelefono(e.target.value)}
                              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-[#25D366]/40 focus:outline-none focus:ring-1 focus:ring-[#25D366]/20"
                              placeholder="+57 300 000 0000"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:ring-offset-2 focus:ring-offset-[#141418]"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          Ir a WhatsApp
                        </button>
                        <p className="text-[11px] text-white/25">
                          Solo para el mensaje inicial en WhatsApp.
                        </p>
                      </form>
                      <button
                        type="button"
                        onClick={() => setShowWhatsappForm(false)}
                        className="self-start text-xs text-white/30 underline transition-colors hover:text-white/60"
                      >
                        Cerrar
                      </button>
                    </div>
                  )}
                </div>
                <LandingMetodoPago producto={producto} />
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/25">
            {new Date().getFullYear()} Miracle Solutions. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}

export default LandingProductoPage
