import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight, CreditCard, Package, ShoppingCart } from 'lucide-react'
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
    return <div className="lxl-gal-empty"><Package strokeWidth={1} style={{ width: 52, height: 52, color: '#D0CBC4' }} /><span>Sin imágenes</span></div>
  }

  return (
    <div className="lxl-gal">
      {lightbox !== null && <ImageLightbox imagenes={images} indiceActual={lightbox} onClose={() => setLightbox(null)} onIndexChange={(i) => { setLightbox(i); setSel(i) }} getNombreProducto={() => producto.nombre} />}
      {images.length > 1 && (
        <div className="lxl-gal-thumbs">{images.map((src, i) => (
          <button key={i} type="button" onClick={() => setSel(i)} className="lxl-gal-thumb" style={{ outline: i === sel ? '2px solid #C8352B' : '2px solid transparent', outlineOffset: 2, opacity: i === sel ? 1 : 0.45 }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}</div>
      )}
      <div className="lxl-gal-main" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setLightbox(sel)}>
        <div className="lxl-gal-strip" style={{ width: `${images.length * 100}%`, transform: `translateX(-${(100 / images.length) * sel}%)` }}>
          {images.map((src, i) => (
            <div key={i} style={{ width: `${100 / images.length}%`, flexShrink: 0 }}>
              <img src={src} alt={`${producto.nombre} ${i + 1}`} className="lxl-gal-img" style={{ transform: hov ? 'scale(1.04)' : 'scale(1)' }} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="lxl-gal-arr lxl-gal-arr-l"><ChevronLeft size={18} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="lxl-gal-arr lxl-gal-arr-r"><ChevronRight size={18} /></button>
          </>
        )}
        {images.length > 1 && (
          <div className="lxl-gal-dots">{images.map((_, i) => <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setSel(i) }} className="lxl-gal-dot" style={{ width: i === sel ? 22 : 6, background: i === sel ? '#C8352B' : '#D0CBC4' }} />)}</div>
        )}
      </div>
    </div>
  )
}

export default function LuxuryLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onAddToCart, onComprar, isInCart, navigateBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="lxl-root">
        <nav className="lxl-nav">
          <div className="lxl-nav-inner">
            <button type="button" onClick={navigateBack} className="lxl-nav-back"><ArrowLeft size={12} /> Tienda</button>
            <span className="lxl-nav-sep">/</span>
            <span className="lxl-nav-crumb">{producto.nombre}</span>
          </div>
        </nav>

        <div className="lxl-content">
          <div className="lxl-grid">
            <div className="lxl-col-gal"><Gallery producto={producto} /></div>
            <div className="lxl-col-info">
              <div className="lxl-tags">
                <span className="lxl-tag-cat">{producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
                {!sinStock && producto.tipo === 'producto' && <span className="lxl-tag-avail"><span className="lxl-avail-dot" /> Disponible</span>}
                {sinStock && <span className="lxl-tag-out">Sin stock</span>}
              </div>

              <h1 className="lxl-title">{producto.nombre}</h1>

              {producto.precio != null && (
                <div className="lxl-price-section">
                  <span className="lxl-price">{fmt(producto.precio)}</span>
                  {stockBajo && !sinStock && <span className="lxl-price-tag"><Zap size={10} /> Quedan {producto.stock}</span>}
                </div>
              )}

              {!sinStock && (
                <div className="lxl-qty">
                  <span className="lxl-qty-lbl">Cantidad</span>
                  <div className="lxl-qty-ctrl">
                    <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="lxl-qty-btn">−</button>
                    <span className="lxl-qty-val">{cantidad}</span>
                    <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="lxl-qty-btn lxl-qty-add">+</button>
                  </div>
                  {cantidad > 1 && producto.precio != null && (
                    <div className="lxl-qty-total"><span>Total</span><span className="lxl-qty-total-val">{fmt(producto.precio * cantidad)}</span></div>
                  )}
                </div>
              )}

              <div className="lxl-trust">
                {[{ Icon: ShieldCheck, label: 'Pago seguro' }, { Icon: Zap, label: 'Respuesta rápida' }, { Icon: Star, label: 'Calidad garantizada' }].map(({ Icon, label }) => (
                  <div key={label} className="lxl-trust-item"><Icon strokeWidth={1.5} style={{ width: 15, height: 15, color: '#C8352B' }} /><span>{label}</span></div>
                ))}
              </div>

              <div className="lxl-rule" />

              {producto.descripcion && (
                <div className="lxl-section"><h2 className="lxl-section-h">Descripción</h2><p className="lxl-section-p">{producto.descripcion}</p></div>
              )}

              {producto.caracteristicas?.length > 0 && (
                <div className="lxl-section"><h2 className="lxl-section-h">Características</h2>
                  <ul className="lxl-list">{producto.caracteristicas.map((c, i) => <li key={i} className="lxl-list-item"><span className="lxl-check"><Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#C8352B' }} /></span>{c}</li>)}</ul>
                </div>
              )}

              {producto.usos?.length > 0 && (
                <div className="lxl-section"><h2 className="lxl-section-h">Usos</h2>
                  <ul className="lxl-list">{producto.usos.map((u, i) => <li key={i} className="lxl-list-item"><span className="lxl-check lxl-check-muted"><Check strokeWidth={2.5} style={{ width: 9, height: 9, color: '#C0BAB3' }} /></span>{u}</li>)}</ul>
                </div>
              )}

              <div className="lxl-rule" />

              <div className="lxl-ctas">
                <button type="button" onClick={onAddToCart} disabled={sinStock} className="lxl-btn-cart" style={{ background: isInCart ? '#22c55e' : '#f5f5f5', color: isInCart ? '#fff' : '#0D0D0D', border: isInCart ? 'none' : '1.5px solid #E8E4DF' }}>
                  <ShoppingCart size={15} /> {isInCart ? 'En el carrito' : 'Agregar al carrito'}
                </button>
                <button type="button" onClick={onComprar} disabled={sinStock} className="lxl-btn-mp"><CreditCard size={15} /> Comprar ahora</button>
                <button type="button" onClick={onWhatsApp} className="lxl-btn-wa"><WhatsAppIcon size={18} /> Pedir por WhatsApp</button>
                <div className="lxl-pay-note"><ShieldCheck strokeWidth={1.5} style={{ width: 12, height: 12, color: '#C0BAB3', flexShrink: 0 }} /><p>Aceptamos <strong>transferencia, efectivo</strong> y otros medios.</p></div>
              </div>
            </div>
          </div>
        </div>

        <footer className="lxl-footer"><p>© {new Date().getFullYear()} Miracle Solutions · Todos los derechos reservados</p></footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lxl-root { min-height: 100vh; background: #FFFFFF; color: #0D0D0D; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .lxl-nav { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #E8E4DF; }
  .lxl-nav-inner { max-width: 1300px; margin: 0 auto; padding: 0 40px; height: 56px; display: flex; align-items: center; gap: 10px; }
  .lxl-nav-back { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #0D0D0D; background: none; border: none; cursor: pointer; padding: 6px 0; transition: opacity 0.15s; }
  .lxl-nav-back:hover { opacity: 0.6; }
  .lxl-nav-sep { color: #D0CBC4; font-size: 12px; }
  .lxl-nav-crumb { font-size: 12px; color: #8A8480; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }

  /* CONTENT */
  .lxl-content { max-width: 1100px; margin: 0 auto; padding: 40px 40px 60px; }
  .lxl-grid { display: grid; grid-template-columns: 1.3fr 0.95fr; gap: 56px; align-items: start; }

  /* GALLERY - Desktop horizontal layout with left thumbnails */
  .lxl-gal { display: flex; flex-direction: row; gap: 12px; position: sticky; top: 76px; }
  .lxl-gal-empty { aspect-ratio: 4/5; background: #F8F5F1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; }
  .lxl-gal-empty span { font-size: 12px; color: #C0BAB3; letter-spacing: 0.08em; }
  .lxl-gal-main { position: relative; overflow: hidden; cursor: pointer; background: #FFFFFF; aspect-ratio: 4/5; flex: 1; min-width: 0; }
  .lxl-gal-strip { display: flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); height: 100%; }
  .lxl-gal-img { width: 100%; height: 100%; object-fit: contain; display: block; transition: transform 0.6s ease; }
  .lxl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: rgba(255,255,255,0.9); border: 1px solid #E8E4DF; color: #0D0D0D; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.15s; }
  .lxl-gal-arr:hover { background: #fff; border-color: #C8352B; }
  .lxl-gal-arr-l { left: 12px; }
  .lxl-gal-arr-r { right: 12px; }
  .lxl-gal-dots { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 5; }
  .lxl-gal-dot { height: 4px; border: none; padding: 0; cursor: pointer; transition: all 0.25s; }
  .lxl-gal-thumbs { display: flex; flex-direction: column; gap: 8px; max-width: 80px; flex-shrink: 0; order: -1; }
  .lxl-gal-thumb { width: 80px; height: 80px; cursor: pointer; border: none; padding: 0; background: #F8F5F1; transition: opacity 0.2s; overflow: hidden; flex-shrink: 0; }

  /* INFO */
  .lxl-tags { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
  .lxl-tag-cat { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0D0D0D; background: #F8F5F1; padding: 4px 10px; }
  .lxl-tag-avail { font-size: 11px; color: #22C55E; display: flex; align-items: center; gap: 5px; }
  .lxl-avail-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; }
  .lxl-tag-out { font-size: 11px; color: #BDBDBD; }
  .lxl-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3vw, 36px); font-weight: 400; line-height: 1.2; margin-bottom: 16px; }
  .lxl-price-section { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; background: #F8F5F1; padding: 16px 20px; }
  .lxl-price { font-family: 'Playfair Display', serif; font-size: 32px; color: #C8352B; line-height: 1; }
  .lxl-price-tag { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #C8352B; }

  /* QTY */
  .lxl-qty { margin-bottom: 20px; background: #F8F5F1; padding: 16px 20px; }
  .lxl-qty-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A8480; display: block; margin-bottom: 10px; }
  .lxl-qty-ctrl { display: inline-flex; align-items: center; gap: 0; border: 1px solid #E8E4DF; }
  .lxl-qty-btn { width: 40px; height: 40px; background: #fff; border: none; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0D0D0D; transition: background 0.15s; }
  .lxl-qty-btn:hover:not(:disabled) { background: #F0EDE9; }
  .lxl-qty-btn:disabled { color: #D0CBC4; cursor: default; }
  .lxl-qty-add { border-left: 1px solid #E8E4DF; }
  .lxl-qty-val { width: 48px; text-align: center; font-size: 16px; font-weight: 600; border-left: 1px solid #E8E4DF; border-right: 1px solid #E8E4DF; height: 40px; display: flex; align-items: center; justify-content: center; }
  .lxl-qty-total { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1px solid #E8E4DF; font-size: 13px; color: #8A8480; }
  .lxl-qty-total-val { font-family: 'Playfair Display', serif; font-size: 20px; color: #C8352B; }

  /* TRUST */
  .lxl-trust { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .lxl-trust-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #8A8480; }

  .lxl-rule { height: 1px; background: #E8E4DF; margin: 20px 0; }

  /* SECTIONS */
  .lxl-section { margin-bottom: 20px; }
  .lxl-section-h { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0D0D0D; margin-bottom: 10px; }
  .lxl-section-p { font-size: 14px; line-height: 1.7; color: #5A5550; }
  .lxl-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .lxl-list-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #5A5550; line-height: 1.5; }
  .lxl-check { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; background: rgba(200,53,43,0.08); flex-shrink: 0; margin-top: 1px; }
  .lxl-check-muted { background: rgba(192,186,179,0.15); }

  /* CTAS */
  .lxl-ctas { display: flex; flex-direction: column; gap: 10px; }
  .lxl-btn-cart { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 24px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
  .lxl-btn-cart:hover { opacity: 0.9; }
  .lxl-btn-cart:disabled { opacity: 0.5; cursor: not-allowed; }
  .lxl-btn-mp { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 24px; background: #0D0D0D; color: #fff; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; letter-spacing: 0.02em; }
  .lxl-btn-mp:hover { background: #1A1A1A; }
  .lxl-btn-mp:disabled { background: #E8E4DF; color: #C0BAB3; cursor: default; }
  .lxl-btn-wa { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 24px; background: #25D366; color: #fff; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; letter-spacing: 0.02em; }
  .lxl-btn-wa:hover { background: #1EBE57; }
  .lxl-pay-note { display: flex; align-items: flex-start; gap: 8px; background: #F8F5F1; padding: 12px 16px; margin-top: 4px; }
  .lxl-pay-note p { font-size: 11px; color: #8A8480; line-height: 1.5; }
  .lxl-pay-note strong { color: #5A5550; }

  /* FOOTER */
  .lxl-footer { text-align: center; padding: 28px 24px; border-top: 1px solid #E8E4DF; }
  .lxl-footer p { font-size: 11px; color: #C0BAB3; }

  /* RESPONSIVE */
  @media (max-width: 1023px) {
    .lxl-grid { grid-template-columns: 1fr; gap: 28px; }
    .lxl-gal { position: static; flex-direction: column-reverse; }
    .lxl-gal-thumbs { flex-direction: row; max-width: 100%; overflow-x: auto; padding-bottom: 4px; }
    .lxl-gal-thumbs::-webkit-scrollbar { height: 4px; }
    .lxl-gal-thumbs::-webkit-scrollbar-thumb { background: #E8E4DF; border-radius: 2px; }
    .lxl-gal-thumb { width: 64px; height: 64px; }
    .lxl-content { padding: 20px 16px 40px; }
    .lxl-nav-inner { padding: 0 16px; }
  }
`
