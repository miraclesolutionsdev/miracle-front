import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'
import MiniCart from '../../components/MiniCart'

function SkeletonCard() {
  return (
    <div className="ex-sk">
      <div className="ex-sk-img shimmer-ex" />
      <div className="ex-sk-body">
        <div className="ex-sk-line ex-sk-lg shimmer-ex" />
        <div className="ex-sk-line ex-sk-sm shimmer-ex" />
        <div className="ex-sk-line ex-sk-xs shimmer-ex" />
      </div>
    </div>
  )
}

function ProductCard({ p, index, slug }) {
  const [hov, setHov] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const touchX = useRef(null)
  const total = Math.max(p.imagenes?.length || 1, 1)
  const src = getProductoImagenSrc(p, imgIdx)
  const isProducto = p.tipo === 'producto'
  const sinStock = isProducto && p.stock != null && p.stock <= 0
  const stockBajo = isProducto && p.stock != null && p.stock > 0 && p.stock <= 5

  const goNext = (e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % total) }
  const goPrev = (e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + total) % total) }
  const onTS = (e) => { touchX.current = e.touches[0].clientX }
  const onTE = (e) => {
    if (touchX.current === null) return
    const d = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(d) > 40) d < 0 ? goNext(e) : goPrev(e)
    touchX.current = null
  }

  return (
    <article
      role="button" tabIndex={0}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => navigateToProduct(p.id, slug)}
      onKeyDown={(e) => e.key === 'Enter' && navigateToProduct(p.id, slug)}
      className="ex-pc"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms`, opacity: sinStock ? 0.55 : 1 }}
    >
      <div className="ex-pc-img-wrap" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre || 'Producto'} className="ex-pc-img"
            style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div className="ex-pc-placeholder">{getInitials(p.nombre)}</div>
        )}
        <div className="ex-pc-overlay" style={{ opacity: hov ? 1 : 0 }} />
        <div className="ex-pc-cta-wrap" style={{ transform: hov ? 'translateY(0)' : 'translateY(12px)', opacity: hov ? 1 : 0 }}>
          <span className="ex-pc-cta">Ver producto</span>
        </div>
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="ex-pc-arr ex-pc-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="ex-pc-arr ex-pc-arr-r" aria-label="Siguiente">›</button>
          </>
        )}
        {total > 1 && (
          <div className="ex-pc-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                className="ex-pc-dot"
                style={{ width: i === imgIdx ? 18 : 5, background: i === imgIdx ? '#3d4f3a' : 'rgba(61,79,58,0.35)' }} />
            ))}
          </div>
        )}
        <div className="ex-pc-badges">
          <span className="ex-pc-badge-cat">{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {stockBajo && !sinStock && <span className="ex-pc-badge-low">Últimas {p.stock}</span>}
            {sinStock && <span className="ex-pc-badge-out">Agotado</span>}
          </div>
        </div>
      </div>
      <div className="ex-pc-info">
        <p className="ex-pc-name">{p.nombre || 'Sin nombre'}</p>
        {p.descripcion && <p className="ex-pc-sub">{p.descripcion.slice(0, 72)}{p.descripcion.length > 72 ? '…' : ''}</p>}
        <div className="ex-pc-footer">
          <div className="ex-pc-price-wrap">
            {p.precio != null
              ? <span className="ex-pc-price">{fmt(p.precio)}</span>
              : <span className="ex-pc-price-na">Consultar</span>}
            {isProducto && !sinStock && (
              <span className="ex-pc-avail">
                <span className="ex-pc-avail-dot" style={{ background: stockBajo ? '#b89a5a' : '#5a7055' }} />
                {stockBajo ? `${p.stock} disponibles` : 'En stock'}
              </span>
            )}
            {sinStock && (
              <span className="ex-pc-avail" style={{ color: '#7a8275' }}>
                <span className="ex-pc-avail-dot" style={{ background: '#c8d5c2' }} />
                Agotado
              </span>
            )}
          </div>
          <div className="ex-pc-add" aria-label="Agregar al carrito">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ExclusiveStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    totalProductos, enStock,
  } = useStoreData(slugProp)

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{CSS}</style>
      <div className="ex-root">

        {/* TOPBAR */}
        <div className="ex-topbar">
          <span>Envío gratis a toda Colombia&nbsp;&nbsp;·&nbsp;&nbsp;Cuotas sin interés&nbsp;&nbsp;·&nbsp;&nbsp;Devolución 30 días</span>
        </div>

        {/* NAV */}
        <nav className="ex-nav">
          <div className="ex-nav-inner">
            <button type="button" className="ex-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
              <span /><span /><span />
            </button>
            <div className="ex-nav-logo">
              <span className="ex-logo-name">{tenantNombre || 'STORE'}</span>
              <span className="ex-logo-tag">Tienda oficial</span>
            </div>
            <div className="ex-nav-center">
              <button type="button" className="ex-nav-link ex-nav-link-active">Colección</button>
              <button type="button" className="ex-nav-link" disabled>
                Novedades <span className="ex-nav-soon">Pronto</span>
              </button>
            </div>
            <div className="ex-nav-right">
              <MiniCart position="header" theme="exclusive" />
              <div className="ex-search-wrap">
                <svg className="ex-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input type="text" className="ex-search-input" placeholder="Buscar producto..."
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                {busqueda && (
                  <button type="button" className="ex-search-clear" onClick={() => setBusqueda('')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <button type="button" className="ex-search-toggle" onClick={() => setSearchOpen((s) => !s)} aria-label="Buscar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {searchOpen
                    ? <path d="M18 6 6 18M6 6l12 12" />
                    : <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>}
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile search */}
          <div className={`ex-mob-search${searchOpen ? ' open' : ''}`}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7a8275', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input ref={mobileInputRef} type="text" placeholder="Buscar productos..."
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {busqueda && (
                <button type="button"
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7a8275', cursor: 'pointer', display: 'flex', padding: 2 }}
                  onClick={() => setBusqueda('')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
          {/* Mobile menu */}
          {menuOpen && (
            <div className="ex-mob-menu">
              <button type="button" className="ex-mob-menu-link ex-mob-menu-link-active">Colección</button>
              <button type="button" className="ex-mob-menu-link" disabled>Novedades <span className="ex-nav-soon">Pronto</span></button>
            </div>
          )}
        </nav>

        {/* HERO */}
        <section className="ex-hero">
          <div className="ex-hero-inner">
            <div className="ex-hero-left">
              <p className="ex-hero-eyebrow">Tienda oficial · Colección {new Date().getFullYear()}</p>
              <h1 className="ex-hero-title">{tenantNombre || 'Store'} <em>Collection</em></h1>
              <p className="ex-hero-body">Productos seleccionados con los más altos estándares de calidad, diseñados para quienes no negocian ni comodidad ni estilo.</p>
              {!loading && (
                <div className="ex-hero-stats">
                  <div className="ex-hero-stat">
                    <span className="ex-stat-num">{totalProductos}</span>
                    <span className="ex-stat-lbl">Productos</span>
                  </div>
                  <div className="ex-hero-stat-div" />
                  <div className="ex-hero-stat">
                    <span className="ex-stat-num">{enStock}</span>
                    <span className="ex-stat-lbl">En stock</span>
                  </div>
                </div>
              )}
              <div className="ex-hero-btns">
                <button type="button" className="ex-btn-primary">Ver colección</button>
                <button type="button" className="ex-btn-ghost">Compra segura</button>
              </div>
            </div>
            <div className="ex-hero-right">
              <div className="ex-hero-badge-top">
                <span className="ex-badge-num">100%</span>
                <span className="ex-badge-lbl">Calidad</span>
              </div>
              <div className="ex-hero-device-outer">
                <div className="ex-hero-device-inner">
                  <div className="ex-device-dot" />
                  <div className="ex-device-bar" />
                  <div className="ex-device-bar ex-device-bar-sm" />
                  <div className="ex-device-bar" />
                  <div className="ex-device-bar ex-device-bar-sm" />
                </div>
              </div>
              <div className="ex-hero-badge-bottom">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Envío seguro
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="ex-trust">
          {[
            { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', label: 'Envío gratis Colombia' },
            { icon: 'M22 12h-4l-3 9L9 3l-3 9H2', label: 'Respuesta rápida' },
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Compra 100% segura' },
            { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Empaque discreto' },
          ].map(({ icon, label }) => (
            <div key={label} className="ex-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ex-trust-icon" aria-hidden="true">
                <path d={icon} />
              </svg>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* CATALOG */}
        <main className="ex-catalog">
          <div className="ex-catalog-header">
            <div>
              <p className="ex-catalog-label">Catálogo de productos</p>
              <p className="ex-catalog-count">
                <strong>{loading ? '—' : productosFiltrados.length}</strong>
                {' '}{productosFiltrados.length === 1 ? 'resultado' : 'resultados'}
                {busqueda && <> para &ldquo;{busqueda}&rdquo;</>}
              </p>
            </div>
            <a className="ex-catalog-link" style={{ cursor: 'default' }}>
              Ver todos
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>

          <div className="ex-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : productosFiltrados.length === 0
                ? (
                  <div className="ex-empty">
                    <span className="ex-empty-sym">—</span>
                    <p className="ex-empty-text">{busqueda ? `Sin resultados para "${busqueda}"` : 'Sin productos disponibles.'}</p>
                  </div>
                )
                : productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="ex-footer">
          <div className="ex-footer-inner">
            <div className="ex-footer-left">
              <span className="ex-footer-logo">{tenantNombre || 'Store'}</span>
              <span className="ex-footer-copy">© {new Date().getFullYear()} · Todos los derechos reservados</span>
            </div>
            <div className="ex-footer-right">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>Pago 100% seguro</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ex-white: #ffffff;
    --ex-bone: #f7f5f0;
    --ex-bone-mid: #ede9e1;
    --ex-bone-border: #e0dbd0;
    --ex-ink: #2c3028;
    --ex-ink-mid: #4a5246;
    --ex-ink-soft: #7a8275;
    --ex-sage: #3d4f3a;
    --ex-sage-mid: #5a7055;
    --ex-sage-mist: #c8d5c2;
    --ex-gold: #b89a5a;
  }

  .ex-root { min-height: 100vh; background: var(--ex-white); color: var(--ex-ink); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* TOPBAR */
  .ex-topbar { background: var(--ex-sage); color: rgba(255,255,255,0.75); text-align: center; font-size: 11px; font-weight: 400; letter-spacing: 0.12em; padding: 8px 20px; }

  /* NAV */
  .ex-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); border-bottom: 0.5px solid var(--ex-bone-border); }
  .ex-nav-inner { max-width: 1440px; margin: 0 auto; height: 72px; display: flex; align-items: center; padding: 0 2.5rem; gap: 0; }
  .ex-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; margin-right: 16px; }
  .ex-hamburger span { display: block; width: 20px; height: 1.5px; background: var(--ex-ink); border-radius: 1px; transition: all 0.2s; }
  .ex-nav-logo { display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; margin-right: 2.5rem; }
  .ex-logo-name { font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-ink); font-weight: 500; line-height: 1; }
  .ex-logo-tag { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); font-weight: 400; }
  .ex-nav-center { display: flex; align-items: center; gap: 0; flex: 1; }
  .ex-nav-link { font-size: 12px; letter-spacing: 0.06em; color: var(--ex-ink-soft); background: none; border: none; cursor: pointer; padding: 6px 14px; font-family: 'Inter', sans-serif; font-weight: 400; transition: color 0.15s; display: flex; align-items: center; gap: 6px; }
  .ex-nav-link:hover { color: var(--ex-ink); }
  .ex-nav-link-active { color: var(--ex-ink); font-weight: 500; }
  .ex-nav-link:disabled { cursor: default; opacity: 0.6; }
  .ex-nav-soon { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-white); background: var(--ex-sage); padding: 2px 6px; border-radius: 2px; font-weight: 500; }
  .ex-nav-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .ex-search-wrap { position: relative; }
  .ex-search-input { background: var(--ex-bone); border: 0.5px solid var(--ex-bone-border); border-radius: 2px; padding: 9px 14px 9px 34px; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--ex-ink); outline: none; width: 190px; transition: all 0.2s; }
  .ex-search-input::placeholder { color: var(--ex-ink-soft); }
  .ex-search-input:focus { border-color: var(--ex-sage-mist); background: var(--ex-white); width: 220px; }
  .ex-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ex-ink-soft); pointer-events: none; }
  .ex-search-clear { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--ex-ink-soft); cursor: pointer; padding: 2px; display: flex; transition: color 0.15s; }
  .ex-search-clear:hover { color: var(--ex-ink); }
  .ex-search-toggle { display: none; align-items: center; justify-content: center; width: 38px; height: 38px; border: 0.5px solid var(--ex-bone-border); border-radius: 2px; background: var(--ex-bone); color: var(--ex-ink-soft); cursor: pointer; transition: all 0.15s; }
  .ex-search-toggle:hover { background: var(--ex-bone-mid); color: var(--ex-ink); }
  .ex-mob-search { display: none; padding: 10px 1.5rem 14px; border-top: 0.5px solid var(--ex-bone-border); background: var(--ex-white); }
  .ex-mob-search.open { display: block; }
  .ex-mob-search input { width: 100%; background: var(--ex-bone); border: 0.5px solid var(--ex-bone-border); border-radius: 2px; padding: 11px 36px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ex-ink); outline: none; }
  .ex-mob-search input::placeholder { color: var(--ex-ink-soft); }
  .ex-mob-search input:focus { border-color: var(--ex-sage-mist); }
  .ex-mob-menu { background: var(--ex-white); border-top: 0.5px solid var(--ex-bone-border); padding: 0.8rem 1.5rem; display: flex; flex-direction: column; gap: 2px; }
  .ex-mob-menu-link { text-align: left; font-size: 13px; letter-spacing: 0.06em; color: var(--ex-ink-soft); background: none; border: none; cursor: pointer; padding: 10px 4px; font-family: 'Inter', sans-serif; border-bottom: 0.5px solid var(--ex-bone-border); }
  .ex-mob-menu-link:last-child { border-bottom: none; }
  .ex-mob-menu-link-active { color: var(--ex-ink); font-weight: 500; }
  .ex-mob-menu-link:disabled { cursor: default; opacity: 0.55; }

  /* HERO */
  .ex-hero { background: var(--ex-bone); border-bottom: 0.5px solid var(--ex-bone-border); }
  .ex-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; display: grid; grid-template-columns: 1fr 1fr; min-height: 340px; }
  .ex-hero-left { padding: 3.5rem 3rem 3.5rem 0; display: flex; flex-direction: column; justify-content: center; border-right: 0.5px solid var(--ex-bone-border); }
  .ex-hero-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-sage-mid); margin-bottom: 1.2rem; }
  .ex-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 38px); font-weight: 400; line-height: 1.18; color: var(--ex-ink); margin-bottom: 1rem; }
  .ex-hero-title em { font-style: italic; color: var(--ex-sage); }
  .ex-hero-body { font-size: 13px; color: var(--ex-ink-soft); line-height: 1.8; max-width: 300px; margin-bottom: 1.6rem; }
  .ex-hero-stats { display: flex; align-items: center; gap: 0; margin-bottom: 1.8rem; }
  .ex-hero-stat { display: flex; flex-direction: column; gap: 2px; padding-right: 1.5rem; }
  .ex-hero-stat-div { width: 0.5px; height: 28px; background: var(--ex-bone-border); margin-right: 1.5rem; }
  .ex-stat-num { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--ex-ink); line-height: 1; }
  .ex-stat-lbl { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ex-ink-soft); }
  .ex-hero-btns { display: flex; align-items: center; gap: 10px; }
  .ex-btn-primary { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ex-white); background: var(--ex-sage); border: none; padding: 12px 24px; cursor: pointer; font-weight: 500; border-radius: 2px; font-family: 'Inter', sans-serif; transition: background 0.2s; }
  .ex-btn-primary:hover { background: var(--ex-sage-mid); }
  .ex-btn-ghost { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-mid); background: transparent; border: 0.5px solid var(--ex-bone-border); padding: 12px 20px; cursor: pointer; border-radius: 2px; font-family: 'Inter', sans-serif; transition: border-color 0.2s, color 0.2s; }
  .ex-btn-ghost:hover { border-color: var(--ex-ink-soft); color: var(--ex-ink); }
  .ex-hero-right { display: flex; align-items: center; justify-content: center; position: relative; padding: 2rem 0 2rem 3rem; }
  .ex-hero-badge-top { position: absolute; top: 1.4rem; right: 1rem; background: var(--ex-white); border: 0.5px solid var(--ex-bone-border); border-radius: 8px; padding: 8px 14px; text-align: center; }
  .ex-badge-num { display: block; font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ex-sage); line-height: 1; }
  .ex-badge-lbl { display: block; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); margin-top: 2px; }
  .ex-hero-device-outer { width: 84px; height: 196px; border: 0.5px solid var(--ex-sage-mist); border-radius: 26px; background: var(--ex-bone); display: flex; align-items: center; justify-content: center; }
  .ex-hero-device-inner { width: 60px; height: 164px; border-radius: 20px; background: var(--ex-bone-mid); border: 0.5px solid var(--ex-bone-border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .ex-device-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ex-sage-mid); }
  .ex-device-bar { width: 36px; height: 2.5px; border-radius: 2px; background: var(--ex-bone-border); }
  .ex-device-bar-sm { width: 24px; }
  .ex-hero-badge-bottom { position: absolute; bottom: 1.4rem; left: 1.5rem; background: var(--ex-sage); border-radius: 8px; padding: 7px 12px; font-size: 10px; color: rgba(255,255,255,0.85); letter-spacing: 0.07em; display: flex; align-items: center; gap: 6px; }

  /* TRUST BAR */
  .ex-trust { display: flex; background: var(--ex-sage); border-bottom: 0.5px solid rgba(0,0,0,0.06); }
  .ex-trust-item { flex: 1; padding: 0.9rem 1rem; border-right: 0.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; letter-spacing: 0.07em; color: rgba(255,255,255,0.75); }
  .ex-trust-item:last-child { border-right: none; }
  .ex-trust-icon { color: rgba(255,255,255,0.55); flex-shrink: 0; }

  /* CATALOG */
  .ex-catalog { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem 4rem; }
  .ex-catalog-header { display: flex; align-items: flex-end; justify-content: space-between; padding: 2rem 0 1.4rem; border-bottom: 0.5px solid var(--ex-bone-border); margin-bottom: 2rem; }
  .ex-catalog-label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ex-ink-soft); margin-bottom: 4px; }
  .ex-catalog-count { font-size: 12px; color: var(--ex-ink-soft); }
  .ex-catalog-count strong { color: var(--ex-ink-mid); font-weight: 500; }
  .ex-catalog-link { font-size: 11px; color: var(--ex-sage); letter-spacing: 0.08em; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: gap 0.2s; }
  .ex-catalog-link:hover { gap: 8px; }

  /* GRID */
  .ex-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--ex-bone-border); border: 0.5px solid var(--ex-bone-border); }

  /* PRODUCT CARD */
  .ex-pc { display: flex; flex-direction: column; background: var(--ex-white); cursor: pointer; outline: none; user-select: none; text-align: left; position: relative; transition: background 0.2s; animation: exCardIn 0.45s ease both; overflow: hidden; }
  .ex-pc:hover { background: var(--ex-bone); }
  .ex-pc:focus-visible { outline: 2px solid var(--ex-sage); outline-offset: -2px; }
  @keyframes exCardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .ex-pc-img-wrap { position: relative; padding-bottom: 92%; overflow: hidden; background: var(--ex-bone-mid); flex-shrink: 0; }
  .ex-pc-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.65s cubic-bezier(.25,.8,.25,1); }
  .ex-pc-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 38px; color: var(--ex-sage-mist); background: var(--ex-bone-mid); }
  .ex-pc-overlay { position: absolute; inset: 0; background: rgba(44,48,40,0.18); transition: opacity 0.3s; pointer-events: none; }
  .ex-pc-cta-wrap { position: absolute; bottom: 14px; left: 0; right: 0; display: flex; justify-content: center; transition: all 0.25s cubic-bezier(.25,.8,.25,1); z-index: 3; }
  .ex-pc-cta { font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ex-ink); background: var(--ex-white); padding: 9px 20px; border-radius: 2px; }
  .ex-pc-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background: rgba(255,255,255,0.9); border: none; color: var(--ex-ink); font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: background 0.15s; line-height: 1; padding: 0; border-radius: 2px; }
  .ex-pc-arr:hover { background: var(--ex-white); }
  .ex-pc-arr-l { left: 8px; }
  .ex-pc-arr-r { right: 8px; }
  .ex-pc-dots { position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 5; }
  .ex-pc-dot { height: 4px; border-radius: 0; border: none; padding: 0; cursor: pointer; transition: all 0.22s; }
  .ex-pc-badges { position: absolute; top: 10px; left: 10px; right: 10px; display: flex; justify-content: space-between; align-items: flex-start; z-index: 5; pointer-events: none; }
  .ex-pc-badge-cat { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ex-ink-mid); background: rgba(247,245,240,0.9); padding: 3px 8px; border-radius: 2px; }
  .ex-pc-badge-low { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; background: var(--ex-gold); color: var(--ex-white); border-radius: 2px; }
  .ex-pc-badge-out { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; background: rgba(247,245,240,0.9); color: var(--ex-ink-soft); border-radius: 2px; }
  .ex-pc-info { padding: 1.4rem 1.5rem 1.6rem; display: flex; flex-direction: column; gap: 6px; border-top: 0.5px solid var(--ex-bone-border); }
  .ex-pc-name { font-size: 14px; font-weight: 500; color: var(--ex-ink); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-sub { font-size: 11px; color: var(--ex-ink-soft); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .ex-pc-price-wrap { display: flex; flex-direction: column; gap: 3px; }
  .ex-pc-price { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--ex-ink); letter-spacing: 0.01em; line-height: 1; }
  .ex-pc-price-na { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); }
  .ex-pc-avail { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--ex-ink-soft); letter-spacing: 0.05em; }
  .ex-pc-avail-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .ex-pc-add { width: 32px; height: 32px; background: var(--ex-bone); border: 0.5px solid var(--ex-bone-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--ex-sage); flex-shrink: 0; transition: background 0.15s, border-color 0.15s; }
  .ex-pc:hover .ex-pc-add { background: var(--ex-sage); border-color: var(--ex-sage); color: var(--ex-white); }

  /* SKELETON */
  .ex-sk { background: var(--ex-white); display: flex; flex-direction: column; animation: exCardIn 0.4s ease both; overflow: hidden; }
  .ex-sk-img { padding-bottom: 92%; width: 100%; }
  .ex-sk-body { padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 10px; }
  .ex-sk-line { height: 12px; border-radius: 2px; }
  .ex-sk-lg { width: 68%; }
  .ex-sk-sm { width: 42%; }
  .ex-sk-xs { width: 28%; }
  .shimmer-ex { background: linear-gradient(90deg, var(--ex-bone) 0%, var(--ex-bone-mid) 50%, var(--ex-bone) 100%); background-size: 200% 100%; animation: shimmerEx 1.7s ease infinite; }
  @keyframes shimmerEx { to { background-position: -200% 0; } }

  /* EMPTY */
  .ex-empty { grid-column: 1 / -1; padding: 5rem 24px; text-align: center; border: 0.5px dashed var(--ex-bone-border); background: var(--ex-bone); }
  .ex-empty-sym { font-family: 'Playfair Display', serif; font-size: 44px; color: var(--ex-bone-border); display: block; margin-bottom: 12px; }
  .ex-empty-text { font-size: 13px; font-weight: 400; color: var(--ex-ink-soft); }

  /* FOOTER */
  .ex-footer { border-top: 0.5px solid var(--ex-bone-border); background: var(--ex-white); }
  .ex-footer-inner { max-width: 1200px; margin: 0 auto; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; }
  .ex-footer-left { display: flex; align-items: center; gap: 16px; }
  .ex-footer-logo { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-ink-soft); font-weight: 500; }
  .ex-footer-copy { font-size: 11px; color: var(--ex-bone-border); }
  .ex-footer-right { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ex-ink-soft); }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .ex-grid { grid-template-columns: repeat(2, 1fr); }
    .ex-hero-inner { grid-template-columns: 1fr; min-height: auto; }
    .ex-hero-left { padding: 2.5rem 0 2rem; border-right: none; border-bottom: 0.5px solid var(--ex-bone-border); }
    .ex-hero-right { display: none; }
    .ex-hero-body { max-width: 100%; }
  }
  @media (max-width: 768px) {
    .ex-topbar { display: none; }
    .ex-nav-center { display: none; }
    .ex-search-wrap { display: none; }
    .ex-search-toggle { display: flex; }
    .ex-hamburger { display: flex; }
    .ex-nav-inner { padding: 0 1.5rem; }
    .ex-hero-inner { padding: 0 1.5rem; }
    .ex-catalog { padding: 0 1.5rem 3rem; }
    .ex-trust { flex-wrap: wrap; }
    .ex-trust-item { flex: 1 1 48%; border-bottom: 0.5px solid rgba(255,255,255,0.1); }
    .ex-trust-item:nth-child(2n) { border-right: none; }
    .ex-footer-inner { padding: 1rem 1.5rem; flex-direction: column; align-items: flex-start; gap: 8px; }
  }
  @media (max-width: 480px) {
    .ex-grid { grid-template-columns: repeat(2, 1fr); }
    .ex-hero-title { font-size: 26px; }
    .ex-catalog-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`
