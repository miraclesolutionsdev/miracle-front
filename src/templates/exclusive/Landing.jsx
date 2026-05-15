import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight, CreditCard, Package, ShoppingCart, Check, Search } from 'lucide-react'
import ImageLightbox from '../../components/ImageLightbox.jsx'
import { getProductoImagenSrc } from '../../utils/api'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const GALLERY_MS = 4200

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function Gallery({ producto }) {
  const [sel, setSel] = useState(0)
  const [hov, setHov] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const images = (producto.imagenes || []).map((_, i) => getProductoImagenSrc(producto, i)).filter(Boolean)

  useEffect(() => {
    if (images.length <= 1 || hov) return
    const id = setInterval(() => setSel((p) => (p + 1) % images.length), GALLERY_MS)
    return () => clearInterval(id)
  }, [images.length, hov])

  if (images.length === 0) {
    return (
      <div className="exl-gal-empty">
        <Package strokeWidth={1} style={{ width: 52, height: 52, color: '#b8c9b4' }} />
        <span>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="exl-gal">
      {lightbox !== null && (
        <ImageLightbox
          imagenes={images} indiceActual={lightbox}
          onClose={() => setLightbox(null)}
          onIndexChange={(i) => { setLightbox(i); setSel(i) }}
          getNombreProducto={() => producto.nombre}
        />
      )}
      {images.length > 1 && (
        <div className="exl-gal-thumbs">
          {images.map((src, i) => (
            <button key={i} type="button" onClick={() => setSel(i)}
              className={`exl-gal-thumb${i === sel ? ' exl-gal-thumb-active' : ''}`}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
      <div className="exl-gal-main" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setLightbox(sel)}>
        <div className="exl-gal-strip" style={{ width: `${images.length * 100}%`, transform: `translateX(-${(100 / images.length) * sel}%)` }}>
          {images.map((src, i) => (
            <div key={i} style={{ width: `${100 / images.length}%`, flexShrink: 0 }}>
              <img src={src} alt={`${producto.nombre} ${i + 1}`} className="exl-gal-img" style={{ transform: hov ? 'scale(1.03)' : 'scale(1)' }} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="exl-gal-arr exl-gal-arr-l"><ChevronLeft size={16} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="exl-gal-arr exl-gal-arr-r"><ChevronRight size={16} /></button>
          </>
        )}
        {images.length > 1 && (
          <div className="exl-gal-dots">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setSel(i) }} className="exl-gal-dot"
                style={{ width: i === sel ? 18 : 5, background: i === sel ? '#3d4f3a' : 'rgba(61,79,58,0.25)' }} />
            ))}
          </div>
        )}
        <div className="exl-gal-zoom-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
          Ampliar
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'especificaciones', label: 'Especificaciones' },
  { id: 'incluye', label: 'Qué incluye' },
  { id: 'usos', label: 'Usos' },
]

function InfoTabs({ producto }) {
  const tabs = TABS.filter(t => {
    if (t.id === 'descripcion') return !!producto.descripcion
    if (t.id === 'caracteristicas') return producto.caracteristicas?.length > 0
    if (t.id === 'especificaciones') return producto.especificaciones?.length > 0
    if (t.id === 'incluye') return producto.incluye?.length > 0
    if (t.id === 'usos') return producto.usos?.length > 0
    return false
  })

  const [active, setActive] = useState(tabs[0]?.id || '')

  if (tabs.length === 0) return null

  return (
    <div className="exl-tabs-wrap">
      <div className="exl-tabs-bar">
        {tabs.map(t => (
          <button key={t.id} type="button"
            className={`exl-tab-btn${active === t.id ? ' exl-tab-btn-active' : ''}`}
            onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="exl-tab-content">
        {active === 'descripcion' && producto.descripcion && (
          <p className="exl-tab-p">{producto.descripcion}</p>
        )}

        {active === 'caracteristicas' && producto.caracteristicas?.length > 0 && (
          <div className="exl-tab-grid-2">
            {producto.caracteristicas.map((c, i) => (
              <div key={i} className="exl-tab-feat">
                <span className="exl-check"><Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#3d4f3a' }} /></span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}

        {active === 'especificaciones' && producto.especificaciones?.length > 0 && (
          <div className="exl-specs">
            {producto.especificaciones.map((spec, i) => {
              const colonIdx = spec.indexOf(':')
              const key = colonIdx > -1 ? spec.slice(0, colonIdx).trim() : null
              const val = colonIdx > -1 ? spec.slice(colonIdx + 1).trim() : spec
              return (
                <div key={i} className={`exl-spec-row${i % 2 === 0 ? ' exl-spec-row-alt' : ''}`}>
                  {key ? <span className="exl-spec-key">{key}</span> : null}
                  <span className="exl-spec-val" style={!key ? { gridColumn: '1 / -1' } : {}}>{val}</span>
                </div>
              )
            })}
          </div>
        )}

        {active === 'incluye' && producto.incluye?.length > 0 && (
          <div className="exl-tab-kit">
            {producto.incluye.map((item, i) => (
              <div key={i} className="exl-tab-kit-item">
                <span className="exl-check-box">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#b89a5a" strokeWidth="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {active === 'usos' && producto.usos?.length > 0 && (
          <ul className="exl-tab-list">
            {producto.usos.map((u, i) => (
              <li key={i} className="exl-tab-list-item">
                <span className="exl-check exl-check-muted"><Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#7a8275' }} /></span>
                {u}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function ExclusiveLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onAddToCart, onComprar, isInCart, navigateBack, tenantSlug }) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    const base = tenantSlug ? `/${tenantSlug}/tienda` : '/'
    navigate(`${base}?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const handleCartClick = () => {
    navigate(tenantSlug ? `/${tenantSlug}/carrito` : '/carrito')
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="exl-root">

        <nav className="exl-nav">
          <div className="exl-nav-inner">
            {!searchOpen ? (
              <>
                <button type="button" onClick={navigateBack} className="exl-nav-back">
                  <ArrowLeft size={12} /> Tienda
                </button>
                <span className="exl-nav-sep">/</span>
                <span className="exl-nav-crumb">{producto.nombre}</span>
                <div className="exl-nav-actions">
                  <button type="button" className="exl-nav-icon-btn" aria-label="Buscar" onClick={() => setSearchOpen(true)}>
                    <Search size={16} />
                  </button>
                  <button type="button" className="exl-nav-icon-btn" aria-label="Carrito" onClick={handleCartClick}>
                    <ShoppingCart size={16} />
                    {isInCart && <span className="exl-nav-cart-dot" />}
                  </button>
                </div>
              </>
            ) : (
              <form className="exl-nav-search-form" onSubmit={handleSearchSubmit}>
                <Search size={15} className="exl-nav-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="exl-nav-search-input"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" className="exl-nav-icon-btn" aria-label="Cerrar búsqueda" onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
                  <ArrowLeft size={16} />
                </button>
              </form>
            )}
          </div>
        </nav>

        {/* TOP: galería + compra */}
        <div className="exl-content">
          <div className="exl-grid">

            {/* Galería */}
            <div className="exl-col-gal">
              <Gallery producto={producto} />
            </div>

            {/* Panel de compra — sticky */}
            <div className="exl-col-buy">
              <div className="exl-buy-sticky">

                {/* Tags de disponibilidad */}
                <div className="exl-tags">
                  <span className="exl-tag-cat">{producto.categoria || 'Producto'}</span>
                  {!sinStock && (
                    <span className="exl-tag-avail">
                      <span className="exl-avail-dot" /> Disponible
                    </span>
                  )}
                  {sinStock && <span className="exl-tag-out">Sin stock</span>}
                </div>

                <h1 className="exl-title">{producto.nombre}</h1>

                {/* Precio */}
                {producto.precio != null && (
                  <div className="exl-price-section">
                    <div className="exl-price-row">
                      <span className="exl-price">{fmt(producto.precio)}</span>
                      {stockBajo && !sinStock && (
                        <span className="exl-price-tag">
                          <Zap size={10} /> Quedan {producto.stock}
                        </span>
                      )}
                    </div>
                    {cantidad > 1 && (
                      <div className="exl-price-total">
                        <span className="exl-price-total-lbl">Total</span>
                        <span className="exl-price-total-val">{fmt(producto.precio * cantidad)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cantidad */}
                {!sinStock && (
                  <div className="exl-qty">
                    <span className="exl-qty-lbl">Cantidad</span>
                    <div className="exl-qty-ctrl">
                      <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="exl-qty-btn" aria-label="Reducir cantidad">−</button>
                      <span className="exl-qty-val">{cantidad}</span>
                      <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="exl-qty-btn" aria-label="Aumentar cantidad">+</button>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="exl-ctas">
                  <button type="button" onClick={onComprar} disabled={sinStock} className="exl-btn-mp">
                    <CreditCard size={14} /> Comprar ahora
                  </button>
                  <button type="button" onClick={onAddToCart} disabled={sinStock} className={`exl-btn-cart${isInCart ? ' exl-btn-cart-active' : ''}`}>
                    <ShoppingCart size={14} /> {isInCart ? 'En el carrito ✓' : 'Agregar al carrito'}
                  </button>
                  <button type="button" onClick={onWhatsApp} className="exl-btn-wa">
                    <WhatsAppIcon size={15} /> Consultar por WhatsApp
                  </button>
                </div>

                {/* Trust row */}
                <div className="exl-trust-row">
                  {[
                    { Icon: ShieldCheck, label: 'Pago seguro' },
                    { Icon: Zap, label: 'Respuesta rápida' },
                    { Icon: Star, label: 'Garantía de calidad' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="exl-trust-item">
                      <div className="exl-trust-icon">
                        <Icon strokeWidth={1.5} style={{ width: 14, height: 14 }} />
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Pay note */}
                <div className="exl-pay-note">
                  <ShieldCheck strokeWidth={1.5} style={{ width: 12, height: 12, color: '#5a7055', flexShrink: 0 }} />
                  <p>Aceptamos <strong>transferencia, efectivo</strong> y otros medios de pago.</p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: tabs de info detallada full-width */}
        <div className="exl-detail">
          <div className="exl-detail-inner">
            <InfoTabs producto={producto} />
          </div>
        </div>

        <footer className="exl-footer">
          {/* Top: newsletter + columnas */}
          <div className="exl-footer-top">

            {/* Col 1 — Newsletter */}
            <div className="exl-footer-col exl-footer-col-news">
              <p className="exl-footer-eyebrow">Únete a la comunidad</p>
              <h3 className="exl-footer-news-title">Recibe novedades<br />y ofertas exclusivas</h3>
              <form className="exl-footer-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Tu correo electrónico" className="exl-footer-input" />
                <button type="submit" className="exl-footer-sub-btn">Suscribirse</button>
              </form>
              <p className="exl-footer-consent">Al suscribirte aceptas nuestra <a href="#" className="exl-footer-link">política de privacidad</a>.</p>
            </div>

            {/* Col 2 — Categorías */}
            <div className="exl-footer-col">
              <p className="exl-footer-col-title">Categorías</p>
              <ul className="exl-footer-list">
                {['Pen Portátiles', 'Desktop', 'Accesorios', 'Kits', 'Ofertas'].map(item => (
                  <li key={item}><button type="button" className="exl-footer-list-btn" onClick={() => navigate(tenantSlug ? `/${tenantSlug}/tienda` : '/')}>{item}</button></li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Servicio */}
            <div className="exl-footer-col">
              <p className="exl-footer-col-title">Servicio al cliente</p>
              <ul className="exl-footer-list">
                {['Cómo comprar', 'Política de envíos', 'Garantías y devoluciones', 'Contáctanos'].map(item => (
                  <li key={item}><span className="exl-footer-list-item">{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Info */}
            <div className="exl-footer-col">
              <p className="exl-footer-col-title">Información</p>
              <ul className="exl-footer-list">
                <li><span className="exl-footer-list-item">Lun – Vie: 8:00 am – 6:00 pm</span></li>
                <li><span className="exl-footer-list-item">Sáb: 9:00 am – 1:00 pm</span></li>
                <li>
                  <a href="https://wa.me/573243520379" target="_blank" rel="noopener noreferrer" className="exl-footer-link exl-footer-wa-link">
                    <WhatsAppIcon size={13} /> 324 352 0379
                  </a>
                </li>
              </ul>
              {/* Social */}
              <div className="exl-footer-social">
                {[
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z' },
                ].map(({ label, path }) => (
                  <a key={label} href="#" aria-label={label} className="exl-footer-social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={path} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="exl-footer-bottom">
            <div className="exl-footer-bottom-inner">
              <div className="exl-footer-bottom-brand">
                <span className="exl-footer-logo-mark">◈</span>
                <span className="exl-footer-logo-text">VP LUXURY</span>
              </div>
              <p className="exl-footer-copy">© {new Date().getFullYear()} VP Luxury · Todos los derechos reservados</p>
              <div className="exl-footer-bottom-links">
                <span className="exl-footer-bottom-link">Privacidad</span>
                <span className="exl-footer-bottom-sep">·</span>
                <span className="exl-footer-bottom-link">Términos</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bone: #f7f5f0;
    --bone-mid: #ede9e1;
    --bone-border: #ddd8ce;
    --sage: #3d4f3a;
    --sage-light: #5a7055;
    --sage-pale: #e8ede7;
    --ink: #2c3028;
    --ink-mid: #4a5246;
    --ink-muted: #7a8275;
    --gold: #b89a5a;
    --gold-pale: rgba(184,154,90,0.12);
  }

  .exl-root { min-height: 100vh; background: #fff; color: var(--ink); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  /* ── NAV ── */
  .exl-nav { position: sticky; top: 0; z-index: 40; background: var(--sage); border-bottom: 1px solid rgba(0,0,0,0.12); }
  .exl-nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem; height: 56px; display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden; }
  .exl-nav-back { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: rgba(247,245,240,0.9); background: none; border: none; cursor: pointer; padding: 6px 0; letter-spacing: 0.05em; transition: opacity 0.15s; font-family: 'Inter', sans-serif; white-space: nowrap; flex-shrink: 0; min-height: 44px; text-transform: uppercase; }
  .exl-nav-back:hover { opacity: 0.65; }
  .exl-nav-sep { color: rgba(247,245,240,0.3); font-size: 12px; flex-shrink: 0; }
  .exl-nav-crumb { font-size: 12px; color: rgba(247,245,240,0.65); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1; font-style: italic; font-family: 'Playfair Display', serif; }
  .exl-nav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; margin-left: auto; }
  .exl-nav-icon-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: rgba(247,245,240,0.1); border: none; cursor: pointer; color: rgba(247,245,240,0.85); transition: background 0.15s; position: relative; }
  .exl-nav-icon-btn:hover { background: rgba(247,245,240,0.22); }
  .exl-nav-cart-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--gold); border: 1.5px solid var(--sage); }
  .exl-nav-search-form { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
  .exl-nav-search-icon { color: rgba(247,245,240,0.6); flex-shrink: 0; }
  .exl-nav-search-input { flex: 1; min-width: 0; background: rgba(247,245,240,0.12); border: 1px solid rgba(247,245,240,0.25); border-radius: 6px; padding: 7px 12px; font-size: 13px; color: #f7f5f0; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, background 0.15s; }
  .exl-nav-search-input::placeholder { color: rgba(247,245,240,0.4); }
  .exl-nav-search-input:focus { border-color: rgba(247,245,240,0.5); background: rgba(247,245,240,0.18); }

  /* ── LAYOUT ── */
  .exl-content { max-width: 1280px; margin: 0 auto; padding: 2.5rem 2.5rem 2rem; }
  .exl-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: start; }

  /* ── GALLERY ── */
  .exl-col-gal { width: 100%; min-width: 0; }
  .exl-gal { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .exl-gal-empty { aspect-ratio: 1/1; background: var(--bone); border: 1px solid var(--bone-border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 100%; border-radius: 8px; }
  .exl-gal-empty span { font-size: 11px; color: var(--ink-muted); letter-spacing: 0.08em; }

  .exl-gal-main { position: relative; overflow: hidden; cursor: zoom-in; background: var(--bone); aspect-ratio: 1/1; width: 100%; border-radius: 12px; border: 1px solid var(--bone-border); }
  .exl-gal-strip { display: flex; transition: transform 0.45s cubic-bezier(.4,0,.2,1); height: 100%; }
  .exl-gal-img { width: 100%; height: 100%; object-fit: contain; display: block; transition: transform 0.5s ease; padding: 16px; }

  .exl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; background: rgba(247,245,240,0.92); backdrop-filter: blur(8px); border: 1px solid var(--bone-border); color: var(--ink); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.18s; border-radius: 50%; box-shadow: 0 2px 8px rgba(44,48,40,0.08); }
  .exl-gal-arr:hover { background: #fff; border-color: var(--sage); color: var(--sage); transform: translateY(-50%) scale(1.06); }
  .exl-gal-arr-l { left: 12px; }
  .exl-gal-arr-r { right: 12px; }

  .exl-gal-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 5; background: rgba(247,245,240,0.7); backdrop-filter: blur(6px); padding: 5px 8px; border-radius: 20px; }
  .exl-gal-dot { height: 5px; border: none; padding: 0; cursor: pointer; transition: all 0.22s; border-radius: 3px; min-width: 5px; }

  .exl-gal-zoom-hint { position: absolute; bottom: 12px; right: 12px; display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 500; color: var(--ink-mid); letter-spacing: 0.06em; background: rgba(247,245,240,0.85); backdrop-filter: blur(6px); padding: 4px 9px; border-radius: 20px; pointer-events: none; opacity: 0; transition: opacity 0.2s; border: 1px solid var(--bone-border); }
  .exl-gal-main:hover .exl-gal-zoom-hint { opacity: 1; }

  .exl-gal-thumbs { display: flex; flex-direction: row; gap: 8px; width: 100%; overflow-x: auto; overflow-y: visible; scrollbar-width: none; padding-bottom: 2px; }
  .exl-gal-thumbs::-webkit-scrollbar { display: none; }
  .exl-gal-thumb { width: 64px; height: 64px; flex-shrink: 0; cursor: pointer; border: 1.5px solid transparent; padding: 3px; background: var(--bone); transition: border-color 0.18s, opacity 0.18s; overflow: hidden; border-radius: 8px; opacity: 0.55; }
  .exl-gal-thumb img { border-radius: 5px; }
  .exl-gal-thumb:hover { opacity: 0.85; border-color: var(--bone-border); }
  .exl-gal-thumb-active { border-color: var(--sage) !important; opacity: 1 !important; }

  /* ── BUY PANEL ── */
  .exl-col-buy {}
  .exl-buy-sticky { position: sticky; top: 72px; display: flex; flex-direction: column; gap: 0; }

  .exl-tags { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
  .exl-tag-cat { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sage); background: var(--sage-pale); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(61,79,58,0.18); }
  .exl-tag-avail { font-size: 11px; color: var(--sage-light); display: flex; align-items: center; gap: 5px; font-weight: 500; }
  .exl-avail-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage-light); flex-shrink: 0; box-shadow: 0 0 0 3px rgba(90,112,85,0.2); }
  .exl-tag-out { font-size: 11px; color: var(--ink-muted); background: var(--bone); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--bone-border); }

  .exl-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.6vw, 34px); font-weight: 500; line-height: 1.2; margin-bottom: 1.4rem; color: var(--ink); letter-spacing: -0.01em; }

  /* Precio */
  .exl-price-section { margin-bottom: 1.3rem; background: linear-gradient(135deg, var(--bone) 0%, #f0ece3 100%); padding: 1.1rem 1.3rem; border: 1px solid var(--bone-border); border-radius: 10px; border-left: 3px solid var(--gold); }
  .exl-price-row { display: flex; align-items: center; gap: 12px; }
  .exl-price { font-family: 'Playfair Display', serif; font-size: 30px; color: var(--ink); line-height: 1; font-weight: 500; }
  .exl-price-tag { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: var(--gold); letter-spacing: 0.04em; background: var(--gold-pale); padding: 3px 8px; border-radius: 20px; }
  .exl-price-total { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--bone-border); }
  .exl-price-total-lbl { font-size: 11px; color: var(--ink-muted); letter-spacing: 0.06em; text-transform: uppercase; }
  .exl-price-total-val { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--ink-mid); }

  /* Cantidad */
  .exl-qty { margin-bottom: 1.3rem; display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; background: var(--bone); border: 1px solid var(--bone-border); border-radius: 10px; }
  .exl-qty-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
  .exl-qty-ctrl { display: inline-flex; align-items: center; border: 1px solid var(--bone-border); background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(44,48,40,0.06); }
  .exl-qty-btn { width: 38px; height: 38px; background: transparent; border: none; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink); transition: background 0.15s; font-family: 'Inter', sans-serif; }
  .exl-qty-btn:hover:not(:disabled) { background: var(--bone); }
  .exl-qty-btn:disabled { color: var(--bone-border); cursor: default; }
  .exl-qty-val { width: 44px; text-align: center; font-size: 15px; font-weight: 600; border-left: 1px solid var(--bone-border); border-right: 1px solid var(--bone-border); height: 38px; display: flex; align-items: center; justify-content: center; color: var(--ink); }

  /* CTAs */
  .exl-ctas { display: flex; flex-direction: column; gap: 9px; margin-bottom: 1.4rem; }

  .exl-btn-mp { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 15px 24px; background: var(--sage); color: #f7f5f0; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; box-shadow: 0 4px 14px rgba(61,79,58,0.25); }
  .exl-btn-mp:hover { background: #2e3d2b; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(61,79,58,0.3); }
  .exl-btn-mp:active { transform: translateY(0); }
  .exl-btn-mp:disabled { background: var(--bone-border); color: var(--ink-muted); cursor: default; box-shadow: none; transform: none; }

  .exl-btn-cart { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 14px 24px; background: transparent; color: var(--sage); border: 1.5px solid var(--sage); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; }
  .exl-btn-cart:hover { background: var(--sage-pale); }
  .exl-btn-cart:disabled { opacity: 0.38; cursor: not-allowed; }
  .exl-btn-cart-active { background: var(--sage-pale) !important; color: var(--sage) !important; border-color: var(--sage) !important; }

  .exl-btn-wa { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 14px 24px; background: #fff; color: #128c3a; border: 1.5px solid #a8e0bb; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; }
  .exl-btn-wa:hover { background: #f0faf4; border-color: #25D366; }

  /* Trust row */
  .exl-trust-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 1rem; }
  .exl-trust-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 6px; background: var(--bone); border: 1px solid var(--bone-border); border-radius: 8px; text-align: center; }
  .exl-trust-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--sage-pale); display: flex; align-items: center; justify-content: center; color: var(--sage); }
  .exl-trust-item span { font-size: 9.5px; font-weight: 500; color: var(--ink-muted); letter-spacing: 0.03em; line-height: 1.3; }

  .exl-pay-note { display: flex; align-items: flex-start; gap: 8px; background: var(--bone); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--bone-border); }
  .exl-pay-note p { font-size: 11px; color: var(--ink-muted); line-height: 1.6; }
  .exl-pay-note strong { color: var(--ink-mid); font-weight: 500; }

  /* ── DETAIL SECTION ── */
  .exl-detail { background: var(--bone); border-top: 1px solid var(--bone-border); }
  .exl-detail-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem 3.5rem; }

  /* Tabs bar */
  .exl-tabs-wrap {}
  .exl-tabs-bar { display: flex; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid var(--bone-border); }
  .exl-tabs-bar::-webkit-scrollbar { display: none; }
  .exl-tab-btn { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-muted); background: none; border: none; border-bottom: 2px solid transparent; padding: 1.2rem 1.6rem; cursor: pointer; white-space: nowrap; transition: color 0.15s, border-color 0.15s; margin-bottom: -1px; }
  .exl-tab-btn:hover { color: var(--ink-mid); }
  .exl-tab-btn-active { color: var(--ink); border-bottom-color: var(--gold); }

  /* Tab content */
  .exl-tab-content { padding: 2.5rem 0 0; }
  .exl-tab-p { font-size: 14px; line-height: 1.95; color: var(--ink-mid); max-width: 780px; white-space: pre-wrap; }

  /* Características: cards en grid */
  .exl-tab-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 900px; }
  .exl-tab-feat { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: var(--ink-mid); line-height: 1.6; background: #fff; border: 1px solid var(--bone-border); padding: 12px 14px; border-radius: 8px; }

  /* Usos */
  .exl-tab-list { list-style: none; display: flex; flex-direction: column; gap: 8px; max-width: 600px; }
  .exl-tab-list-item { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: var(--ink-mid); line-height: 1.6; padding: 10px 14px; background: #fff; border: 1px solid var(--bone-border); border-radius: 8px; }

  /* Kit */
  .exl-tab-kit { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; max-width: 900px; }
  .exl-tab-kit-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--ink-mid); background: #fff; border: 1px solid var(--bone-border); padding: 14px 16px; border-radius: 10px; transition: border-color 0.18s, box-shadow 0.18s; }
  .exl-tab-kit-item:hover { border-color: rgba(61,79,58,0.3); box-shadow: 0 2px 10px rgba(61,79,58,0.07); }

  /* Specs */
  .exl-specs { display: flex; flex-direction: column; border: 1px solid var(--bone-border); border-radius: 10px; overflow: hidden; max-width: 700px; box-shadow: 0 2px 12px rgba(44,48,40,0.05); }
  .exl-spec-row { display: grid; grid-template-columns: 1fr 1.6fr; padding: 11px 18px; background: #fff; border-bottom: 1px solid var(--bone-border); }
  .exl-spec-row:last-child { border-bottom: none; }
  .exl-spec-row-alt { background: var(--bone); }
  .exl-spec-key { font-size: 12px; font-weight: 600; color: var(--ink-mid); letter-spacing: 0.02em; }
  .exl-spec-val { font-size: 12px; color: var(--ink-muted); }

  /* Shared check icons */
  .exl-check { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; background: var(--sage-pale); flex-shrink: 0; margin-top: 1px; border-radius: 5px; }
  .exl-check-muted { background: rgba(122,130,117,0.1); }
  .exl-check-box { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; background: var(--gold-pale); border: 1px solid rgba(184,154,90,0.3); flex-shrink: 0; border-radius: 5px; }

  /* ── FOOTER ── */
  .exl-footer { background: var(--ink); }

  .exl-footer-top { max-width: 1280px; margin: 0 auto; padding: 3.5rem 2.5rem 3rem; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; border-bottom: 1px solid rgba(247,245,240,0.08); }

  /* Newsletter col */
  .exl-footer-col-news {}
  .exl-footer-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
  .exl-footer-news-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; color: rgba(247,245,240,0.92); line-height: 1.3; margin-bottom: 1.4rem; }
  .exl-footer-form { display: flex; gap: 0; margin-bottom: 10px; border: 1px solid rgba(247,245,240,0.15); border-radius: 6px; overflow: hidden; }
  .exl-footer-input { flex: 1; background: rgba(247,245,240,0.06); border: none; padding: 10px 14px; font-size: 12px; color: rgba(247,245,240,0.85); font-family: 'Inter', sans-serif; outline: none; }
  .exl-footer-input::placeholder { color: rgba(247,245,240,0.35); }
  .exl-footer-sub-btn { background: var(--gold); color: var(--ink); border: none; padding: 10px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; transition: background 0.18s; }
  .exl-footer-sub-btn:hover { background: #c9aa6a; }
  .exl-footer-consent { font-size: 10px; color: rgba(247,245,240,0.3); line-height: 1.5; }

  /* Link general */
  .exl-footer-link { color: rgba(247,245,240,0.5); text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
  .exl-footer-link:hover { color: rgba(247,245,240,0.85); }
  .exl-footer-wa-link { display: inline-flex; align-items: center; gap: 6px; color: rgba(247,245,240,0.6) !important; text-decoration: none !important; transition: color 0.15s; }
  .exl-footer-wa-link:hover { color: #25D366 !important; }

  /* Columnas */
  .exl-footer-col {}
  .exl-footer-col-title { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(247,245,240,0.4); margin-bottom: 1.1rem; }
  .exl-footer-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .exl-footer-list-btn { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(247,245,240,0.65); padding: 0; transition: color 0.15s; text-align: left; }
  .exl-footer-list-btn:hover { color: rgba(247,245,240,0.95); }
  .exl-footer-list-item { font-size: 13px; color: rgba(247,245,240,0.55); line-height: 1.5; }

  /* Social */
  .exl-footer-social { display: flex; gap: 8px; margin-top: 1.4rem; }
  .exl-footer-social-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(247,245,240,0.14); display: flex; align-items: center; justify-content: center; color: rgba(247,245,240,0.5); transition: border-color 0.18s, color 0.18s, background 0.18s; }
  .exl-footer-social-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(184,154,90,0.08); }

  /* Bottom bar */
  .exl-footer-bottom { border-top: 1px solid rgba(247,245,240,0.06); }
  .exl-footer-bottom-inner { max-width: 1280px; margin: 0 auto; padding: 1.3rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .exl-footer-bottom-brand { display: flex; align-items: center; gap: 8px; }
  .exl-footer-logo-mark { font-size: 16px; color: var(--gold); opacity: 0.8; }
  .exl-footer-logo-text { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; color: rgba(247,245,240,0.7); }
  .exl-footer-copy { font-size: 10.5px; color: rgba(247,245,240,0.28); letter-spacing: 0.04em; }
  .exl-footer-bottom-links { display: flex; align-items: center; gap: 8px; }
  .exl-footer-bottom-link { font-size: 10.5px; color: rgba(247,245,240,0.35); cursor: pointer; transition: color 0.15s; }
  .exl-footer-bottom-link:hover { color: rgba(247,245,240,0.7); }
  .exl-footer-bottom-sep { font-size: 10px; color: rgba(247,245,240,0.2); }

  /* ── DESKTOP: thumbs verticales ── */
  @media (min-width: 1024px) {
    .exl-gal { flex-direction: row; gap: 12px; }
    .exl-gal-main { aspect-ratio: 4/5; max-height: 520px; flex: 1; }
    .exl-gal-thumbs { flex-direction: column; width: 72px; max-width: 72px; max-height: 520px; overflow-y: auto; overflow-x: visible; order: -1; gap: 8px; }
    .exl-gal-thumb { width: 72px; height: 72px; }
  }

  /* ── TABLET ── */
  @media (max-width: 1023px) {
    .exl-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .exl-buy-sticky { position: static; }
    .exl-content { padding: 1.5rem 1.5rem; }
    .exl-nav-inner { padding: 0 1.5rem; }
    .exl-nav-crumb { max-width: 220px; }
    .exl-detail-inner { padding: 0 1.5rem 2.5rem; }
    .exl-tab-grid-2 { grid-template-columns: 1fr; }
    .exl-tab-kit { grid-template-columns: 1fr 1fr; }
    .exl-title { font-size: clamp(20px, 5vw, 28px); }
    .exl-gal-main { aspect-ratio: 4/3; }
    .exl-gal-thumb { width: 60px; height: 60px; }
    .exl-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2.5rem 1.5rem 2rem; }
    .exl-footer-bottom-inner { padding: 1.1rem 1.5rem; }
  }

  /* ── MOBILE ── */
  @media (max-width: 640px) {
    .exl-root { overflow-x: hidden; }
    .exl-nav-inner { padding: 0 1rem; gap: 6px; height: 50px; }
    .exl-nav-crumb { max-width: calc(100vw - 140px); font-size: 11px; }
    .exl-nav-back { font-size: 11px; gap: 4px; }

    .exl-content { padding: 0; }
    .exl-grid { gap: 0; }
    .exl-col-gal { width: 100%; }

    .exl-gal { gap: 0; }
    .exl-gal-main { aspect-ratio: 1/1; width: 100%; border-radius: 0; border-left: none; border-right: none; }
    .exl-gal-thumbs { padding: 10px 14px; gap: 8px; background: var(--bone); border-bottom: 1px solid var(--bone-border); }
    .exl-gal-thumb { width: 54px; height: 54px; }
    .exl-gal-arr { width: 34px; height: 34px; }

    .exl-col-buy { padding: 0; }
    .exl-buy-sticky { padding: 1.2rem 1.1rem 1.5rem; }

    .exl-tags { margin-bottom: 10px; }
    .exl-title { font-size: clamp(18px, 5.5vw, 23px); margin-bottom: 1rem; }

    .exl-price-section { border-radius: 8px; padding: 0.9rem 1rem; }
    .exl-price { font-size: 26px; }

    .exl-qty { border-radius: 8px; }
    .exl-qty-btn { width: 44px; height: 44px; font-size: 20px; }
    .exl-qty-val { width: 44px; height: 44px; }

    .exl-ctas { gap: 9px; margin-bottom: 1.2rem; }
    .exl-btn-cart, .exl-btn-mp, .exl-btn-wa { padding: 15px 16px; min-height: 52px; font-size: 11px; }

    .exl-trust-row { grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .exl-trust-item { padding: 8px 4px; }
    .exl-trust-item span { font-size: 9px; }
    .exl-trust-icon { width: 24px; height: 24px; }

    .exl-pay-note { padding: 8px 12px; }
    .exl-pay-note p { font-size: 10.5px; }

    .exl-detail-inner { padding: 0 1rem 2rem; }
    .exl-tab-btn { padding: 0.85rem 0.8rem; font-size: 9.5px; }
    .exl-tab-content { padding: 1.4rem 0 0; }
    .exl-tab-p { font-size: 13px; }
    .exl-tab-grid-2 { grid-template-columns: 1fr; }
    .exl-tab-kit { grid-template-columns: 1fr; }
    .exl-specs { max-width: 100%; border-radius: 8px; }
    .exl-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2.5rem 1.1rem 2rem; }
    .exl-footer-bottom-inner { padding: 1.1rem 1.1rem; flex-wrap: wrap; gap: 6px; }
    .exl-footer-copy { font-size: 10px; }
    .exl-footer-news-title { font-size: 18px; }
    .exl-spec-row { grid-template-columns: 1fr 1.2fr; padding: 8px 10px; }
    .exl-spec-key, .exl-spec-val { font-size: 11px; }
    .exl-tab-grid-2 { gap: 8px 0; }
  }

  /* ── FOOTER MOBILE ── */
  @media (max-width: 480px) {
    .exl-footer-top { grid-template-columns: 1fr; gap: 1.8rem; padding: 2rem 1.1rem 1.8rem; }
    .exl-footer-bottom-inner { flex-direction: column; align-items: flex-start; gap: 4px; }
    .exl-footer-bottom-links { display: none; }
  }

  /* ── SMALL MOBILE ── */
  @media (max-width: 400px) {
    .exl-nav-crumb { max-width: calc(100vw - 110px); }
    .exl-buy-sticky { padding: 1rem 0.85rem 1.2rem; }
    .exl-price { font-size: 22px; }
    .exl-gal-thumb { width: 46px; height: 46px; }
    .exl-tab-btn { padding: 0.75rem 0.65rem; font-size: 9.5px; }
    .exl-spec-row { grid-template-columns: 1fr 1fr; }
  }

  /* ── REDUCED MOTION ── */
  @media (prefers-reduced-motion: reduce) {
    .exl-gal-strip, .exl-gal-img, .exl-btn-mp, .exl-gal-arr { transition: none !important; }
  }
`
