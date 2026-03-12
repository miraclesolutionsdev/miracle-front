import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { useTiendaEstilo, ESTILOS } from '../context/TiendaEstiloContext.jsx'
import { getProductoImagenSrc, productosApi, pagosApi } from '../utils/api'
import { ArrowLeft, Check, Package, ChevronRight, ShieldCheck, Zap, Star, ChevronLeft, CreditCard } from 'lucide-react'
import ImageLightbox from './ImageLightbox.jsx'
import { toast } from 'sonner'

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

// Cambia este numero por el tuyo en formato internacional, sin "+"
const WHATSAPP_NUMBER = '573001234567'

const WhatsAppIcon = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const GALLERY_INTERVAL_MS = 4000

function ImageGallery({ producto, isClasico }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const images = (producto.imagenes || [])
    .map((_, i) => getProductoImagenSrc(producto, i))
    .filter(Boolean)

  useEffect(() => {
    if (images.length <= 1 || isHovered) return
    const id = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % images.length)
    }, GALLERY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [images.length, isHovered])

  const accent = isClasico ? '#8aad7a' : '#f5b342'
  const accentRgb = isClasico ? '138,173,122' : '245,179,66'

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/[0.06]">
        <Package className="h-20 w-20 text-white/10" strokeWidth={1} />
      </div>
    )
  }

  return (
    <>
      {lightboxIndex !== null && (
        <ImageLightbox
          imagenes={images}
          indiceActual={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(i) => { setLightboxIndex(i); setSelectedIndex(i) }}
          getNombreProducto={() => producto.nombre}
        />
      )}

      <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div
        className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-black/20 ring-1 ring-white/[0.08] cursor-zoom-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setLightboxIndex(selectedIndex)}
      >
        {/* Gradient overlay sutil en la parte inferior */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/40 to-transparent" />

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
              className="flex h-full flex-shrink-0 items-center justify-center overflow-hidden"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={src}
                alt={`${producto.nombre} ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Flechas de navegación */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev - 1 + images.length) % images.length) }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev + 1) % images.length) }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(i) }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === selectedIndex ? '20px' : '6px',
                  backgroundColor: i === selectedIndex ? accent : 'rgba(255,255,255,0.4)',
                }}
                aria-label={`Ver imagen ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge stock urgencia */}
        {producto.tipo === 'producto' && producto.stock != null && producto.stock > 0 && producto.stock <= 5 && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 backdrop-blur-sm">
            <Zap className="h-3 w-3 text-white" />
            <span className="text-[11px] font-bold text-white">¡Últimas {producto.stock} unidades!</span>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200"
              style={{
                outline: i === selectedIndex ? `2px solid ${accent}` : '2px solid transparent',
                outlineOffset: '2px',
                opacity: i === selectedIndex ? 1 : 0.5,
              }}
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
    </>
  )
}

function TrustBadge({ icon: Icon, label, isClasico }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: isClasico ? 'rgba(138,173,122,0.12)' : 'rgba(245,179,66,0.1)' }}
      >
        <Icon
          className="h-4 w-4"
          style={{ color: isClasico ? '#8aad7a' : '#f5b342' }}
          strokeWidth={1.8}
        />
      </div>
      <span className="text-center text-[10px] font-medium text-white/40 leading-tight">{label}</span>
    </div>
  )
}

function LandingProductoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { estilo: estiloContext } = useTiendaEstilo()
  const { findProductoById } = useProductos()

  const paramEstilo = searchParams.get('estilo')
  const estilo =
    paramEstilo === ESTILOS.MODERNO
      ? ESTILOS.MODERNO
      : paramEstilo === ESTILOS.CLASICO
        ? ESTILOS.CLASICO
        : estiloContext
  const isClasico = estilo === ESTILOS.CLASICO

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [showWhatsappForm, setShowWhatsappForm] = useState(false)
  const [loadingPago, setLoadingPago] = useState(false)

  const backUrl = isClasico ? '/tienda?estilo=clasico' : '/tienda?estilo=moderno'

  const accent = isClasico ? '#8aad7a' : '#f5b342'
  const accentDark = isClasico ? '#6a9a5a' : '#d4952a'
  const accentRgb = isClasico ? '138,173,122' : '245,179,66'

  useEffect(() => {
    let cancelado = false
    async function cargar() {
      setCargando(true)
      setError(null)
      window.scrollTo(0, 0)
      try {
        const fromContext = findProductoById(id)
        if (fromContext) {
          if (!cancelado) { setProducto(fromContext); setCargando(false) }
          return
        }
        const data = await productosApi.obtener(id)
        if (!cancelado) { setProducto(data); setCargando(false) }
      } catch (err) {
        if (!cancelado) { setError(err); setCargando(false) }
      }
    }
    cargar()
    return () => { cancelado = true }
  }, [id, findProductoById])

  const handleMercadoPago = async () => {
    setLoadingPago(true)
    try {
      const { init_point } = await pagosApi.crearPreferencia({
        productoId: producto._id,
        nombre,
        telefono,
      })
      window.location.href = init_point
    } catch (err) {
      toast.error('No se pudo iniciar el pago. Intenta de nuevo o contáctanos por WhatsApp.')
    } finally {
      setLoadingPago(false)
    }
  }

  const handleWhatsapp = (e) => {
    e.preventDefault()
    const base = `https://wa.me/${WHATSAPP_NUMBER}`
    const texto = [
      'Hola, estoy interesado en el siguiente producto:',
      `Producto: ${producto.nombre}`,
      producto.precio != null ? `Precio mostrado: ${formatPrecio(producto.precio)}` : '',
      nombre ? `Mi nombre: ${nombre}` : '',
      telefono ? `Mi numero de contacto: ${telefono}` : '',
    ].filter(Boolean).join('\n')
    window.open(`${base}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#0a0a0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />
          <p className="text-sm text-white/30">Cargando producto...</p>
        </div>
      </main>
    )
  }

  if (error || !producto) {
    return (
      <main className="min-h-screen bg-[#0a0a0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Package className="h-12 w-12 text-white/10" strokeWidth={1} />
          <p className="text-sm text-white/40">
            {error ? 'No se pudo cargar el producto.' : 'Producto no disponible.'}
          </p>
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-sm text-white/60 hover:bg-white/[0.10] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </button>
        </div>
      </main>
    )
  }

  const stockBajo = producto.stock != null && producto.stock > 0 && producto.stock <= 10
  const sinStock = producto.stock != null && producto.stock <= 0

  return (
    <>
      <style>{`
        ${isClasico
          ? `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;600;700&display=swap');`
          : `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');`
        }
      `}</style>

      <main
        className="min-h-screen text-white"
        style={{
          background: isClasico
            ? '#0a0b09'
            : '#080808',
          fontFamily: isClasico ? "'Lato', sans-serif" : "'Inter', sans-serif",
        }}
      >
        {/* Navbar */}
        <nav
          className="sticky top-0 z-40 backdrop-blur-xl"
          style={{
            borderBottom: isClasico ? '1px solid #161814' : '1px solid #141414',
            background: isClasico ? 'rgba(10,11,9,0.85)' : 'rgba(8,8,8,0.85)',
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(backUrl))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
              style={{
                fontFamily: isClasico ? "'Lato', sans-serif" : "'Inter', sans-serif",
                fontSize: isClasico ? '10px' : '12px',
                fontWeight: isClasico ? '700' : '500',
                letterSpacing: isClasico ? '0.18em' : '0.05em',
                textTransform: isClasico ? 'uppercase' : 'none',
                color: isClasico ? accent + '80' : 'rgba(255,255,255,0.35)',
                background: 'transparent',
                border: `1px solid ${isClasico ? '#1e2218' : '#1a1a1a'}`,
                borderRadius: isClasico ? '2px' : '8px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver
            </button>
            <span style={{ color: isClasico ? '#1e2218' : '#222' }}>/</span>
            <span
              className="truncate max-w-[200px]"
              style={{
                fontSize: isClasico ? '10px' : '12px',
                letterSpacing: isClasico ? '0.12em' : '0',
                color: isClasico ? '#3a3a2a' : 'rgba(255,255,255,0.25)',
                fontFamily: isClasico ? "'Lato', sans-serif" : "'Inter', sans-serif",
              }}
            >
              {producto.nombre}
            </span>
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_480px] lg:gap-14 xl:gap-20">

            {/* Galería */}
            <ImageGallery producto={producto} isClasico={isClasico} />

            {/* Info */}
            <div className="flex flex-col gap-7">

              {/* Badge tipo */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ backgroundColor: `rgba(${accentRgb},0.12)`, color: accent }}
                >
                  {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
                </span>
                {producto.tipo === 'producto' && producto.stock > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Disponible
                  </span>
                )}
              </div>

              {/* Nombre */}
              <div>
                <h1
                  style={{
                    fontFamily: isClasico ? "'Playfair Display', serif" : "'Syne', sans-serif",
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: isClasico ? '700' : '800',
                    lineHeight: isClasico ? '1.15' : '1.05',
                    letterSpacing: isClasico ? '-0.01em' : '-0.03em',
                    color: isClasico ? '#e8e4dc' : '#ffffff',
                    margin: 0,
                    fontStyle: isClasico ? 'italic' : 'normal',
                  }}
                >
                  {producto.nombre}
                </h1>
              </div>

              {/* Precio destacado */}
              {producto.precio != null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    borderRadius: isClasico ? '2px' : '16px',
                    padding: '16px 20px',
                    backgroundColor: `rgba(${accentRgb},0.07)`,
                    border: `1px solid rgba(${accentRgb},0.15)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: isClasico ? "'Playfair Display', serif" : "'Syne', sans-serif",
                      fontSize: 'clamp(32px, 5vw, 48px)',
                      fontWeight: isClasico ? '700' : '900',
                      letterSpacing: isClasico ? '-0.01em' : '-0.04em',
                      color: accent,
                      lineHeight: 1,
                    }}
                  >
                    {formatPrecio(producto.precio)}
                  </span>
                  {stockBajo && (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400">
                      <Zap className="h-3 w-3" />
                      Quedan {producto.stock}
                    </span>
                  )}
                  {sinStock && (
                    <span className="ml-auto text-sm font-medium text-red-400/80">Sin stock</span>
                  )}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.03] px-4 py-4 ring-1 ring-white/[0.05]">
                <TrustBadge icon={ShieldCheck} label="Pago seguro" isClasico={isClasico} />
                <TrustBadge icon={Zap} label="Respuesta rápida" isClasico={isClasico} />
                <TrustBadge icon={Star} label="Calidad garantizada" isClasico={isClasico} />
              </div>

              {/* Separador */}
              <div className="h-px bg-white/[0.06]" />

              {/* Descripción */}
              {producto.descripcion && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                    Descripción
                  </h2>
                  <p className="text-base leading-relaxed text-white/65">
                    {producto.descripcion}
                  </p>
                </div>
              )}

              {/* Usos */}
              {producto.usos?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                    Usos
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {producto.usos.map((uso, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: `rgba(${accentRgb},0.12)` }}
                        >
                          <Check className="h-3 w-3" style={{ color: accent }} strokeWidth={2.5} />
                        </span>
                        <span className="text-sm text-white/60 leading-relaxed">{uso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Características */}
              {producto.caracteristicas?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                    Características
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {producto.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.05]">
                          <Check className="h-3 w-3 text-white/40" strokeWidth={2.5} />
                        </span>
                        <span className="text-sm text-white/60 leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Separador */}
              <div className="h-px bg-white/[0.06]" />

              {/* CTA Principal */}
              <div className="flex flex-col gap-4">
                {!showWhatsappForm ? (
                  <button
                    type="button"
                    onClick={() => setShowWhatsappForm(true)}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      boxShadow: '0 8px 32px rgba(37,211,102,0.25)',
                    }}
                  >
                    <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/5" />
                    <WhatsAppIcon className="h-5 w-5" />
                    Pedir por WhatsApp
                  </button>
                ) : (
                  <div className="flex flex-col gap-5 rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]">
                          <WhatsAppIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Hablemos por WhatsApp</h3>
                          <p className="text-xs text-white/35">Completa y te redirigimos al chat.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowWhatsappForm(false)}
                        className="text-xs text-white/25 hover:text-white/60 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                    <form onSubmit={handleWhatsapp} className="flex flex-col gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-white/40">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#25D366]/40 focus:outline-none focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-white/40">
                            Celular
                          </label>
                          <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#25D366]/40 focus:outline-none focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                            placeholder="+57 300 000 0000"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        Ir a WhatsApp
                      </button>
                    </form>
                  </div>
                )}

                {/* Botón MercadoPago */}
                <button
                  type="button"
                  onClick={handleMercadoPago}
                  disabled={loadingPago || sinStock}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #009ee3 0%, #0070ba 100%)', boxShadow: '0 6px 24px rgba(0,158,227,0.2)' }}
                >
                  <CreditCard className="h-4 w-4" />
                  {loadingPago ? 'Procesando...' : 'Pagar con MercadoPago'}
                </button>

                {/* Métodos de pago */}
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.04]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-white/25" strokeWidth={1.5} />
                  <p className="text-xs text-white/35">
                    Aceptamos <span className="text-white/50 font-medium">transferencia, efectivo</span> y otros medios. Contáctanos para confirmar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bar mobile */}
        {producto.precio != null && (
          <div
            className="sticky bottom-0 z-40 border-t border-white/[0.06] bg-black/80 backdrop-blur-xl px-4 py-3 lg:hidden"
            style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.4)' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 uppercase tracking-wide">Precio</span>
                <span className="text-lg font-bold" style={{ color: accent }}>
                  {formatPrecio(producto.precio)}
                </span>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={handleMercadoPago}
                  disabled={loadingPago || sinStock}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #009ee3 0%, #0070ba 100%)' }}
                >
                  <CreditCard className="h-4 w-4" />
                  {loadingPago ? '...' : 'Pagar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWhatsappForm(true)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-white/[0.04] mt-12">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
            <p className="text-center text-xs text-white/15">
              {new Date().getFullYear()} Miracle Solutions. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}

export default LandingProductoPage
