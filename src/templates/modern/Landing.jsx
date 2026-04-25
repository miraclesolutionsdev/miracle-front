import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight, CreditCard, Package, ShoppingCart } from 'lucide-react'
import ImageLightbox from '../../components/ImageLightbox.jsx'
import { getProductoImagenSrc } from '../../utils/api'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const GALLERY_MS = 4500

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
    return <div className="mdl-gal-empty"><Package strokeWidth={1} size={44} color="#D4D4D8" /></div>
  }

  return (
    <div className="mdl-gal" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {lightbox !== null && <ImageLightbox imagenes={images} indiceActual={lightbox} onClose={() => setLightbox(null)} onIndexChange={(i) => { setLightbox(i); setSel(i) }} getNombreProducto={() => producto.nombre} />}
      {images.length > 1 && (
        <div className="mdl-gal-thumbs">{images.map((src, i) => (
          <button key={i} type="button" onClick={() => setSel(i)} className="mdl-gal-thumb" style={{ borderColor: i === sel ? '#4F46E5' : '#E4E4E7', opacity: i === sel ? 1 : 0.5 }}>
            <img src={src} alt="" />
          </button>
        ))}</div>
      )}
      <div className="mdl-gal-main" onClick={() => setLightbox(sel)}>
        <img src={images[sel]} alt={producto.nombre} className="mdl-gal-img" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="mdl-gal-arr mdl-gal-arr-l"><ChevronLeft size={18} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="mdl-gal-arr mdl-gal-arr-r"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ModernLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onAddToCart, isInCart, onComprar, navigateBack }) {
  const [tab, setTab] = useState('desc')

  return (
    <>
      <style>{CSS}</style>
      <div className="mdl-root">
        {/* Breadcrumb nav */}
        <nav className="mdl-nav">
          <div className="mdl-nav-inner">
            <button type="button" onClick={navigateBack} className="mdl-bc-back"><ArrowLeft size={14} /></button>
            <div className="mdl-bc">
              <span className="mdl-bc-item" onClick={navigateBack} style={{ cursor: 'pointer' }}>Tienda</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <span className="mdl-bc-item mdl-bc-active">{producto.nombre}</span>
            </div>
          </div>
        </nav>

        <div className="mdl-content">
          <div className="mdl-grid">
            {/* Left - Gallery */}
            <div className="mdl-col-gal">
              <Gallery producto={producto} />
            </div>

            {/* Right - Info */}
            <div className="mdl-col-info">
              <div className="mdl-badges-row">
                <span className="mdl-badge-type">{producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
                {!sinStock && producto.tipo === 'producto' && <span className="mdl-badge-stock"><span className="mdl-stock-dot" style={{ background: stockBajo ? '#F59E0B' : '#10B981' }} />{stockBajo ? `Quedan ${producto.stock}` : 'En stock'}</span>}
                {sinStock && <span className="mdl-badge-out">Agotado</span>}
              </div>

              <h1 className="mdl-title">{producto.nombre}</h1>

              {producto.precio != null && (
                <div className="mdl-price-box">
                  <span className="mdl-price">{fmt(producto.precio)}</span>
                  {stockBajo && !sinStock && <span className="mdl-price-warn"><Zap size={12} /> Pocas unidades</span>}
                </div>
              )}

              {/* Qty */}
              {!sinStock && (
                <div className="mdl-qty-section">
                  <label className="mdl-qty-lbl">Cantidad</label>
                  <div className="mdl-qty-ctrl">
                    <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="mdl-qty-btn">−</button>
                    <span className="mdl-qty-val">{cantidad}</span>
                    <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="mdl-qty-btn">+</button>
                  </div>
                  {cantidad > 1 && producto.precio != null && <span className="mdl-qty-total">Total: {fmt(producto.precio * cantidad)}</span>}
                </div>
              )}

              {/* CTAs side by side */}
              <div className="mdl-ctas">
                <button type="button" onClick={onAddToCart} disabled={sinStock} className="mdn-btn-cart" style={{ background: isInCart ? '#22c55e' : '#666', color: '#fff' }}>
                  <ShoppingCart size={16} /> {isInCart ? 'En el carrito' : 'Agregar al carrito'}
                </button>
                <button type="button" onClick={onComprar} disabled={sinStock} className="mdl-btn-buy">
                  <CreditCard size={16} /> Comprar ahora
                </button>
                <button type="button" onClick={onWhatsApp} className="mdl-btn-wa">
                  <WhatsAppIcon size={16} /> WhatsApp
                </button>
              </div>

              {/* Trust row */}
              <div className="mdl-trust">
                {[{ Icon: ShieldCheck, t: 'Pago seguro' }, { Icon: Zap, t: 'Envío disponible' }, { Icon: Star, t: 'Calidad garantizada' }].map(({ Icon, t }) => (
                  <div key={t} className="mdl-trust-item"><Icon size={14} strokeWidth={1.5} /><span>{t}</span></div>
                ))}
              </div>

              {/* Tabbed content */}
              <div className="mdl-tabs">
                <div className="mdl-tab-bar">
                  <button type="button" onClick={() => setTab('desc')} className={`mdl-tab ${tab === 'desc' ? 'active' : ''}`}>Descripción</button>
                  {producto.caracteristicas?.length > 0 && <button type="button" onClick={() => setTab('specs')} className={`mdl-tab ${tab === 'specs' ? 'active' : ''}`}>Características</button>}
                  {producto.usos?.length > 0 && <button type="button" onClick={() => setTab('uses')} className={`mdl-tab ${tab === 'uses' ? 'active' : ''}`}>Usos</button>}
                </div>
                <div className="mdl-tab-content">
                  {tab === 'desc' && (
                    <p className="mdl-tab-text">{producto.descripcion || 'Sin descripción disponible.'}</p>
                  )}
                  {tab === 'specs' && producto.caracteristicas && (
                    <ul className="mdl-tab-list">{producto.caracteristicas.map((c, i) => <li key={i}><Check size={14} strokeWidth={2} /> {c}</li>)}</ul>
                  )}
                  {tab === 'uses' && producto.usos && (
                    <ul className="mdl-tab-list">{producto.usos.map((u, i) => <li key={i}><Check size={14} strokeWidth={2} /> {u}</li>)}</ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mdl-footer"><p>© {new Date().getFullYear()} · Todos los derechos reservados</p></footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Archivo:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mdl-root { min-height: 100vh; background: #F7F7F8; color: #18181B; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .mdl-nav { background: #fff; border-bottom: 1px solid #E4E4E7; }
  .mdl-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 52px; display: flex; align-items: center; gap: 10px; }
  .mdl-bc-back { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E4E4E7; background: #fff; color: #71717A; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
  .mdl-bc-back:hover { border-color: #4F46E5; color: #4F46E5; }
  .mdl-bc { display: flex; align-items: center; gap: 6px; }
  .mdl-bc-item { font-size: 13px; color: #A1A1AA; }
  .mdl-bc-item:hover { color: #4F46E5; }
  .mdl-bc-active { color: #18181B; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
  .mdl-bc svg { color: #D4D4D8; flex-shrink: 0; }

  .mdl-content { max-width: 1100px; margin: 0 auto; padding: 32px 24px 60px; }
  .mdl-grid { display: grid; grid-template-columns: 1.3fr 0.95fr; gap: 56px; align-items: start; }

  /* GALLERY - Desktop horizontal layout with left thumbnails */
  .mdl-gal { display: flex; gap: 10px; position: sticky; top: 72px; }
  .mdl-gal-empty { aspect-ratio: 1; background: #fff; border-radius: 16px; border: 1px solid #E4E4E7; display: flex; align-items: center; justify-content: center; width: 100%; }
  .mdl-gal-main { position: relative; overflow: hidden; cursor: pointer; border-radius: 16px; background: #fff; border: 1px solid #E4E4E7; flex: 1; }
  .mdl-gal-img { width: 100%; aspect-ratio: 1; object-fit: contain; display: block; }
  .mdl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; background: #fff; border: 1px solid #E4E4E7; border-radius: 8px; color: #18181B; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.15s; }
  .mdl-gal-arr:hover { border-color: #4F46E5; color: #4F46E5; }
  .mdl-gal-arr-l { left: 12px; }
  .mdl-gal-arr-r { right: 12px; }
  .mdl-gal-thumbs { display: flex; flex-direction: column; gap: 8px; max-width: 72px; }
  .mdl-gal-thumb { width: 72px; height: 72px; cursor: pointer; border: 2px solid #E4E4E7; border-radius: 10px; padding: 0; background: #fff; transition: all 0.2s; overflow: hidden; flex-shrink: 0; }
  .mdl-gal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* INFO */
  .mdl-badges-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
  .mdl-badge-type { font-size: 11px; font-weight: 600; color: #4F46E5; background: #EEF2FF; padding: 4px 10px; border-radius: 6px; }
  .mdl-badge-stock { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; color: #71717A; }
  .mdl-stock-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .mdl-badge-out { font-size: 11px; font-weight: 600; color: #71717A; background: #F4F4F5; padding: 4px 10px; border-radius: 6px; }
  .mdl-title { font-family: 'Archivo', sans-serif; font-size: clamp(22px, 3vw, 32px); font-weight: 700; line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.01em; }
  .mdl-price-box { display: flex; align-items: center; gap: 12px; background: #fff; padding: 16px 20px; border-radius: 12px; border: 1px solid #E4E4E7; margin-bottom: 20px; }
  .mdl-price { font-family: 'Archivo', sans-serif; font-size: 32px; font-weight: 800; color: #18181B; line-height: 1; }
  .mdl-price-warn { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #F59E0B; }

  /* QTY */
  .mdl-qty-section { margin-bottom: 20px; }
  .mdl-qty-lbl { font-size: 12px; font-weight: 600; color: #71717A; display: block; margin-bottom: 8px; }
  .mdl-qty-ctrl { display: inline-flex; border: 1px solid #E4E4E7; border-radius: 10px; overflow: hidden; }
  .mdl-qty-btn { width: 40px; height: 40px; background: #fff; border: none; font-size: 18px; cursor: pointer; color: #18181B; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .mdl-qty-btn:hover:not(:disabled) { background: #F4F4F5; }
  .mdl-qty-btn:disabled { color: #D4D4D8; cursor: default; }
  .mdl-qty-val { width: 48px; text-align: center; font-size: 15px; font-weight: 600; border-left: 1px solid #E4E4E7; border-right: 1px solid #E4E4E7; display: flex; align-items: center; justify-content: center; }
  .mdl-qty-total { display: block; margin-top: 8px; font-size: 13px; color: #71717A; }

  /* CTAs */
  .mdl-ctas { display: flex; gap: 10px; margin-bottom: 20px; }
  .mdn-btn-cart { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; flex: 1; }
  .mdn-btn-cart:hover { opacity: 0.9; }
  .mdn-btn-cart:disabled { opacity: 0.5; cursor: not-allowed; }
  .mdl-btn-buy { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; background: #4F46E5; color: #fff; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .mdl-btn-buy:hover { background: #4338CA; box-shadow: 0 4px 16px rgba(79,70,229,0.25); }
  .mdl-btn-buy:disabled { background: #E4E4E7; color: #A1A1AA; cursor: default; box-shadow: none; }
  .mdl-btn-wa { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; background: #fff; color: #25D366; border: 1.5px solid #25D366; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .mdl-btn-wa:hover { background: rgba(37,211,102,0.04); }

  /* TRUST */
  .mdl-trust { display: flex; gap: 16px; margin-bottom: 24px; padding: 14px 0; border-top: 1px solid #E4E4E7; border-bottom: 1px solid #E4E4E7; flex-wrap: wrap; }
  .mdl-trust-item { display: flex; align-items: center; gap: 5px; }
  .mdl-trust-item svg { color: #4F46E5; }
  .mdl-trust-item span { font-size: 12px; color: #71717A; }

  /* TABS */
  .mdl-tabs { }
  .mdl-tab-bar { display: flex; gap: 0; border-bottom: 1px solid #E4E4E7; margin-bottom: 16px; }
  .mdl-tab { padding: 10px 16px; background: none; border: none; border-bottom: 2px solid transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #A1A1AA; cursor: pointer; transition: all 0.2s; }
  .mdl-tab.active { color: #4F46E5; border-bottom-color: #4F46E5; }
  .mdl-tab:hover:not(.active) { color: #18181B; }
  .mdl-tab-content { min-height: 80px; }
  .mdl-tab-text { font-size: 14px; line-height: 1.7; color: #71717A; }
  .mdl-tab-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .mdl-tab-list li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #52525B; }
  .mdl-tab-list li svg { color: #4F46E5; flex-shrink: 0; }

  .mdl-footer { text-align: center; padding: 28px 24px; border-top: 1px solid #E4E4E7; }
  .mdl-footer p { font-size: 11px; color: #A1A1AA; }

  @media (max-width: 1023px) {
    .mdl-grid { grid-template-columns: 1fr; gap: 24px; }
    .mdl-gal { position: static; flex-direction: column-reverse; }
    .mdl-gal-thumbs { flex-direction: row; max-width: 100%; overflow-x: auto; padding-bottom: 4px; }
    .mdl-gal-thumbs::-webkit-scrollbar { height: 4px; }
    .mdl-gal-thumbs::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 2px; }
    .mdl-gal-thumb { width: 60px; height: 60px; }
    .mdl-content { padding: 20px 16px 48px; }
    .mdl-ctas { flex-direction: column; }
  }
`
