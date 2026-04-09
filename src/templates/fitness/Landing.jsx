import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight, CreditCard, Package } from 'lucide-react'
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
    return <div className="ftl-gal-empty"><Package strokeWidth={1} style={{ width: 48, height: 48, color: '#333' }} /></div>
  }

  return (
    <div className="ftl-gal">
      {lightbox !== null && <ImageLightbox imagenes={images} indiceActual={lightbox} onClose={() => setLightbox(null)} onIndexChange={(i) => { setLightbox(i); setSel(i) }} getNombreProducto={() => producto.nombre} />}
      <div className="ftl-gal-main" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setLightbox(sel)}>
        <div className="ftl-gal-strip" style={{ width: `${images.length * 100}%`, transform: `translateX(-${(100 / images.length) * sel}%)` }}>
          {images.map((src, i) => (
            <div key={i} style={{ width: `${100 / images.length}%`, flexShrink: 0 }}>
              <img src={src} alt={`${producto.nombre} ${i + 1}`} className="ftl-gal-img" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="ftl-gal-arr ftl-gal-arr-l"><ChevronLeft size={18} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="ftl-gal-arr ftl-gal-arr-r"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="ftl-gal-thumbs">{images.map((src, i) => (
          <button key={i} type="button" onClick={() => setSel(i)} className="ftl-gal-thumb" style={{ borderColor: i === sel ? '#39FF14' : 'transparent', opacity: i === sel ? 1 : 0.5 }}>
            <img src={src} alt="" />
          </button>
        ))}</div>
      )}
    </div>
  )
}

export default function FitnessLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onComprar, navigateBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="ftl-root">
        {/* NAV */}
        <nav className="ftl-nav">
          <button type="button" onClick={navigateBack} className="ftl-nav-back"><ArrowLeft size={14} /> VOLVER</button>
          <span className="ftl-nav-name">{producto.nombre}</span>
        </nav>

        {/* HERO IMAGE - Full width */}
        <div className="ftl-hero-img">
          <Gallery producto={producto} />
        </div>

        {/* DARK INFO PANEL */}
        <div className="ftl-panel">
          <div className="ftl-panel-inner">
            {/* Badge + status */}
            <div className="ftl-top-row">
              <span className="ftl-badge">{producto.tipo === 'servicio' ? 'SERVICIO' : 'PRODUCTO'}</span>
              {!sinStock && producto.tipo === 'producto' && <span className="ftl-status ftl-status-ok">DISPONIBLE</span>}
              {sinStock && <span className="ftl-status ftl-status-out">AGOTADO</span>}
            </div>

            <h1 className="ftl-title">{producto.nombre}</h1>

            {producto.precio != null && (
              <div className="ftl-price-row">
                <span className="ftl-price">{fmt(producto.precio)}</span>
                {stockBajo && !sinStock && <span className="ftl-urgency"><Zap size={12} /> ¡SOLO QUEDAN {producto.stock}!</span>}
              </div>
            )}

            {/* Qty */}
            {!sinStock && (
              <div className="ftl-qty-section">
                <span className="ftl-qty-lbl">CANTIDAD</span>
                <div className="ftl-qty-ctrl">
                  <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="ftl-qty-btn">−</button>
                  <span className="ftl-qty-val">{cantidad}</span>
                  <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="ftl-qty-btn">+</button>
                </div>
                {cantidad > 1 && producto.precio != null && <span className="ftl-qty-total">Total: <strong>{fmt(producto.precio * cantidad)}</strong></span>}
              </div>
            )}

            {/* CTAs */}
            <div className="ftl-ctas">
              <button type="button" onClick={onComprar} disabled={sinStock} className="ftl-btn-buy">
                <CreditCard size={16} /> COMPRAR AHORA
              </button>
              <button type="button" onClick={onWhatsApp} className="ftl-btn-wa">
                <WhatsAppIcon size={16} /> WHATSAPP
              </button>
            </div>

            {/* Trust */}
            <div className="ftl-trust">
              {[{ Icon: ShieldCheck, t: 'PAGO SEGURO' }, { Icon: Zap, t: 'ENVÍO RÁPIDO' }, { Icon: Star, t: 'GARANTÍA' }].map(({ Icon, t }) => (
                <div key={t} className="ftl-trust-item"><Icon strokeWidth={1.5} size={14} /><span>{t}</span></div>
              ))}
            </div>

            {/* Description */}
            {producto.descripcion && (
              <div className="ftl-section">
                <h2 className="ftl-section-h">DESCRIPCIÓN</h2>
                <p className="ftl-section-p">{producto.descripcion}</p>
              </div>
            )}

            {producto.caracteristicas?.length > 0 && (
              <div className="ftl-section">
                <h2 className="ftl-section-h">CARACTERÍSTICAS</h2>
                <ul className="ftl-list">{producto.caracteristicas.map((c, i) => (
                  <li key={i}><Check size={10} strokeWidth={3} /> {c}</li>
                ))}</ul>
              </div>
            )}

            {producto.usos?.length > 0 && (
              <div className="ftl-section">
                <h2 className="ftl-section-h">USOS</h2>
                <ul className="ftl-list ftl-list-muted">{producto.usos.map((u, i) => (
                  <li key={i}><Check size={10} strokeWidth={3} /> {u}</li>
                ))}</ul>
              </div>
            )}
          </div>
        </div>

        <footer className="ftl-footer"><p>© {new Date().getFullYear()} · Todos los derechos reservados</p></footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ftl-root { min-height: 100vh; background: #0A0A0A; color: #E0E0E0; font-family: 'Barlow', sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .ftl-nav { position: sticky; top: 0; z-index: 40; background: rgba(10,10,10,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(57,255,20,0.1); display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 52px; }
  .ftl-nav-back { display: flex; align-items: center; gap: 6px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; color: #39FF14; background: none; border: none; cursor: pointer; }
  .ftl-nav-name { font-size: 12px; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* GALLERY */
  .ftl-hero-img { max-width: 1200px; margin: 0 auto; }
  .ftl-gal { }
  .ftl-gal-empty { aspect-ratio: 16/9; background: #111; display: flex; align-items: center; justify-content: center; }
  .ftl-gal-main { position: relative; overflow: hidden; cursor: pointer; background: #0D0D0D; aspect-ratio: 16/9; }
  .ftl-gal-strip { display: flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); height: 100%; }
  .ftl-gal-img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ftl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: rgba(0,0,0,0.7); border: 1px solid rgba(57,255,20,0.3); color: #39FF14; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; }
  .ftl-gal-arr-l { left: 12px; }
  .ftl-gal-arr-r { right: 12px; }
  .ftl-gal-thumbs { display: flex; gap: 8px; padding: 12px 16px; overflow-x: auto; }
  .ftl-gal-thumb { width: 56px; height: 56px; cursor: pointer; border: 2px solid transparent; padding: 0; background: #111; transition: all 0.2s; flex-shrink: 0; }
  .ftl-gal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* PANEL */
  .ftl-panel { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .ftl-panel-inner { max-width: 720px; padding: 32px 0 60px; }
  .ftl-top-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .ftl-badge { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; padding: 4px 10px; border: 1px solid rgba(57,255,20,0.3); color: #39FF14; }
  .ftl-status { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; }
  .ftl-status-ok { color: #39FF14; }
  .ftl-status-out { color: #666; }
  .ftl-title { font-family: 'Oswald', sans-serif; font-size: clamp(28px, 4vw, 48px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1; color: #fff; margin-bottom: 16px; }
  .ftl-price-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px 20px; background: rgba(57,255,20,0.04); border-left: 3px solid #39FF14; }
  .ftl-price { font-family: 'Oswald', sans-serif; font-size: 36px; font-weight: 500; color: #39FF14; line-height: 1; }
  .ftl-urgency { display: flex; align-items: center; gap: 4px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: #FF3D00; }

  /* QTY */
  .ftl-qty-section { margin-bottom: 24px; }
  .ftl-qty-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; color: #555; display: block; margin-bottom: 10px; }
  .ftl-qty-ctrl { display: inline-flex; border: 1px solid rgba(255,255,255,0.1); }
  .ftl-qty-btn { width: 44px; height: 44px; background: rgba(255,255,255,0.03); border: none; color: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .ftl-qty-btn:hover:not(:disabled) { background: rgba(57,255,20,0.08); }
  .ftl-qty-btn:disabled { color: #333; cursor: default; }
  .ftl-qty-val { width: 56px; text-align: center; font-family: 'Oswald', sans-serif; font-size: 18px; color: #fff; border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
  .ftl-qty-total { display: block; margin-top: 10px; font-size: 13px; color: #666; }
  .ftl-qty-total strong { color: #39FF14; font-family: 'Oswald', sans-serif; font-size: 18px; }

  /* CTAs */
  .ftl-ctas { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
  .ftl-btn-buy { flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 24px; background: #39FF14; color: #0A0A0A; border: none; font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; cursor: pointer; transition: all 0.2s; }
  .ftl-btn-buy:hover { background: #2DE80F; box-shadow: 0 0 24px rgba(57,255,20,0.3); }
  .ftl-btn-buy:disabled { background: #222; color: #555; cursor: default; box-shadow: none; }
  .ftl-btn-wa { flex: 1; min-width: 160px; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 24px; background: transparent; color: #25D366; border: 1px solid rgba(37,211,102,0.4); font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; cursor: pointer; transition: all 0.2s; }
  .ftl-btn-wa:hover { background: rgba(37,211,102,0.08); }

  /* TRUST */
  .ftl-trust { display: flex; gap: 20px; margin-bottom: 28px; padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
  .ftl-trust-item { display: flex; align-items: center; gap: 6px; color: #39FF14; }
  .ftl-trust-item span { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; color: #555; }

  /* SECTIONS */
  .ftl-section { margin-bottom: 24px; }
  .ftl-section-h { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; color: #39FF14; margin-bottom: 10px; }
  .ftl-section-p { font-size: 14px; line-height: 1.7; color: #888; }
  .ftl-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .ftl-list li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #ccc; }
  .ftl-list li svg { color: #39FF14; flex-shrink: 0; }
  .ftl-list-muted li svg { color: #555; }
  .ftl-list-muted li { color: #888; }

  /* FOOTER */
  .ftl-footer { text-align: center; padding: 24px; border-top: 1px solid rgba(255,255,255,0.04); }
  .ftl-footer p { font-size: 11px; color: #333; }

  @media (max-width: 768px) {
    .ftl-gal-main { aspect-ratio: 4/3; }
    .ftl-panel-inner { padding: 24px 0 48px; }
    .ftl-ctas { flex-direction: column; }
  }
`
