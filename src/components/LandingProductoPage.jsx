import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, productosApi, pagosApi } from '../utils/api'
import {
  ArrowLeft, Check, Package, ShieldCheck, Zap, Star,
  ChevronLeft, ChevronRight, CreditCard, X,
} from 'lucide-react'
import ImageLightbox from './ImageLightbox.jsx'
import { alertError } from '../utils/alerts'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const WHATSAPP_NUMBER = '573243520379'
const GALLERY_MS = 4200

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

/* ── Gallery ── */
function Gallery({ producto }) {
  const [sel, setSel] = useState(0)
  const [hov, setHov] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const images = (producto.imagenes || [])
    .map((_, i) => getProductoImagenSrc(producto, i))
    .filter(Boolean)

  useEffect(() => {
    if (images.length <= 1 || hov) return
    const id = setInterval(() => setSel((p) => (p + 1) % images.length), GALLERY_MS)
    return () => clearInterval(id)
  }, [images.length, hov])

  const prev = (e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }

  if (images.length === 0) {
    return (
      <div className="gal-empty">
        <Package strokeWidth={1} style={{ width: 52, height: 52, color: '#D0CBC4' }} />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#C0BAB3', marginTop: 12, letterSpacing: '0.08em' }}>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="gal-wrap">
      {lightbox !== null && (
        <ImageLightbox
          imagenes={images}
          indiceActual={lightbox}
          onClose={() => setLightbox(null)}
          onIndexChange={(i) => { setLightbox(i); setSel(i) }}
          getNombreProducto={() => producto.nombre}
        />
      )}

      {/* Main */}
      <div
        className="gal-main"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setLightbox(sel)}
      >
        <div
          className="gal-strip"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(100 / images.length) * sel}%)`,
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="gal-slide" style={{ width: `${100 / images.length}%` }}>
              <img
                src={src}
                alt={`${producto.nombre} ${i + 1}`}
                className="gal-img"
                style={{ transform: hov ? 'scale(1.04)' : 'scale(1)' }}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} className="gal-arr gal-arr-l" aria-label="Anterior">
              <ChevronLeft style={{ width: 18, height: 18 }} />
            </button>
            <button type="button" onClick={next} className="gal-arr gal-arr-r" aria-label="Siguiente">
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="gal-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setSel(i) }}
                className="gal-dot"
                style={{
                  width: i === sel ? 22 : 6,
                  background: i === sel ? '#C8352B' : '#D0CBC4',
                }}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>
        )}

        {producto.tipo === 'producto' && producto.stock > 0 && producto.stock <= 5 && (
          <div className="gal-urgency">
            <Zap style={{ width: 10, height: 10 }} />
            Últimas {producto.stock} unidades
          </div>
        )}

        <div className="gal-zoom" style={{ opacity: hov ? 1 : 0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          Ampliar
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gal-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="gal-thumb"
              style={{
                outline: i === sel ? '2px solid #C8352B' : '2px solid transparent',
                outlineOffset: 2,
                opacity: i === sel ? 1 : 0.45,
              }}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Modal input ── */
function ModalInput({ name, type = 'text', placeholder, half = false, value, error, onChange }) {
  return (
    <div style={{ flex: half ? '1 1 44%' : '1 1 100%', minWidth: half ? 120 : 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="modal-input"
        style={{ borderColor: error ? '#C8352B' : undefined }}
      />
      {error && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: '#C8352B' }}>{error}</span>}
    </div>
  )
}

/* ── Payment Modal ── */
function PagoModal({ producto, cantidad, loading, onClose, onSubmit }) {
  const [datos, setDatos] = useState({
    clienteNombre: '', clienteCelular: '', clienteEmail: '', clienteCedula: '',
    envioDireccion: '', envioBarrio: '', envioUnidad: '', envioTorre: '', envioApto: '',
  })
  const [errs, setErrs] = useState({})

  const set = (k, v) => { setDatos((d) => ({ ...d, [k]: v })); setErrs((e) => ({ ...e, [k]: undefined })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrs = {}
    if (!datos.clienteNombre.trim()) newErrs.clienteNombre = 'Requerido'
    if (!datos.clienteCelular.trim()) newErrs.clienteCelular = 'Requerido'
    if (!datos.clienteEmail.trim()) newErrs.clienteEmail = 'Requerido'
    if (producto?.tipo === 'producto') {
      if (!datos.envioDireccion.trim()) newErrs.envioDireccion = 'Requerido'
      if (!datos.envioBarrio.trim()) newErrs.envioBarrio = 'Requerido'
    }
    if (Object.keys(newErrs).length > 0) { setErrs(newErrs); return }
    onSubmit(datos)
  }

  const inp = (name, props = {}) => (
    <ModalInput name={name} value={datos[name]} error={errs[name]} onChange={set} {...props} />
  )

  return (
    <div className="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Completa tus datos</h2>
            <p className="modal-sub">Para procesar tu pedido correctamente</p>
          </div>
          <button type="button" onClick={onClose} className="modal-close">
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-section">Datos personales</p>
          <div className="modal-row">{inp('clienteNombre', { placeholder: 'Nombre completo *' })}</div>
          <div className="modal-row">
            {inp('clienteCelular', { type: 'tel', placeholder: 'Celular / WhatsApp *', half: true })}
            {inp('clienteEmail', { type: 'email', placeholder: 'Correo electrónico *', half: true })}
          </div>
          <div className="modal-row">{inp('clienteCedula', { placeholder: 'Cédula / NIT (opcional)' })}</div>

          {producto?.tipo === 'producto' && (
            <>
              <div className="modal-divider" />
              <p className="modal-section">Datos de envío</p>
              <div className="modal-row">{inp('envioDireccion', { placeholder: 'Dirección *' })}</div>
              <div className="modal-row">{inp('envioBarrio', { placeholder: 'Barrio / Ciudad *' })}</div>
              <div className="modal-row">{inp('envioUnidad', { placeholder: 'Unidad residencial (opcional)' })}</div>
              <div className="modal-row">
                {inp('envioTorre', { placeholder: 'Torre / Bloque', half: true })}
                {inp('envioApto', { placeholder: 'Apto / Casa', half: true })}
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-mp btn-mp-full">
            <CreditCard style={{ width: 15, height: 15 }} />
            {loading ? 'Procesando...' : 'Continuar al pago'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Main Page ── */
function LandingProductoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { findProductoById } = useProductos()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let cancel = false
    async function load() {
      setCargando(true); setError(null); window.scrollTo(0, 0)
      try {
        const local = findProductoById(id)
        if (local) { if (!cancel) { setProducto(local); setCargando(false) }; return }
        const data = await productosApi.obtener(id)
        if (!cancel) { setProducto(data); setCargando(false) }
      } catch (e) {
        if (!cancel) { setError(e); setCargando(false) }
      }
    }
    load()
    return () => { cancel = true }
  }, [id, findProductoById])

  const handleWhatsApp = () => {
    const msg = [
      'Hola, estoy interesado en:',
      `• Producto: ${producto.nombre}`,
      cantidad > 1 ? `• Cantidad: ${cantidad}` : '',
      producto.precio != null ? `• Precio: ${fmt(producto.precio)}` : '',
      producto.precio != null && cantidad > 1 ? `• Total: ${fmt(producto.precio * cantidad)}` : '',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  const handlePago = async (datos) => {
    setLoadingPago(true)
    try {
      const { init_point } = await pagosApi.crearPreferencia({ productoId: producto.id, cantidad, ...datos })
      window.location.href = init_point
    } catch {
      alertError('No se pudo iniciar el pago. Contáctanos por WhatsApp.')
    } finally {
      setLoadingPago(false)
    }
  }

  if (cargando) {
    return (
      <>
        <style>{LP_CSS}</style>
        <main className="lp-root lp-center">
          <div className="lp-spinner" />
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: '#C0BAB3', letterSpacing: '0.12em', marginTop: 16 }}>
            Cargando...
          </p>
        </main>
      </>
    )
  }

  if (error || !producto) {
    return (
      <>
        <style>{LP_CSS}</style>
        <main className="lp-root lp-center">
          <Package strokeWidth={1} style={{ width: 44, height: 44, color: '#E8E4DF', marginBottom: 16 }} />
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: '#8A8480', marginBottom: 24 }}>
            {error ? 'No se pudo cargar el producto.' : 'Producto no disponible.'}
          </p>
          <button type="button" onClick={() => navigate('/tienda')} className="lp-back-btn">
            <ArrowLeft style={{ width: 13, height: 13 }} />
            Volver a la tienda
          </button>
        </main>
      </>
    )
  }

  const sinStock = producto.stock != null && producto.stock <= 0
  const stockBajo = producto.stock != null && producto.stock > 0 && producto.stock <= 10
  const maxCantidad = (producto.tipo === 'producto' && producto.stock > 0) ? producto.stock : 99

  return (
    <>
      <style>{LP_CSS}</style>

      <main className="lp-root">
        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-nav-inner">
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/tienda'))}
              className="lp-nav-back"
            >
              <ArrowLeft style={{ width: 12, height: 12 }} />
              Tienda
            </button>
            <span className="lp-nav-sep">/</span>
            <span className="lp-nav-crumb">{producto.nombre}</span>
            <div style={{ flex: 1 }} />
            <div className="lp-nav-brand">
              <img
                src="https://miracle-store.s3.us-east-2.amazonaws.com/logo/logo+miracle.png"
                alt="Miracle"
                style={{ height: 30, width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        </nav>

        {/* ── GRID ── */}
        <div className="lp-content">
          <div className="lp-grid">

            {/* Gallery */}
            <div className="lp-col-gallery">
              <Gallery producto={producto} />
            </div>

            {/* Info panel */}
            <div className="lp-col-info">

              {/* Category + status */}
              <div className="lp-tags">
                <span className="lp-tag-cat">{producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
                {!sinStock && producto.tipo === 'producto' && (
                  <span className="lp-tag-avail">
                    <span className="lp-avail-dot" />
                    Disponible
                  </span>
                )}
                {sinStock && <span className="lp-tag-out">Sin stock</span>}
              </div>

              {/* Name */}
              <h1 className="lp-title">{producto.nombre}</h1>

              {/* Price */}
              {producto.precio != null && (
                <div className="lp-price-section">
                  <span className="lp-price">{fmt(producto.precio)}</span>
                  {stockBajo && !sinStock && (
                    <span className="lp-price-tag">
                      <Zap style={{ width: 10, height: 10 }} />
                      Quedan {producto.stock}
                    </span>
                  )}
                </div>
              )}

              {/* Quantity */}
              {!sinStock && (
                <div className="lp-qty">
                  <span className="lp-qty-lbl">Cantidad</span>
                  <div className="lp-qty-ctrl">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      disabled={cantidad <= 1}
                      className="lp-qty-btn"
                      aria-label="Reducir cantidad"
                    >−</button>
                    <span className="lp-qty-val">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                      disabled={cantidad >= maxCantidad}
                      className="lp-qty-btn lp-qty-add"
                      aria-label="Aumentar cantidad"
                    >+</button>
                  </div>
                  {cantidad > 1 && producto.precio != null && (
                    <div className="lp-qty-total">
                      <span>Total</span>
                      <span className="lp-qty-total-val">{fmt(producto.precio * cantidad)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Trust */}
              <div className="lp-trust">
                {[
                  { Icon: ShieldCheck, label: 'Pago seguro' },
                  { Icon: Zap, label: 'Respuesta rápida' },
                  { Icon: Star, label: 'Calidad garantizada' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="lp-trust-item">
                    <Icon strokeWidth={1.5} style={{ width: 15, height: 15, color: '#C8352B' }} />
                    <span className="lp-trust-lbl">{label}</span>
                  </div>
                ))}
              </div>

              <div className="lp-rule" />

              {/* Description */}
              {producto.descripcion && (
                <div className="lp-section">
                  <h2 className="lp-section-h">Descripción</h2>
                  <p className="lp-section-p">{producto.descripcion}</p>
                </div>
              )}

              {/* Characteristics */}
              {producto.caracteristicas?.length > 0 && (
                <div className="lp-section">
                  <h2 className="lp-section-h">Características</h2>
                  <ul className="lp-list">
                    {producto.caracteristicas.map((c, i) => (
                      <li key={i} className="lp-list-item">
                        <span className="lp-check lp-check-red">
                          <Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#C8352B' }} />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Uses */}
              {producto.usos?.length > 0 && (
                <div className="lp-section">
                  <h2 className="lp-section-h">Usos</h2>
                  <ul className="lp-list">
                    {producto.usos.map((u, i) => (
                      <li key={i} className="lp-list-item">
                        <span className="lp-check">
                          <Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#C0BAB3' }} />
                        </span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="lp-rule" />

              {/* CTA buttons */}
              <div className="lp-ctas">
                <button type="button" onClick={handleWhatsApp} className="btn-wa">
                  <WhatsAppIcon size={18} />
                  Pedir por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => !sinStock && setShowModal(true)}
                  disabled={sinStock}
                  className="btn-mp"
                >
                  <CreditCard style={{ width: 15, height: 15 }} />
                  Pagar con MercadoPago
                </button>
                <div className="lp-pay-note">
                  <ShieldCheck strokeWidth={1.5} style={{ width: 12, height: 12, color: '#C0BAB3', flexShrink: 0 }} />
                  <p>Aceptamos <strong>transferencia, efectivo</strong> y otros medios.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE STICKY BAR ── */}
        {producto.precio != null && (
          <div className="lp-sticky">
            <div className="lp-sticky-inner">
              <div className="lp-sticky-price-col">
                <span className="lp-sticky-lbl">{cantidad > 1 ? 'Total' : 'Precio'}</span>
                <span className="lp-sticky-price">{fmt(producto.precio * cantidad)}</span>
              </div>

              {!sinStock && (
                <div className="lp-sticky-qty">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    disabled={cantidad <= 1}
                    className="lp-sticky-qty-btn"
                  >−</button>
                  <span className="lp-sticky-qty-val">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                    disabled={cantidad >= maxCantidad}
                    className="lp-sticky-qty-btn"
                  >+</button>
                </div>
              )}

              <div className="lp-sticky-btns">
                <button
                  type="button"
                  onClick={() => !sinStock && setShowModal(true)}
                  disabled={sinStock}
                  className="lp-sticky-btn lp-sticky-mp"
                >
                  <CreditCard style={{ width: 14, height: 14 }} />
                  Pagar
                </button>
                <button type="button" onClick={handleWhatsApp} className="lp-sticky-btn lp-sticky-wa">
                  <WhatsAppIcon size={15} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <p>© {new Date().getFullYear()} Miracle Solutions · Todos los derechos reservados</p>
        </footer>
      </main>

      {showModal && (
        <PagoModal
          producto={producto}
          cantidad={cantidad}
          loading={loadingPago}
          onClose={() => setShowModal(false)}
          onSubmit={handlePago}
        />
      )}
    </>
  )
}

export default LandingProductoPage

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const LP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    background: #F8F5F1;
    color: #0D0D0D;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
  }
  .lp-center { display: flex; flex-direction: column; align-items: center; justify-content: center; }

  /* ── SPINNER ── */
  .lp-spinner {
    width: 32px; height: 32px;
    border: 2px solid #E8E4DF;
    border-top-color: #C8352B;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── NAV ── */
  .lp-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(248,245,241,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid #E8E4DF;
  }
  .lp-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lp-nav-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8A8480;
    background: none;
    border: 1.5px solid #E8E4DF;
    border-radius: 100px;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .lp-nav-back:hover { color: #C8352B; border-color: #C8352B; background: rgba(200,53,43,0.04); }
  .lp-nav-sep { color: #D0CBC4; font-size: 14px; flex-shrink: 0; }
  .lp-nav-crumb {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #8A8480;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 240px;
  }
  .lp-nav-brand { display: flex; align-items: center; }
  .lp-back-btn {
    display: flex; align-items: center; gap: 7px;
    font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #0D0D0D; background: #fff; border: 1.5px solid #0D0D0D;
    border-radius: 100px; padding: 10px 22px; cursor: pointer;
    transition: all 0.18s ease;
  }
  .lp-back-btn:hover { background: #0D0D0D; color: #fff; }

  /* ── CONTENT ── */
  .lp-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 32px 96px;
  }
  .lp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }
  .lp-col-gallery { min-width: 0; }
  .lp-col-info {
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    scrollbar-width: none;
  }
  .lp-col-info::-webkit-scrollbar { display: none; }

  /* ── GALLERY ── */
  .gal-wrap { display: flex; flex-direction: column; gap: 10px; }
  .gal-main {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #F0EDE9;
    cursor: zoom-in;
    border: 1px solid #E8E4DF;
  }
  .gal-strip {
    display: flex;
    height: 100%;
    transition: transform 0.52s cubic-bezier(.4,0,.2,1);
  }
  .gal-slide { height: 100%; flex-shrink: 0; overflow: hidden; }
  .gal-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(.4,0,.2,1);
  }
  .gal-arr {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border: 1px solid #E8E4DF;
    color: #0D0D0D;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 10;
    transition: all 0.18s ease;
    border-radius: 50%;
  }
  .gal-arr:hover { background: #fff; border-color: #C8352B; color: #C8352B; }
  .gal-arr-l { left: 12px; }
  .gal-arr-r { right: 12px; }
  .gal-dots {
    position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 5px; z-index: 10;
  }
  .gal-dot { height: 4px; border: none; border-radius: 2px; padding: 0; cursor: pointer; transition: all 0.25s ease; }
  .gal-urgency {
    position: absolute; top: 12px; left: 12px;
    display: flex; align-items: center; gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #fff;
    background: #C8352B;
    padding: 5px 11px; z-index: 10;
  }
  .gal-zoom {
    position: absolute; bottom: 14px; right: 14px;
    display: flex; align-items: center; gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: #8A8480;
    background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
    padding: 5px 10px; z-index: 10; transition: opacity 0.22s; pointer-events: none;
    border: 1px solid #E8E4DF;
  }
  .gal-empty {
    aspect-ratio: 4/5;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 1px dashed #E8E4DF;
    background: #F0EDE9;
  }
  .gal-thumbs {
    display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none;
  }
  .gal-thumbs::-webkit-scrollbar { display: none; }
  .gal-thumb {
    width: 64px; height: 64px; flex-shrink: 0; overflow: hidden;
    border: none; padding: 0; cursor: pointer; transition: all 0.18s ease;
    background: #F0EDE9; border-radius: 2px;
  }
  .gal-thumb:hover { opacity: 0.7 !important; }

  /* ── INFO ── */
  .lp-tags { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .lp-tag-cat {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    color: #8A8480;
    border: 1px solid #D0CBC4;
    padding: 4px 12px;
    border-radius: 100px;
  }
  .lp-tag-avail {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 500; color: #22C55E;
  }
  .lp-avail-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22C55E;
    animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .lp-tag-out {
    font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500;
    color: #C8352B; border: 1px solid rgba(200,53,43,0.25);
    padding: 4px 12px; border-radius: 100px;
  }

  .lp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1;
    color: #0D0D0D;
  }

  .lp-price-section {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    padding: 18px 20px;
    border: 1.5px solid #E8E4DF;
    background: #fff;
  }
  .lp-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 5vw, 52px);
    font-weight: 400;
    color: #C8352B; line-height: 1; letter-spacing: 0.04em;
  }
  .lp-price-tag {
    display: flex; align-items: center; gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #fff;
    background: #C8352B; padding: 5px 11px; margin-left: auto;
  }

  .lp-qty {
    display: flex; align-items: center; flex-wrap: wrap; gap: 14px;
    padding: 14px 18px;
    border: 1.5px solid #E8E4DF;
    background: #fff;
  }
  .lp-qty-lbl {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    color: #8A8480; flex: 1;
  }
  .lp-qty-ctrl { display: flex; align-items: center; gap: 0; border: 1.5px solid #E8E4DF; }
  .lp-qty-btn {
    width: 38px; height: 38px;
    border: none;
    background: #F8F5F1;
    color: #0D0D0D;
    font-size: 20px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease; line-height: 1;
  }
  .lp-qty-btn:hover:not(:disabled) { background: #0D0D0D; color: #fff; }
  .lp-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .lp-qty-add { background: #F8F5F1; }
  .lp-qty-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; font-weight: 400; letter-spacing: 0.04em;
    color: #0D0D0D; min-width: 42px; text-align: center;
    border-left: 1.5px solid #E8E4DF;
    border-right: 1.5px solid #E8E4DF;
    display: flex; align-items: center; justify-content: center; height: 38px;
  }
  .lp-qty-total {
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid #F0EDE9; padding-top: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: #8A8480;
  }
  .lp-qty-total-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; font-weight: 400; letter-spacing: 0.04em;
    color: #C8352B;
  }

  .lp-trust {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
    border: 1px solid #E8E4DF;
    background: #E8E4DF;
  }
  .lp-trust-item {
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    padding: 14px 10px;
    background: #fff;
  }
  .lp-trust-lbl {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 0.06em;
    color: #8A8480; text-align: center; line-height: 1.3;
  }

  .lp-rule { height: 1px; background: #E8E4DF; }

  .lp-section { display: flex; flex-direction: column; gap: 10px; }
  .lp-section-h {
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
    color: #C0BAB3;
  }
  .lp-section-p {
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 300; line-height: 1.75;
    color: #8A8480;
  }
  .lp-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .lp-list-item {
    display: flex; align-items: flex-start; gap: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 300; line-height: 1.55;
    color: #8A8480;
  }
  .lp-check {
    width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid #E8E4DF;
    background: #F8F5F1;
  }
  .lp-check-red { border-color: rgba(200,53,43,0.3); background: rgba(200,53,43,0.05); }

  /* ── CTAs ── */
  .lp-ctas { display: flex; flex-direction: column; gap: 10px; }
  .btn-wa {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 16px;
    background: #25D366;
    border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
    transition: opacity 0.18s ease, transform 0.18s ease;
    touch-action: manipulation;
  }
  .btn-wa:hover { opacity: 0.9; transform: translateY(-2px); }
  .btn-wa:active { transform: translateY(0); }
  .btn-mp {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 15px;
    background: #009ee3;
    border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
    transition: opacity 0.18s ease, transform 0.18s ease;
    touch-action: manipulation;
  }
  .btn-mp:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
  .btn-mp:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-mp-full { margin-top: 4px; }
  .lp-pay-note {
    display: flex; align-items: flex-start; gap: 9px;
    padding: 11px 14px;
    border: 1px solid #F0EDE9;
    background: #fff;
  }
  .lp-pay-note p { font-family: 'Outfit',sans-serif; font-size: 12px; color: #8A8480; line-height: 1.6; }
  .lp-pay-note strong { color: #0D0D0D; font-weight: 600; }

  /* ── STICKY BAR ── */
  .lp-sticky {
    position: sticky; bottom: 0; z-index: 40; display: none;
    background: #fff;
    border-top: 2px solid #0D0D0D;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
  }
  .lp-sticky-inner {
    display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  }
  .lp-sticky-price-col { display: flex; flex-direction: column; gap: 1px; }
  .lp-sticky-lbl { font-family: 'Outfit',sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #C0BAB3; }
  .lp-sticky-price { font-family: 'Bebas Neue',sans-serif; font-size: 24px; font-weight: 400; color: #C8352B; line-height: 1; letter-spacing: 0.04em; }
  .lp-sticky-qty {
    display: flex; align-items: center; gap: 0;
    border: 1.5px solid #E8E4DF;
  }
  .lp-sticky-qty-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #8A8480; background: #F8F5F1; border: none;
    cursor: pointer; transition: all 0.15s ease; line-height: 1;
  }
  .lp-sticky-qty-btn:hover:not(:disabled) { background: #0D0D0D; color: #fff; }
  .lp-sticky-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .lp-sticky-qty-val {
    font-family: 'Bebas Neue',sans-serif; font-size: 18px; color: #0D0D0D;
    min-width: 32px; text-align: center; letter-spacing: 0.04em;
    border-left: 1.5px solid #E8E4DF; border-right: 1.5px solid #E8E4DF;
    display: flex; align-items: center; justify-content: center; height: 30px;
  }
  .lp-sticky-btns { margin-left: auto; display: flex; gap: 8px; }
  .lp-sticky-btn {
    display: flex; align-items: center; gap: 6px; padding: 9px 16px;
    border: none; cursor: pointer;
    font-family: 'Outfit',sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    transition: opacity 0.15s ease;
  }
  .lp-sticky-btn:hover { opacity: 0.85; }
  .lp-sticky-mp { background: #009ee3; color: #fff; }
  .lp-sticky-wa { background: #25D366; color: #fff; }

  /* ── MODAL ── */
  .modal-back {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(13,13,13,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: #fff;
    width: 100%; max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    animation: slideUp 0.25s ease;
    border: 1px solid #E8E4DF;
  }
  .modal-box::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-header {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    padding: 24px 24px 20px;
    border-bottom: 1px solid #F0EDE9;
  }
  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; font-weight: 400; letter-spacing: 0.04em;
    color: #0D0D0D; line-height: 1;
  }
  .modal-sub { font-family: 'Outfit',sans-serif; font-size: 13px; color: #8A8480; margin-top: 5px; }
  .modal-close {
    width: 34px; height: 34px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #F8F5F1; border: 1px solid #E8E4DF;
    color: #8A8480; cursor: pointer; transition: all 0.15s ease;
    border-radius: 50%;
  }
  .modal-close:hover { background: #0D0D0D; color: #fff; border-color: #0D0D0D; }
  .modal-form { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 10px; }
  .modal-section {
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
    color: #C0BAB3; margin-top: 4px;
  }
  .modal-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .modal-input {
    width: 100%;
    background: #F8F5F1;
    border: 1.5px solid #E8E4DF;
    padding: 12px 14px;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    color: #0D0D0D; outline: none;
    transition: border-color 0.18s ease;
  }
  .modal-input::placeholder { color: #C0BAB3; }
  .modal-input:focus { border-color: #0D0D0D; background: #fff; }
  .modal-divider { height: 1px; background: #F0EDE9; margin: 4px 0; }

  /* ── FOOTER ── */
  .lp-footer {
    background: #0D0D0D;
    border-top: 1px solid #0D0D0D;
    padding: 24px 32px;
    text-align: center;
  }
  .lp-footer p {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; letter-spacing: 0.04em;
    color: rgba(255,255,255,0.25);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .lp-content { padding: 28px 16px 100px; }
    .lp-grid { grid-template-columns: 1fr; gap: 32px; }
    .lp-col-info { position: static; max-height: none; }
    .lp-nav-inner { padding: 0 16px; }
    .lp-nav-crumb { max-width: 140px; font-size: 12px; }
    .lp-sticky { display: block; }
    .lp-title { font-size: 40px; }
  }
  @media (max-width: 480px) {
    .lp-trust { grid-template-columns: repeat(3,1fr); }
    .modal-header { padding: 18px 16px 16px; }
    .modal-form { padding: 16px 16px 20px; }
    .modal-row { flex-direction: column; }
  }
`
