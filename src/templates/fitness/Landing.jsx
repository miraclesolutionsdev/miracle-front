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
        {/* Counter overlay */}
        {images.length > 1 && (
          <div className="ftl-gal-counter">{sel + 1} / {images.length}</div>
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
  const isProducto = producto.tipo === 'producto'
  const hasDesc = !!producto.descripcion
  const hasCaract = producto.caracteristicas?.length > 0
  const hasUsos = producto.usos?.length > 0
  const sectionCount = [hasDesc, hasCaract, hasUsos].filter(Boolean).length

  return (
    <>
      <style>{CSS}</style>
      <div className="ftl-root">
        {/* ── TOP BAR ── */}
        <nav className="ftl-nav">
          <button type="button" onClick={navigateBack} className="ftl-nav-back">
            <ArrowLeft size={14} /> VOLVER
          </button>
          <div className="ftl-nav-line" />
          <span className="ftl-nav-name">{producto.nombre}</span>
        </nav>

        {/* ── SHOWCASE: Gallery centered + floating purchase panel ── */}
        <div className="ftl-showcase">
          {/* Gallery — centered, controlled width */}
          <div className="ftl-showcase-gallery">
            <Gallery producto={producto} />
          </div>

          {/* Purchase command strip — overlaps bottom of gallery area */}
          <div className="ftl-command">
            <div className="ftl-command-inner">
              {/* Left: product identity */}
              <div className="ftl-cmd-identity">
                <div className="ftl-cmd-badges">
                  <span className="ftl-cmd-type">{isProducto ? 'PRODUCTO' : 'SERVICIO'}</span>
                  {!sinStock && isProducto && <span className="ftl-cmd-status ftl-cmd-ok"><span className="ftl-pulse" /> DISPONIBLE</span>}
                  {sinStock && <span className="ftl-cmd-status ftl-cmd-out">AGOTADO</span>}
                </div>
                <h1 className="ftl-cmd-title">{producto.nombre}</h1>
              </div>

              {/* Center: price block */}
              <div className="ftl-cmd-price-block">
                {producto.precio != null ? (
                  <>
                    <span className="ftl-cmd-price-label">PRECIO</span>
                    <span className="ftl-cmd-price">{fmt(producto.precio)}</span>
                    {stockBajo && !sinStock && (
                      <span className="ftl-cmd-urgency"><Zap size={12} /> QUEDAN {producto.stock}</span>
                    )}
                  </>
                ) : (
                  <span className="ftl-cmd-consult">CONSULTAR</span>
                )}
              </div>

              {/* Right: qty + CTAs */}
              <div className="ftl-cmd-actions">
                {!sinStock && (
                  <div className="ftl-cmd-qty">
                    <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className="ftl-qty-btn">−</button>
                    <span className="ftl-qty-val">{cantidad}</span>
                    <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} className="ftl-qty-btn">+</button>
                  </div>
                )}
                <div className="ftl-cmd-btns">
                  <button type="button" onClick={onComprar} disabled={sinStock} className="ftl-btn-buy">
                    <CreditCard size={16} /> COMPRAR
                  </button>
                  <button type="button" onClick={onWhatsApp} className="ftl-btn-wa">
                    <WhatsAppIcon size={22} />
                  </button>
                </div>
                {cantidad > 1 && producto.precio != null && (
                  <span className="ftl-cmd-total">Total: <strong>{fmt(producto.precio * cantidad)}</strong></span>
                )}
              </div>
            </div>

            {/* Trust strip */}
            <div className="ftl-trust-strip">
              {[{ Icon: ShieldCheck, t: 'PAGO SEGURO' }, { Icon: Zap, t: 'ENVÍO RÁPIDO' }, { Icon: Star, t: 'GARANTÍA' }].map(({ Icon, t }) => (
                <div key={t} className="ftl-trust-item"><Icon strokeWidth={1.5} size={14} /><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SPEC SHEET: Technical data blocks ── */}
        {(hasDesc || hasCaract || hasUsos) && (
          <div className="ftl-specs">
            <div className="ftl-specs-header">
              <div className="ftl-specs-line" />
              <span className="ftl-specs-tag">FICHA TÉCNICA</span>
              <div className="ftl-specs-line" />
            </div>

            <div className={`ftl-specs-grid ftl-specs-${sectionCount}`}>
              {hasDesc && (
                <div className="ftl-spec-block ftl-spec-desc">
                  <div className="ftl-spec-label">
                    <span className="ftl-spec-num">01</span>
                    <span>DESCRIPCIÓN</span>
                  </div>
                  <div className="ftl-spec-content">
                    <p className="ftl-desc-text">{producto.descripcion}</p>
                  </div>
                </div>
              )}

              {hasCaract && (
                <div className="ftl-spec-block ftl-spec-caract">
                  <div className="ftl-spec-label">
                    <span className="ftl-spec-num">{hasDesc ? '02' : '01'}</span>
                    <span>CARACTERÍSTICAS</span>
                  </div>
                  <div className="ftl-spec-content">
                    <ul className="ftl-spec-list">
                      {producto.caracteristicas.map((c, i) => (
                        <li key={i}><Check size={12} strokeWidth={3} /> {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {hasUsos && (
                <div className="ftl-spec-block ftl-spec-usos">
                  <div className="ftl-spec-label">
                    <span className="ftl-spec-num">{String(sectionCount).padStart(2, '0')}</span>
                    <span>USOS</span>
                  </div>
                  <div className="ftl-spec-content">
                    <ul className="ftl-spec-list ftl-spec-list-alt">
                      {producto.usos.map((u, i) => (
                        <li key={i}><Check size={12} strokeWidth={3} /> {u}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="ftl-footer">
          <p>© {new Date().getFullYear()} · Todos los derechos reservados</p>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ftl-root {
    min-height: 100vh;
    background: #0A0A0A;
    color: #E0E0E0;
    font-family: 'Barlow', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ═══════════ NAV ═══════════ */
  .ftl-nav {
    position: sticky; top: 0; z-index: 40;
    background: rgba(10,10,10,0.96);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(57,255,20,0.08);
    display: flex; align-items: center; gap: 16px;
    padding: 0 32px; height: 56px;
  }
  .ftl-nav-back {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.15em;
    color: #39FF14; background: none; border: none; cursor: pointer;
    transition: opacity 0.2s;
  }
  .ftl-nav-back:hover { opacity: 0.7; }
  .ftl-nav-line { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }
  .ftl-nav-name {
    font-size: 13px; color: #555;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-family: 'Barlow', sans-serif; letter-spacing: 0.02em;
  }

  /* ═══════════ SHOWCASE ═══════════ */
  .ftl-showcase {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 32px 0;
  }

  .ftl-showcase-gallery {
    max-width: 620px;
    margin: 0 auto;
  }

  /* Gallery */
  .ftl-gal-empty {
    aspect-ratio: 4/3; background: #111;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ftl-gal-main {
    position: relative; overflow: hidden; cursor: pointer;
    background: #0D0D0D; aspect-ratio: 4/3;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ftl-gal-strip { display: flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); height: 100%; }
  .ftl-gal-img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ftl-gal-arr {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 40px; height: 40px;
    background: rgba(0,0,0,0.75); border: 1px solid rgba(57,255,20,0.25);
    color: #39FF14; cursor: pointer;
    display: flex; align-items: center; justify-content: center; z-index: 5;
    transition: all 0.15s;
  }
  .ftl-gal-arr:hover { background: rgba(57,255,20,0.12); border-color: #39FF14; }
  .ftl-gal-arr-l { left: 12px; }
  .ftl-gal-arr-r { right: 12px; }
  .ftl-gal-counter {
    position: absolute; bottom: 12px; right: 12px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    color: #39FF14; background: rgba(0,0,0,0.7);
    padding: 4px 10px; z-index: 5;
  }
  .ftl-gal-thumbs {
    display: flex; gap: 8px; padding: 12px 0; overflow-x: auto;
    justify-content: center;
  }
  .ftl-gal-thumb {
    width: 60px; height: 60px; cursor: pointer;
    border: 2px solid transparent; padding: 0;
    background: #111; transition: all 0.2s; flex-shrink: 0;
  }
  .ftl-gal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ═══════════ COMMAND STRIP ═══════════ */
  .ftl-command {
    margin-top: 32px;
    background: #111;
    border: 1px solid rgba(57,255,20,0.1);
    position: relative;
    overflow: hidden;
  }
  .ftl-command::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 5%, #39FF14 30%, #39FF14 70%, transparent 95%);
  }
  .ftl-command-inner {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 0;
  }

  /* Identity — left */
  .ftl-cmd-identity {
    padding: 20px 24px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .ftl-cmd-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .ftl-cmd-type {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
    padding: 3px 10px; border: 1px solid rgba(255,255,255,0.12);
    color: #777;
  }
  .ftl-cmd-status {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 6px;
  }
  .ftl-cmd-ok { color: #39FF14; }
  .ftl-cmd-out { color: #666; }
  .ftl-pulse {
    display: inline-block; width: 6px; height: 6px;
    background: #39FF14; border-radius: 50%;
    animation: ftlPulse 2s ease infinite;
  }
  @keyframes ftlPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .ftl-cmd-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.03em;
    color: #fff; line-height: 1.2;
  }

  /* Price — center */
  .ftl-cmd-price-block {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center;
    padding: 20px 16px;
    border-left: 1px solid rgba(255,255,255,0.06);
    border-right: 1px solid rgba(255,255,255,0.06);
    align-self: stretch;
    background: rgba(57,255,20,0.02);
  }
  .ftl-cmd-price-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px; font-weight: 600; letter-spacing: 0.25em;
    color: #555; margin-bottom: 3px;
  }
  .ftl-cmd-price {
    font-family: 'Oswald', sans-serif;
    font-size: 30px; font-weight: 500;
    color: #39FF14; line-height: 1;
    white-space: nowrap;
  }
  .ftl-cmd-urgency {
    display: flex; align-items: center; gap: 4px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    color: #FF3D00; margin-top: 5px;
  }
  .ftl-cmd-consult {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: 0.15em;
    color: #555;
  }

  /* Actions — right */
  .ftl-cmd-actions {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 24px;
    justify-content: flex-end;
  }
  .ftl-cmd-qty {
    display: inline-flex;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .ftl-qty-btn {
    width: 40px; height: 44px;
    background: rgba(255,255,255,0.03); border: none;
    color: #fff; font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .ftl-qty-btn:hover:not(:disabled) { background: rgba(57,255,20,0.08); }
  .ftl-qty-btn:disabled { color: #333; cursor: default; }
  .ftl-qty-val {
    width: 42px; text-align: center;
    font-family: 'Oswald', sans-serif; font-size: 16px;
    color: #fff;
    border-left: 1px solid rgba(255,255,255,0.1);
    border-right: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
  }
  .ftl-cmd-btns { display: flex; gap: 0; align-items: stretch; }
  .ftl-btn-buy {
    display: flex; align-items: center; gap: 8px;
    padding: 0 24px; height: 44px;
    background: #39FF14; color: #0A0A0A; border: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: 0.12em;
    cursor: pointer; transition: all 0.2s;
    white-space: nowrap;
  }
  .ftl-btn-buy:hover { background: #2DE80F; box-shadow: 0 0 20px rgba(57,255,20,0.25); }
  .ftl-btn-buy:disabled { background: #222; color: #555; cursor: default; box-shadow: none; }
  .ftl-btn-wa {
    display: flex; align-items: center; justify-content: center;
    width: 54px; height: 44px;
    background: rgba(37,211,102,0.08); color: #25D366;
    border: 1px solid rgba(37,211,102,0.45);
    cursor: pointer; transition: all 0.2s;
    flex-shrink: 0;
    margin-left: -1px;
  }
  .ftl-btn-wa:hover { background: rgba(37,211,102,0.18); }
  .ftl-cmd-total {
    font-size: 13px; color: #666;
    white-space: nowrap;
  }
  .ftl-cmd-total strong {
    color: #39FF14; font-family: 'Oswald', sans-serif; font-size: 16px;
  }

  /* Trust strip */
  .ftl-trust-strip {
    display: flex; gap: 28px;
    padding: 12px 24px;
    border-top: 1px solid rgba(255,255,255,0.04);
    background: rgba(0,0,0,0.3);
    flex-wrap: wrap;
    justify-content: center;
  }
  .ftl-trust-item {
    display: flex; align-items: center; gap: 7px;
    color: #39FF14;
  }
  .ftl-trust-item span {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    color: #555;
  }

  /* ═══════════ SPEC SHEET ═══════════ */
  .ftl-specs {
    max-width: 1200px; margin: 0 auto;
    padding: 48px 32px 60px;
  }

  .ftl-specs-header {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 32px;
  }
  .ftl-specs-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57,255,20,0.2), transparent);
  }
  .ftl-specs-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 0.3em;
    color: #39FF14; flex-shrink: 0;
  }

  /* Grid — adapts based on section count */
  .ftl-specs-grid {
    display: grid; gap: 0;
  }
  .ftl-specs-1 { grid-template-columns: 1fr; }
  .ftl-specs-2 { grid-template-columns: 1fr 1fr; }
  .ftl-specs-3 { grid-template-columns: 1fr 1fr; }
  .ftl-specs-3 .ftl-spec-desc { grid-column: 1 / -1; }

  /* Spec block */
  .ftl-spec-block {
    border: 1px solid rgba(255,255,255,0.06);
    background: #0E0E0E;
    position: relative;
    overflow: hidden;
  }
  .ftl-spec-block + .ftl-spec-block { margin-left: -1px; }
  .ftl-specs-3 .ftl-spec-caract,
  .ftl-specs-3 .ftl-spec-usos { margin-top: -1px; }

  .ftl-spec-label {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 24px;
    background: rgba(57,255,20,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 0.2em;
    color: #39FF14;
  }
  .ftl-spec-num {
    font-family: 'Oswald', sans-serif;
    font-size: 20px; font-weight: 300;
    color: rgba(57,255,20,0.25);
    letter-spacing: 0;
    line-height: 1;
  }

  .ftl-spec-content { padding: 24px; }

  .ftl-desc-text {
    font-size: 16px; line-height: 1.85; color: #999;
    font-family: 'Barlow', sans-serif;
    max-width: 800px;
  }

  .ftl-spec-list {
    list-style: none;
    display: flex; flex-direction: column; gap: 10px;
  }
  .ftl-spec-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 15px; color: #ccc; line-height: 1.55;
    font-family: 'Barlow', sans-serif;
  }
  .ftl-spec-list li svg {
    color: #39FF14; flex-shrink: 0; margin-top: 4px;
  }
  .ftl-spec-list-alt li svg { color: #555; }
  .ftl-spec-list-alt li { color: #999; }

  /* ═══════════ FOOTER ═══════════ */
  .ftl-footer {
    text-align: center; padding: 28px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .ftl-footer p { font-size: 12px; color: #333; }

  /* ═══════════ MOBILE ═══════════ */
  @media (max-width: 768px) {
    .ftl-nav { padding: 0 16px; height: 52px; }
    .ftl-nav-line { display: none; }

    .ftl-showcase { padding: 0; }
    .ftl-showcase-gallery { max-width: 100%; }
    .ftl-gal-main { aspect-ratio: 4/3; border: none; }
    .ftl-gal-empty { aspect-ratio: 4/3; }
    .ftl-gal-thumbs { padding: 10px 16px; justify-content: flex-start; }

    .ftl-command { margin-top: 0; border-left: none; border-right: none; }
    .ftl-command-inner {
      display: flex; flex-direction: column; align-items: stretch;
      padding: 0; gap: 0;
    }
    .ftl-cmd-identity { padding: 20px 16px 16px; }
    .ftl-cmd-title { font-size: 22px; }
    .ftl-cmd-price-block {
      flex-direction: row; align-items: center; gap: 12px;
      padding: 14px 16px; border-left: 3px solid #39FF14;
      border-right: none; border-top: none; border-bottom: none;
      margin: 0 16px; align-self: stretch;
    }
    .ftl-cmd-price-label { margin-bottom: 0; }
    .ftl-cmd-price { font-size: 28px; }
    .ftl-cmd-actions {
      padding: 16px; gap: 12px;
      flex-wrap: wrap;
    }
    .ftl-cmd-qty { align-self: flex-start; }
    .ftl-cmd-btns { flex-direction: column; flex: 1; min-width: 0; }
    .ftl-btn-buy {
      padding: 16px 24px; font-size: 14px; height: auto;
      justify-content: center; width: 100%;
    }
    .ftl-btn-wa {
      width: 100%; height: 48px;
      flex-direction: row; gap: 8px;
    }
    .ftl-cmd-total { text-align: left; width: 100%; }
    .ftl-trust-strip { padding: 12px 16px; }

    .ftl-specs { padding: 24px 16px 40px; }
    .ftl-specs-grid { grid-template-columns: 1fr !important; }
    .ftl-specs-3 .ftl-spec-desc { grid-column: 1; }
    .ftl-spec-block + .ftl-spec-block { margin-left: 0; margin-top: -1px; }
    .ftl-spec-label { padding: 14px 16px; }
    .ftl-spec-content { padding: 16px; }
    .ftl-desc-text { font-size: 15px; }
    .ftl-spec-list li { font-size: 14px; }
  }
`
