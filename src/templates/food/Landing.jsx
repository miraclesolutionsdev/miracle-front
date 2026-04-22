import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, ChevronLeft, ChevronRight, CreditCard, Package } from 'lucide-react'
import ImageLightbox from '../../components/ImageLightbox.jsx'
import { getProductoImagenSrc } from '../../utils/api'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function Gallery({ producto }) {
  const [sel, setSel] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const images = (producto.imagenes || []).map((_, i) => getProductoImagenSrc(producto, i)).filter(Boolean)

  if (images.length === 0) {
    return <div className="fdl-gal-empty"><Package strokeWidth={1} size={44} color="#E0D0C0" /></div>
  }

  return (
    <div className="fdl-gal">
      {lightbox !== null && <ImageLightbox imagenes={images} indiceActual={lightbox} onClose={() => setLightbox(null)} onIndexChange={(i) => { setLightbox(i); setSel(i) }} getNombreProducto={() => producto.nombre} />}
      <div className="fdl-gal-main" onClick={() => setLightbox(sel)}>
        <img src={images[sel]} alt={producto.nombre} className="fdl-gal-img" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="fdl-gal-arr fdl-gal-arr-l"><ChevronLeft size={16} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="fdl-gal-arr fdl-gal-arr-r"><ChevronRight size={16} /></button>
          </>
        )}
        <span className="fdl-gal-count">{sel + 1}/{images.length}</span>
      </div>
    </div>
  )
}

export default function FoodLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onComprar, navigateBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="fdl-root">
        {/* Header */}
        <nav className="fdl-nav">
          <button type="button" onClick={navigateBack} className="fdl-back"><ArrowLeft size={16} /></button>
          <span className="fdl-nav-title">{producto.nombre}</span>
          <div style={{ width: 36 }} />
        </nav>

        <div className="fdl-content">
          <div className="fdl-grid">
            {/* Left - Image */}
            <div className="fdl-col-img">
              <Gallery producto={producto} />
            </div>

            {/* Right - Quick order */}
            <div className="fdl-col-info">
              <div className="fdl-info-card">
                {sinStock && <div className="fdl-out-banner">Producto agotado</div>}

                <h1 className="fdl-title">{producto.nombre}</h1>

                {producto.precio != null && (
                  <div className="fdl-price-row">
                    <span className="fdl-price">{fmt(producto.precio)}</span>
                    {stockBajo && !sinStock && <span className="fdl-stock-warn">🔥 ¡Últimas {producto.stock}!</span>}
                  </div>
                )}

                {producto.descripcion && <p className="fdl-desc">{producto.descripcion}</p>}

                {/* Qty */}
                {!sinStock && (
                  <div className="fdl-qty-row">
                    <span className="fdl-qty-lbl">Cantidad:</span>
                    <div className="fdl-qty-ctrl">
                      <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="fdl-qty-btn">−</button>
                      <span className="fdl-qty-val">{cantidad}</span>
                      <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="fdl-qty-btn">+</button>
                    </div>
                    {cantidad > 1 && producto.precio != null && <span className="fdl-total">{fmt(producto.precio * cantidad)}</span>}
                  </div>
                )}

                {/* Big CTA */}
                <button type="button" onClick={onComprar} disabled={sinStock} className="fdl-btn-order">
                  <CreditCard size={16} />
                  {sinStock ? 'No disponible' : 'Ordenar ahora'}
                </button>
                <button type="button" onClick={onWhatsApp} className="fdl-btn-wa">
                  <WhatsAppIcon size={16} /> Pedir por WhatsApp
                </button>

                <div className="fdl-trust-row">
                  <span><ShieldCheck size={14} strokeWidth={1.5} /> Pago seguro</span>
                  <span><Zap size={14} strokeWidth={1.5} /> Envío rápido</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details below */}
          <div className="fdl-details">
            {producto.caracteristicas?.length > 0 && (
              <div className="fdl-detail-section">
                <h2>Características</h2>
                <ul>{producto.caracteristicas.map((c, i) => <li key={i}><Check size={14} strokeWidth={2} /> {c}</li>)}</ul>
              </div>
            )}
            {producto.usos?.length > 0 && (
              <div className="fdl-detail-section">
                <h2>Usos recomendados</h2>
                <ul>{producto.usos.map((u, i) => <li key={i}><Check size={14} strokeWidth={2} /> {u}</li>)}</ul>
              </div>
            )}
          </div>
        </div>

        <footer className="fdl-footer"><p>© {new Date().getFullYear()} · Todos los derechos reservados</p></footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fdl-root { min-height: 100vh; background: #FFF9F4; color: #2D2218; font-family: 'Nunito', sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .fdl-nav { position: sticky; top: 0; z-index: 40; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 56px; }
  .fdl-back { width: 36px; height: 36px; border-radius: 50%; border: none; background: #FFF5ED; color: #FF6B00; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .fdl-nav-title { font-family: 'Quicksand', sans-serif; font-size: 14px; font-weight: 700; color: #2D2218; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }

  .fdl-content { max-width: 1200px; margin: 0 auto; padding: 24px 24px 60px; }
  .fdl-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: start; }

  /* GALLERY */
  .fdl-gal { position: sticky; top: 72px; }
  .fdl-gal-empty { aspect-ratio: 1; background: #FFF5ED; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
  .fdl-gal-main { position: relative; overflow: hidden; cursor: pointer; border-radius: 20px; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .fdl-gal-img { width: 100%; aspect-ratio: 1; object-fit: contain; display: block; }
  .fdl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; color: #2D2218; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .fdl-gal-arr-l { left: 10px; }
  .fdl-gal-arr-r { right: 10px; }
  .fdl-gal-count { position: absolute; bottom: 10px; right: 10px; font-size: 11px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.4); padding: 3px 10px; border-radius: 20px; }

  /* INFO CARD */
  .fdl-info-card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
  .fdl-out-banner { background: #FFE8E8; color: #D32F2F; font-size: 12px; font-weight: 700; text-align: center; padding: 8px; border-radius: 10px; margin-bottom: 16px; }
  .fdl-title { font-family: 'Quicksand', sans-serif; font-size: clamp(22px, 3vw, 28px); font-weight: 700; line-height: 1.3; margin-bottom: 12px; }
  .fdl-price-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .fdl-price { font-family: 'Quicksand', sans-serif; font-size: 32px; font-weight: 700; color: #FF6B00; line-height: 1; }
  .fdl-stock-warn { font-size: 12px; font-weight: 800; color: #FF3D00; }
  .fdl-desc { font-size: 14px; line-height: 1.6; color: #8A7A6A; margin-bottom: 20px; }

  /* QTY */
  .fdl-qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .fdl-qty-lbl { font-size: 13px; font-weight: 600; color: #8A7A6A; }
  .fdl-qty-ctrl { display: flex; align-items: center; border: 2px solid #F0E0D0; border-radius: 12px; overflow: hidden; }
  .fdl-qty-btn { width: 38px; height: 38px; background: none; border: none; font-size: 18px; cursor: pointer; color: #2D2218; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .fdl-qty-btn:hover:not(:disabled) { background: #FFF5ED; }
  .fdl-qty-btn:disabled { color: #D0C0B0; cursor: default; }
  .fdl-qty-val { width: 36px; text-align: center; font-size: 15px; font-weight: 700; border-left: 2px solid #F0E0D0; border-right: 2px solid #F0E0D0; }
  .fdl-total { font-family: 'Quicksand', sans-serif; font-size: 18px; font-weight: 700; color: #FF6B00; }

  /* CTAs */
  .fdl-btn-order { width: 100%; padding: 14px; background: #FF6B00; color: #fff; border: none; border-radius: 14px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; margin-bottom: 10px; }
  .fdl-btn-order:hover { background: #E85E00; }
  .fdl-btn-order:disabled { background: #E0D0C0; color: #A09080; cursor: default; }
  .fdl-btn-wa { width: 100%; padding: 12px; background: none; color: #25D366; border: 2px solid #25D366; border-radius: 14px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; margin-bottom: 16px; }
  .fdl-btn-wa:hover { background: rgba(37,211,102,0.05); }

  .fdl-trust-row { display: flex; gap: 16px; flex-wrap: wrap; }
  .fdl-trust-row span { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: #CCBFB3; }
  .fdl-trust-row svg { color: #FF6B00; }

  /* DETAILS */
  .fdl-details { margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .fdl-detail-section { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
  .fdl-detail-section h2 { font-family: 'Quicksand', sans-serif; font-size: 14px; font-weight: 700; color: #FF6B00; margin-bottom: 12px; }
  .fdl-detail-section ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .fdl-detail-section li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6A5A4A; }
  .fdl-detail-section li svg { color: #FF6B00; flex-shrink: 0; }

  .fdl-footer { text-align: center; padding: 24px; }
  .fdl-footer p { font-size: 11px; color: #D0C0B0; }

  @media (max-width: 1023px) {
    .fdl-grid { grid-template-columns: 1fr; gap: 24px; }
    .fdl-gal { position: static; }
    .fdl-details { grid-template-columns: 1fr; }
    .fdl-content { padding: 16px 16px 48px; }
  }
`
