import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, ChevronLeft, ChevronRight, CreditCard, Package, ShoppingCart } from 'lucide-react'
import ImageLightbox from '../../components/ImageLightbox.jsx'
import { getProductoImagenSrc } from '../../utils/api'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const GALLERY_MS = 5000

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function Gallery({ producto }) {
  const [sel, setSel] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const images = (producto.imagenes || []).map((_, i) => getProductoImagenSrc(producto, i)).filter(Boolean)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setSel((p) => (p + 1) % images.length), GALLERY_MS)
    return () => clearInterval(id)
  }, [images.length])

  if (images.length === 0) {
    return <div className="mnl-gal-empty"><Package strokeWidth={1} size={48} color="#D0D0D0" /></div>
  }

  return (
    <div className="mnl-gal">
      {lightbox !== null && <ImageLightbox imagenes={images} indiceActual={lightbox} onClose={() => setLightbox(null)} onIndexChange={(i) => { setLightbox(i); setSel(i) }} getNombreProducto={() => producto.nombre} />}
      <div className="mnl-gal-main" onClick={() => setLightbox(sel)}>
        <img src={images[sel]} alt={producto.nombre} className="mnl-gal-img" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p - 1 + images.length) % images.length) }} className="mnl-gal-arr mnl-gal-arr-l"><ChevronLeft size={18} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setSel((p) => (p + 1) % images.length) }} className="mnl-gal-arr mnl-gal-arr-r"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mnl-gal-dots">{images.map((_, i) => <span key={i} className="mnl-gal-dot" style={{ opacity: i === sel ? 1 : 0.2, transform: i === sel ? 'scale(1.4)' : 'scale(1)' }} />)}</div>
      )}
    </div>
  )
}

export default function MinimalLanding({ producto, cantidad, setCantidad, maxCantidad, sinStock, stockBajo, onWhatsApp, onAddToCart, isInCart, onComprar, navigateBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="mnl-root">
        {/* Back */}
        <nav className="mnl-nav">
          <button type="button" onClick={navigateBack} className="mnl-back"><ArrowLeft size={14} strokeWidth={1.5} /> Volver</button>
        </nav>

        {/* Centered content */}
        <div className="mnl-content">
          {/* Gallery */}
          <Gallery producto={producto} />

          {/* Info - centered below image */}
          <div className="mnl-info">
            {sinStock && <span className="mnl-sold">Agotado</span>}

            <h1 className="mnl-title">{producto.nombre}</h1>

            {producto.precio != null && (
              <p className="mnl-price">{fmt(producto.precio)}</p>
            )}

            {stockBajo && !sinStock && <p className="mnl-low">Quedan {producto.stock} unidades</p>}

            {producto.descripcion && <p className="mnl-desc">{producto.descripcion}</p>}

            {/* Qty */}
            {!sinStock && (
              <div className="mnl-qty">
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="mnl-qty-btn">−</button>
                <span className="mnl-qty-val">{cantidad}</span>
                <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="mnl-qty-btn">+</button>
              </div>
            )}

            {cantidad > 1 && producto.precio != null && (
              <p className="mnl-total">Total: {fmt(producto.precio * cantidad)}</p>
            )}

            {/* CTAs */}
            <div className="mnl-ctas">
              <button type="button" onClick={onAddToCart} disabled={sinStock} className="mnl-btn-cart" style={{ background: isInCart ? '#22c55e' : '#666', color: '#fff' }}>
                <ShoppingCart size={16} /> {isInCart ? 'En el carrito' : 'Agregar al carrito'}
              </button>
              <button type="button" onClick={onComprar} disabled={sinStock} className="mnl-btn-buy">
                Comprar
              </button>
              <button type="button" onClick={onWhatsApp} className="mnl-btn-wa">
                <WhatsAppIcon size={16} /> WhatsApp
              </button>
            </div>

            {/* Characteristics */}
            {producto.caracteristicas?.length > 0 && (
              <div className="mnl-section">
                <h2>Características</h2>
                <ul>{producto.caracteristicas.map((c, i) => <li key={i}><Check size={12} strokeWidth={1.5} /> {c}</li>)}</ul>
              </div>
            )}

            {producto.usos?.length > 0 && (
              <div className="mnl-section">
                <h2>Usos</h2>
                <ul>{producto.usos.map((u, i) => <li key={i}><Check size={12} strokeWidth={1.5} /> {u}</li>)}</ul>
              </div>
            )}

            {/* Trust */}
            <div className="mnl-trust">
              <span><ShieldCheck size={14} strokeWidth={1.5} /> Pago seguro</span>
              <span><Zap size={14} strokeWidth={1.5} /> Envío rápido</span>
            </div>
          </div>
        </div>

        <footer className="mnl-footer"><p>© {new Date().getFullYear()} · Todos los derechos reservados</p></footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mnl-root { min-height: 100vh; background: #FAFAFA; color: #1A1A1A; font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; }

  .mnl-nav { padding: 20px 32px; }
  .mnl-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 300; color: #999; background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .mnl-back:hover { color: #1A1A1A; }

  .mnl-content { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; text-align: center; }

  /* GALLERY */
  .mnl-gal { margin-bottom: 40px; }
  .mnl-gal-empty { aspect-ratio: 1; background: #F0F0F0; border-radius: 24px; display: flex; align-items: center; justify-content: center; max-width: 520px; margin: 0 auto; }
  .mnl-gal-main { position: relative; max-width: 520px; margin: 0 auto; cursor: pointer; overflow: hidden; border-radius: 24px; background: #fff; box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
  .mnl-gal-img { width: 100%; aspect-ratio: 1; object-fit: contain; display: block; transition: opacity 0.4s; }
  .mnl-gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; color: #1A1A1A; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: all 0.2s; }
  .mnl-gal-arr:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .mnl-gal-arr-l { left: 14px; }
  .mnl-gal-arr-r { right: 14px; }
  .mnl-gal-dots { display: flex; gap: 8px; justify-content: center; margin-top: 16px; }
  .mnl-gal-dot { width: 6px; height: 6px; border-radius: 50%; background: #1A1A1A; transition: all 0.3s; }

  /* INFO */
  .mnl-info { }
  .mnl-sold { display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #B0B0B0; margin-bottom: 12px; }
  .mnl-title { font-size: clamp(24px, 4vw, 36px); font-weight: 300; line-height: 1.3; margin-bottom: 12px; letter-spacing: -0.01em; }
  .mnl-price { font-size: 28px; font-weight: 500; color: #1A1A1A; margin-bottom: 8px; }
  .mnl-low { font-size: 12px; font-weight: 400; color: #E88D4F; margin-bottom: 8px; }
  .mnl-desc { font-size: 14px; font-weight: 300; line-height: 1.8; color: #888; max-width: 500px; margin: 16px auto 24px; }

  /* QTY */
  .mnl-qty { display: inline-flex; align-items: center; border: 1px solid #E8E8E8; border-radius: 50px; overflow: hidden; margin-bottom: 8px; }
  .mnl-qty-btn { width: 44px; height: 44px; background: none; border: none; font-size: 18px; cursor: pointer; color: #1A1A1A; transition: background 0.15s; display: flex; align-items: center; justify-content: center; }
  .mnl-qty-btn:hover:not(:disabled) { background: #F0F0F0; }
  .mnl-qty-btn:disabled { color: #D0D0D0; cursor: default; }
  .mnl-qty-val { width: 40px; text-align: center; font-size: 15px; font-weight: 500; }
  .mnl-total { font-size: 13px; color: #B0B0B0; margin-bottom: 16px; }

  /* CTAs */
  .mnl-ctas { display: flex; gap: 10px; justify-content: center; margin: 24px 0 32px; flex-wrap: wrap; }
  .mnl-btn-cart { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; border-radius: 50px; font-family: 'Sora', sans-serif; letter-spacing: 0.02em; }
  .mnl-btn-cart:hover { opacity: 0.9; }
  .mnl-btn-cart:disabled { opacity: 0.5; cursor: not-allowed; }
  .mnl-btn-buy { padding: 14px 40px; background: #1A1A1A; color: #fff; border: none; border-radius: 50px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
  .mnl-btn-buy:hover { background: #333; }
  .mnl-btn-buy:disabled { background: #E0E0E0; color: #B0B0B0; cursor: default; }
  .mnl-btn-wa { padding: 14px 28px; background: none; color: #25D366; border: 1.5px solid #25D366; border-radius: 50px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .mnl-btn-wa:hover { background: rgba(37,211,102,0.05); }

  /* SECTIONS */
  .mnl-section { text-align: left; max-width: 500px; margin: 0 auto 24px; }
  .mnl-section h2 { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #B0B0B0; margin-bottom: 12px; }
  .mnl-section ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .mnl-section li { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 300; color: #666; }
  .mnl-section li svg { color: #1A1A1A; flex-shrink: 0; }

  /* TRUST */
  .mnl-trust { display: flex; gap: 20px; justify-content: center; padding-top: 24px; border-top: 1px solid #EBEBEB; flex-wrap: wrap; }
  .mnl-trust span { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 300; color: #B0B0B0; }
  .mnl-trust svg { color: #1A1A1A; }

  .mnl-footer { text-align: center; padding: 32px 24px; }
  .mnl-footer p { font-size: 11px; font-weight: 300; color: #D0D0D0; }

  @media (max-width: 1023px) {
    .mnl-content { padding: 0 16px 60px; }
    .mnl-gal-main { border-radius: 16px; }
    .mnl-ctas { flex-direction: column; align-items: center; }
    .mnl-btn-buy, .mnl-btn-wa { width: 100%; justify-content: center; }
  }
`
