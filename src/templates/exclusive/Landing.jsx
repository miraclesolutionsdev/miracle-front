import { useState, useEffect } from 'react'
import { ArrowLeft, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight, CreditCard, Package, ShoppingCart, Check } from 'lucide-react'
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
        <Package strokeWidth={1} style={{ width: 52, height: 52, color: '#c8d5c2' }} />
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
            <button key={i} type="button" onClick={() => setSel(i)} className="exl-gal-thumb"
              style={{ outline: i === sel ? '1.5px solid #3d4f3a' : '1.5px solid transparent', outlineOffset: 2, opacity: i === sel ? 1 : 0.45 }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
      <div className="exl-gal-main" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setLightbox(sel)}>
        <div className="exl-gal-strip" style={{ width: `${images.length * 100}%`, transform: `translateX(-${(100 / images.length) * sel}%)` }}>
          {images.map((src, i) => (
            <div key={i} style={{ width: `${100 / images.length}%`, flexShrink: 0 }}>
              <img src={src} alt={`${producto.nombre} ${i + 1}`} className="exl-gal-img" style={{ transform: hov ? 'scale(1.04)' : 'scale(1)' }} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="exl-gal-arr exl-gal-arr-l"><ChevronLeft size={17} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="exl-gal-arr exl-gal-arr-r"><ChevronRight size={17} /></button>
          </>
        )}
        {images.length > 1 && (
          <div className="exl-gal-dots">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setSel(i) }} className="exl-gal-dot"
                style={{ width: i === sel ? 20 : 5, background: i === sel ? '#3d4f3a' : '#c8d5c2' }} />
            ))}
          </div>
        )}
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

export default function ExclusiveLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onAddToCart, onComprar, isInCart, navigateBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="exl-root">

        <nav className="exl-nav">
          <div className="exl-nav-inner">
            <button type="button" onClick={navigateBack} className="exl-nav-back">
              <ArrowLeft size={12} /> Tienda
            </button>
            <span className="exl-nav-sep">/</span>
            <span className="exl-nav-crumb">{producto.nombre}</span>
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
                <div className="exl-tags">
                  <span className="exl-tag-cat">Producto</span>
                  {!sinStock && <span className="exl-tag-avail"><span className="exl-avail-dot" /> Disponible</span>}
                  {sinStock && <span className="exl-tag-out">Sin stock</span>}
                </div>

                <h1 className="exl-title">{producto.nombre}</h1>

                {producto.precio != null && (
                  <div className="exl-price-section">
                    <span className="exl-price">{fmt(producto.precio)}</span>
                    {stockBajo && !sinStock && <span className="exl-price-tag"><Zap size={10} /> Quedan {producto.stock}</span>}
                  </div>
                )}

                {!sinStock && (
                  <div className="exl-qty">
                    <span className="exl-qty-lbl">Cantidad</span>
                    <div className="exl-qty-ctrl">
                      <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="exl-qty-btn">−</button>
                      <span className="exl-qty-val">{cantidad}</span>
                      <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="exl-qty-btn exl-qty-add">+</button>
                    </div>
                    {cantidad > 1 && producto.precio != null && (
                      <div className="exl-qty-total">
                        <span>Total</span>
                        <span className="exl-qty-total-val">{fmt(producto.precio * cantidad)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="exl-ctas">
                  <button type="button" onClick={onAddToCart} disabled={sinStock} className="exl-btn-cart"
                    style={{ background: isInCart ? '#3d4f3a' : 'transparent', color: isInCart ? '#fff' : '#2c3028', borderColor: isInCart ? '#3d4f3a' : '#e0dbd0' }}>
                    <ShoppingCart size={14} /> {isInCart ? 'En el carrito' : 'Agregar al carrito'}
                  </button>
                  <button type="button" onClick={onComprar} disabled={sinStock} className="exl-btn-mp">
                    <CreditCard size={14} /> Comprar ahora
                  </button>
                  <button type="button" onClick={onWhatsApp} className="exl-btn-wa">
                    <WhatsAppIcon size={16} /> Pedir por WhatsApp
                  </button>
                </div>

                <div className="exl-rule" />

                <div className="exl-trust">
                  {[
                    { Icon: ShieldCheck, label: 'Pago seguro' },
                    { Icon: Zap, label: 'Respuesta rápida' },
                    { Icon: Star, label: 'Calidad garantizada' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="exl-trust-item">
                      <Icon strokeWidth={1.5} style={{ width: 13, height: 13, color: '#5a7055' }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="exl-pay-note">
                  <ShieldCheck strokeWidth={1.5} style={{ width: 12, height: 12, color: '#7a8275', flexShrink: 0 }} />
                  <p>Aceptamos <strong>transferencia, efectivo</strong> y otros medios.</p>
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
          <p>© {new Date().getFullYear()} · Todos los derechos reservados</p>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .exl-root { min-height: 100vh; background: #ffffff; color: #2c3028; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .exl-nav { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.98); backdrop-filter: blur(16px); border-bottom: 0.5px solid #e0dbd0; }
  .exl-nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem; height: 56px; display: flex; align-items: center; gap: 10px; }
  .exl-nav-back { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #2c3028; background: none; border: none; cursor: pointer; padding: 6px 0; letter-spacing: 0.04em; transition: opacity 0.15s; font-family: 'Inter', sans-serif; }
  .exl-nav-back:hover { opacity: 0.6; }
  .exl-nav-sep { color: #e0dbd0; font-size: 12px; }
  .exl-nav-crumb { font-size: 12px; color: #7a8275; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px; }

  /* TOP SECTION */
  .exl-content { max-width: 1280px; margin: 0 auto; padding: 2.5rem 2.5rem 2rem; }
  .exl-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 4rem; align-items: start; }

  /* GALLERY */
  .exl-col-gal {}
  .exl-gal { display: flex; flex-direction: row; gap: 10px; }
  .exl-gal-empty { aspect-ratio: 4/5; max-height: 440px; background: #ede9e1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; border-radius: 2px; }
  .exl-gal-empty span { font-size: 11px; color: #7a8275; letter-spacing: 0.08em; }
  .exl-gal-main { position: relative; overflow: hidden; cursor: zoom-in; background: #f7f5f0; aspect-ratio: 4/5; max-height: 440px; flex: 1; min-width: 0; border-radius: 2px; }
  .exl-gal-strip { display: flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); height: 100%; }
  .exl-gal-img { width: 100%; height: 100%; object-fit: contain; display: block; transition: transform 0.6s ease; }
  .exl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; background: rgba(255,255,255,0.92); border: 0.5px solid #e0dbd0; color: #2c3028; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.15s; border-radius: 2px; }
  .exl-gal-arr:hover { background: #fff; border-color: #3d4f3a; }
  .exl-gal-arr-l { left: 10px; }
  .exl-gal-arr-r { right: 10px; }
  .exl-gal-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 5; }
  .exl-gal-dot { height: 4px; border: none; padding: 0; cursor: pointer; transition: all 0.22s; border-radius: 2px; }
  .exl-gal-thumbs { display: flex; flex-direction: column; gap: 8px; max-width: 76px; max-height: 440px; overflow-y: auto; flex-shrink: 0; order: -1; scrollbar-width: none; }
  .exl-gal-thumbs::-webkit-scrollbar { display: none; }
  .exl-gal-thumb { width: 76px; height: 76px; cursor: pointer; border: none; padding: 0; background: #ede9e1; transition: opacity 0.18s; overflow: hidden; flex-shrink: 0; border-radius: 2px; }

  /* BUY PANEL — sticky */
  .exl-col-buy {}
  .exl-buy-sticky { position: sticky; top: 72px; display: flex; flex-direction: column; gap: 0; }
  .exl-tags { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
  .exl-tag-cat { font-size: 9px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #4a5246; background: #f7f5f0; padding: 4px 10px; border-radius: 2px; border: 0.5px solid #e0dbd0; }
  .exl-tag-avail { font-size: 11px; color: #5a7055; display: flex; align-items: center; gap: 5px; }
  .exl-avail-dot { width: 6px; height: 6px; border-radius: 50%; background: #5a7055; flex-shrink: 0; }
  .exl-tag-out { font-size: 11px; color: #7a8275; }
  .exl-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.8vw, 32px); font-weight: 400; line-height: 1.22; margin-bottom: 1.2rem; }
  .exl-price-section { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; background: #f7f5f0; padding: 1rem 1.2rem; border: 0.5px solid #e0dbd0; border-radius: 2px; }
  .exl-price { font-family: 'Playfair Display', serif; font-size: 28px; color: #2c3028; line-height: 1; }
  .exl-price-tag { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: #b89a5a; letter-spacing: 0.04em; }

  /* QTY */
  .exl-qty { margin-bottom: 1.2rem; background: #f7f5f0; padding: 1rem 1.2rem; border: 0.5px solid #e0dbd0; border-radius: 2px; }
  .exl-qty-lbl { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #7a8275; display: block; margin-bottom: 10px; }
  .exl-qty-ctrl { display: inline-flex; align-items: center; border: 0.5px solid #e0dbd0; background: #fff; border-radius: 2px; overflow: hidden; }
  .exl-qty-btn { width: 38px; height: 38px; background: transparent; border: none; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #2c3028; transition: background 0.15s; font-family: 'Inter', sans-serif; }
  .exl-qty-btn:hover:not(:disabled) { background: #f7f5f0; }
  .exl-qty-btn:disabled { color: #c8d5c2; cursor: default; }
  .exl-qty-add { border-left: 0.5px solid #e0dbd0; }
  .exl-qty-val { width: 44px; text-align: center; font-size: 15px; font-weight: 500; border-left: 0.5px solid #e0dbd0; border-right: 0.5px solid #e0dbd0; height: 38px; display: flex; align-items: center; justify-content: center; }
  .exl-qty-total { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 0.5px solid #e0dbd0; font-size: 12px; color: #7a8275; }
  .exl-qty-total-val { font-family: 'Playfair Display', serif; font-size: 20px; color: #2c3028; }

  /* CTAs */
  .exl-ctas { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.2rem; }
  .exl-btn-cart { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 13px 24px; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.1em; text-transform: uppercase; border: 0.5px solid; border-radius: 2px; }
  .exl-btn-cart:hover { opacity: 0.85; }
  .exl-btn-cart:disabled { opacity: 0.4; cursor: not-allowed; }
  .exl-btn-mp { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 13px 24px; background: #2c3028; color: #fff; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: background 0.2s; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; }
  .exl-btn-mp:hover { background: #3d4f3a; }
  .exl-btn-mp:disabled { background: #e0dbd0; color: #7a8275; cursor: default; }
  .exl-btn-wa { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 13px 24px; background: #25D366; color: #fff; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: background 0.2s; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; }
  .exl-btn-wa:hover { background: #1EBE57; }

  /* TRUST + PAY NOTE */
  .exl-rule { height: 0.5px; background: #e0dbd0; margin: 1rem 0; }
  .exl-trust { display: flex; gap: 12px; margin-bottom: 1rem; flex-wrap: wrap; }
  .exl-trust-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #7a8275; }
  .exl-pay-note { display: flex; align-items: flex-start; gap: 8px; background: #f7f5f0; padding: 10px 14px; border-radius: 2px; border: 0.5px solid #e0dbd0; }
  .exl-pay-note p { font-size: 11px; color: #7a8275; line-height: 1.55; }
  .exl-pay-note strong { color: #4a5246; }

  /* DETAIL SECTION — tabs full width */
  .exl-detail { border-top: 0.5px solid #e0dbd0; background: #f7f5f0; }
  .exl-detail-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem 3rem; }

  /* TABS BAR */
  .exl-tabs-wrap {}
  .exl-tabs-bar { display: flex; gap: 0; border-bottom: 0.5px solid #e0dbd0; overflow-x: auto; scrollbar-width: none; }
  .exl-tabs-bar::-webkit-scrollbar { display: none; }
  .exl-tab-btn { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #7a8275; background: none; border: none; border-bottom: 2px solid transparent; padding: 1.2rem 1.6rem; cursor: pointer; white-space: nowrap; transition: color 0.15s, border-color 0.15s; margin-bottom: -0.5px; }
  .exl-tab-btn:hover { color: #4a5246; }
  .exl-tab-btn-active { color: #2c3028; border-bottom-color: #3d4f3a; }

  /* TAB CONTENT */
  .exl-tab-content { padding: 2rem 0; }
  .exl-tab-p { font-size: 14px; line-height: 1.85; color: #4a5246; max-width: 780px; white-space: pre-wrap; }

  .exl-tab-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 2rem; max-width: 900px; }
  .exl-tab-feat { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #4a5246; line-height: 1.55; }

  .exl-tab-list { list-style: none; display: flex; flex-direction: column; gap: 8px; max-width: 600px; }
  .exl-tab-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #4a5246; line-height: 1.55; }

  .exl-tab-kit { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; max-width: 900px; }
  .exl-tab-kit-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #4a5246; background: #ffffff; border: 0.5px solid #e0dbd0; padding: 12px 16px; border-radius: 2px; }

  /* SPECS TABLE */
  .exl-specs { display: flex; flex-direction: column; border: 0.5px solid #e0dbd0; border-radius: 2px; overflow: hidden; max-width: 700px; }
  .exl-spec-row { display: grid; grid-template-columns: 1fr 1.6fr; padding: 10px 16px; background: #ffffff; }
  .exl-spec-row-alt { background: #f7f5f0; }
  .exl-spec-key { font-size: 12px; font-weight: 500; color: #4a5246; }
  .exl-spec-val { font-size: 12px; color: #7a8275; }

  /* SHARED */
  .exl-check { width: 17px; height: 17px; display: flex; align-items: center; justify-content: center; background: rgba(61,79,58,0.08); flex-shrink: 0; margin-top: 2px; border-radius: 2px; }
  .exl-check-muted { background: rgba(122,130,117,0.1); }
  .exl-check-box { width: 17px; height: 17px; display: flex; align-items: center; justify-content: center; background: rgba(184,154,90,0.1); border: 0.5px solid rgba(184,154,90,0.3); flex-shrink: 0; border-radius: 2px; }

  /* FOOTER */
  .exl-footer { text-align: center; padding: 1.4rem 24px; border-top: 0.5px solid #e0dbd0; background: #ffffff; }
  .exl-footer p { font-size: 11px; color: #7a8275; letter-spacing: 0.06em; }

  /* RESPONSIVE */
  @media (max-width: 1023px) {
    .exl-grid { grid-template-columns: 1fr; gap: 2rem; }
    .exl-buy-sticky { position: static; }
    .exl-gal { flex-direction: column-reverse; }
    .exl-gal-thumbs { flex-direction: row; max-width: 100%; overflow-x: auto; padding-bottom: 4px; }
    .exl-gal-thumbs::-webkit-scrollbar { height: 4px; }
    .exl-gal-thumbs::-webkit-scrollbar-thumb { background: #e0dbd0; border-radius: 2px; }
    .exl-gal-thumb { width: 62px; height: 62px; }
    .exl-content { padding: 1.5rem 1.5rem 1.5rem; }
    .exl-nav-inner { padding: 0 1.5rem; }
    .exl-detail-inner { padding: 0 1.5rem 2.5rem; }
    .exl-tab-grid-2 { grid-template-columns: 1fr; }
    .exl-tab-kit { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .exl-tab-kit { grid-template-columns: 1fr; }
    .exl-tab-btn { padding: 1rem 1rem; font-size: 10px; }
  }
`
