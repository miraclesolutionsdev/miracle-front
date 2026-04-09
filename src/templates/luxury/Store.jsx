import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="lx-sk">
      <div className="lx-sk-img shimmer" />
      <div className="lx-sk-body">
        <div className="lx-sk-line lx-sk-lg shimmer" />
        <div className="lx-sk-line lx-sk-sm shimmer" />
      </div>
    </div>
  )
}

/* ── Product card ── */
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
      className="lx-pc"
      style={{ animationDelay: `${Math.min(index * 70, 500)}ms`, opacity: sinStock ? 0.6 : 1 }}
    >
      <div className="lx-pc-img-wrap" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre || 'Producto'} className="lx-pc-img" style={{ transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
        ) : (
          <div className="lx-pc-placeholder">{getInitials(p.nombre)}</div>
        )}
        <div className="lx-pc-overlay" style={{ opacity: hov ? 1 : 0 }} />
        <div className="lx-pc-cta-wrap" style={{ transform: hov ? 'translateY(0)' : 'translateY(14px)', opacity: hov ? 1 : 0 }}>
          <span className="lx-pc-cta">Ver producto</span>
        </div>
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="lx-pc-arr lx-pc-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="lx-pc-arr lx-pc-arr-r" aria-label="Siguiente">›</button>
          </>
        )}
        {total > 1 && (
          <div className="lx-pc-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setImgIdx(i) }} className="lx-pc-dot"
                style={{ width: i === imgIdx ? 18 : 5, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.45)' }} />
            ))}
          </div>
        )}
        <div className="lx-pc-badges">
          <span className="lx-pc-badge-cat">{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {stockBajo && !sinStock && <span className="lx-pc-badge-low">Últimas {p.stock}</span>}
            {sinStock && <span className="lx-pc-badge-out">Agotado</span>}
          </div>
        </div>
      </div>
      <div className="lx-pc-info">
        <p className="lx-pc-name">{p.nombre || 'Sin nombre'}</p>
        <div className="lx-pc-meta">
          {p.precio != null ? <span className="lx-pc-price">{fmt(p.precio)}</span> : <span className="lx-pc-price-na">Consultar</span>}
          {isProducto && !sinStock && (
            <span className="lx-pc-avail">
              <span className="lx-pc-avail-dot" style={{ background: stockBajo ? '#E09020' : '#22C55E' }} />
              {stockBajo ? `${p.stock} disponibles` : 'En stock'}
            </span>
          )}
          {sinStock && (
            <span className="lx-pc-avail" style={{ color: '#BDBDBD' }}>
              <span className="lx-pc-avail-dot" style={{ background: '#D0CBC4' }} />
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="lx-pc-accent" style={{ transform: hov ? 'scaleX(1)' : 'scaleX(0)' }} />
    </article>
  )
}

/* ── Main Store ── */
export default function LuxuryStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    totalProductos, enStock,
  } = useStoreData(slugProp)

  return (
    <>
      <style>{CSS}</style>
      <div className="lx-root">
        {/* TOPBAR */}
        <div className="lx-topbar">
          <span>Envios disponibles&nbsp;&nbsp;·&nbsp;&nbsp;Calidad garantizada&nbsp;&nbsp;·&nbsp;&nbsp;Compra segura</span>
        </div>

        {/* NAV */}
        <nav className="lx-nav">
          <div className="lx-nav-inner">
            <div className="lx-logo-zone">
              <div className="lx-logo-text">
                <span className="lx-logo-name">{tenantNombre || 'STORE'}</span>
                <span className="lx-logo-tag">Store oficial</span>
              </div>
            </div>
            <div className="lx-nav-links">
              <button type="button" className="lx-nav-link on">Colección</button>
              <button type="button" className="lx-nav-link lx-nav-link-new" disabled>
                Novedades <span className="lx-nav-soon">Pronto</span>
              </button>
            </div>
            <div className="lx-nav-right">
              <div className="lx-search-wrap">
                <svg className="lx-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input type="text" className="lx-search-input" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                {busqueda && (
                  <button type="button" className="lx-search-clear" onClick={() => setBusqueda('')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <button type="button" className="lx-search-toggle" onClick={() => setSearchOpen((s) => !s)} aria-label="Buscar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {searchOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>}
                </svg>
              </button>
            </div>
          </div>
          <div className={`lx-mob-search${searchOpen ? ' open' : ''}`}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#C0BAB3', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input ref={mobileInputRef} type="text" placeholder="Buscar productos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {busqueda && (
                <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#C0BAB3', cursor: 'pointer', display: 'flex', padding: 2 }} onClick={() => setBusqueda('')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="lx-hero">
          <div className="lx-hero-inner">
            <div>
              <span className="lx-hero-sup">Tienda Oficial</span>
              <h1 className="lx-hero-title">{tenantNombre || 'Store'} <em>Collection</em></h1>
              <p className="lx-hero-sub">Diseñado para quienes no negocian ni comodidad ni estilo.</p>
            </div>
            {!loading && (
              <div className="lx-hero-stats">
                <div className="lx-stat"><span className="lx-stat-num">{totalProductos}</span><span className="lx-stat-lbl">Productos</span></div>
                <div className="lx-stat"><span className="lx-stat-num">{enStock}</span><span className="lx-stat-lbl">En stock</span></div>
              </div>
            )}
          </div>
          <div className="lx-hero-strip" />
        </section>

        {/* CATALOG */}
        <main className="lx-catalog">
          <div className="lx-catalog-bar">
            <p className="lx-count">
              <strong>{loading ? '—' : productosFiltrados.length}</strong>
              {' '}{productosFiltrados.length === 1 ? 'resultado' : 'resultados'}
              {busqueda && <> para &ldquo;{busqueda}&rdquo;</>}
            </p>
          </div>
          <div className="lx-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="lx-empty">
                <span className="lx-empty-sym">—</span>
                <p className="lx-empty-text">{busqueda ? `Sin resultados para "${busqueda}"` : 'Sin productos disponibles.'}</p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="lx-footer">
          <div className="lx-footer-inner">
            <p className="lx-footer-copy">© {new Date().getFullYear()} {tenantNombre || 'Store'} · Todos los derechos reservados</p>
            <span className="lx-footer-tag">Tienda Oficial</span>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lx-root { min-height: 100vh; background: #FFFFFF; color: #0D0D0D; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* TOPBAR */
  .lx-topbar { background: #0D0D0D; color: rgba(255,255,255,0.55); text-align: center; font-size: 11px; font-weight: 400; letter-spacing: 0.14em; padding: 8px 20px; }

  /* NAV */
  .lx-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); border-bottom: 1px solid #E8E4DF; }
  .lx-nav-inner { max-width: 1440px; margin: 0 auto; height: 78px; display: flex; align-items: stretch; }
  .lx-logo-zone { display: flex; align-items: center; gap: 14px; padding: 0 32px; border-left: 4px solid #C8352B; border-right: 1px solid #E8E4DF; margin-right: 16px; flex-shrink: 0; }
  .lx-logo-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; color: #0D0D0D; line-height: 1; }
  .lx-logo-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #C8352B; }
  .lx-logo-text { display: flex; flex-direction: column; gap: 1px; }
  .lx-nav-links { display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; padding: 0 32px; }
  .lx-nav-link { font-size: 13px; font-weight: 500; letter-spacing: 0.04em; padding: 6px 14px; background: none; border: none; cursor: pointer; color: #8A8480; transition: color 0.18s; position: relative; white-space: nowrap; font-family: 'Outfit', sans-serif; }
  .lx-nav-link::after { content: ''; position: absolute; bottom: -2px; left: 14px; right: 14px; height: 2px; background: #C8352B; transform: scaleX(0); transition: transform 0.2s; }
  .lx-nav-link.on { color: #0D0D0D; font-weight: 600; }
  .lx-nav-link.on::after { transform: scaleX(1); }
  .lx-nav-link:not(.on):hover { color: #0D0D0D; }
  .lx-nav-link-new { opacity: 0.5; cursor: default; }
  .lx-nav-soon { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; background: #C8352B; padding: 2px 6px; margin-left: 6px; vertical-align: middle; }
  .lx-nav-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; padding: 0 32px; }
  .lx-search-wrap { position: relative; }
  .lx-search-input { background: #fff; border: 1.5px solid #E8E4DF; border-radius: 100px; padding: 9px 16px 9px 38px; font-family: 'Outfit', sans-serif; font-size: 13px; color: #0D0D0D; outline: none; width: 195px; transition: all 0.22s; }
  .lx-search-input::placeholder { color: #C0BAB3; }
  .lx-search-input:focus { border-color: #C8352B; width: 235px; }
  .lx-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #C0BAB3; pointer-events: none; }
  .lx-search-clear { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #C0BAB3; cursor: pointer; padding: 2px; display: flex; transition: color 0.15s; }
  .lx-search-clear:hover { color: #0D0D0D; }
  .lx-search-toggle { display: none; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1.5px solid #E8E4DF; border-radius: 100px; background: #fff; color: #757575; cursor: pointer; transition: all 0.18s; }
  .lx-search-toggle:hover { background: #F0EDE9; color: #0D0D0D; }
  .lx-mob-search { display: none; padding: 12px 20px 16px; border-top: 1px solid #E8E4DF; animation: lxFadeDown 0.18s ease; }
  @keyframes lxFadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .lx-mob-search.open { display: block; }
  .lx-mob-search input { width: 100%; background: #fff; border: 1.5px solid #E8E4DF; border-radius: 100px; padding: 12px 38px; font-family: 'Outfit', sans-serif; font-size: 14px; color: #0D0D0D; outline: none; transition: border-color 0.18s; }
  .lx-mob-search input::placeholder { color: #C0BAB3; }
  .lx-mob-search input:focus { border-color: #C8352B; }

  /* HERO */
  .lx-hero { max-width: 1440px; margin: 0 auto; padding: 32px 40px 0; position: relative; }
  .lx-hero-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; padding-bottom: 28px; border-bottom: 2.5px solid #0D0D0D; }
  .lx-hero-sup { font-size: 11px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #C8352B; margin-bottom: 8px; display: block; }
  .lx-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(40px, 5vw, 64px); font-weight: 400; letter-spacing: 0.01em; line-height: 1; color: #0D0D0D; }
  .lx-hero-title em { font-style: italic; color: #C8352B; }
  .lx-hero-sub { margin-top: 10px; font-size: 16px; font-weight: 400; color: #5A5550; max-width: 480px; line-height: 1.6; }
  .lx-hero-stats { display: flex; flex-shrink: 0; }
  .lx-stat { padding: 0 24px; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; border-left: 1px solid #E8E4DF; }
  .lx-stat:first-child { border-left: none; padding-left: 0; }
  .lx-stat-num { font-family: 'Playfair Display', serif; font-size: 36px; color: #0D0D0D; line-height: 1; }
  .lx-stat-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #C0BAB3; text-align: right; }
  .lx-hero-strip { position: absolute; top: 0; right: 0; width: 4px; height: 100%; background: #C8352B; }

  /* CATALOG */
  .lx-catalog { max-width: 1440px; margin: 0 auto; padding: 24px 40px 80px; }
  .lx-catalog-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #E8E4DF; }
  .lx-count { font-size: 12px; color: #C0BAB3; }
  .lx-count strong { color: #8A8480; font-weight: 600; }
  .lx-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  /* PRODUCT CARD */
  .lx-pc { display: flex; flex-direction: column; background: #F8F5F1; cursor: pointer; outline: none; user-select: none; text-align: left; position: relative; border: 1px solid #E8E4DF; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; animation: lxCardIn 0.5s ease both; overflow: hidden; }
  .lx-pc:hover { border-color: #C8352B; box-shadow: 0 16px 48px rgba(0,0,0,0.09); transform: translateY(-4px); }
  .lx-pc:focus-visible { outline: 2px solid #C8352B; outline-offset: 2px; }
  @keyframes lxCardIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .lx-pc-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #C8352B; transform-origin: left; transition: transform 0.28s; }
  .lx-pc-img-wrap { position: relative; padding-bottom: 125%; overflow: hidden; background: #F0EDE9; flex-shrink: 0; }
  .lx-pc-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(.25,.8,.25,1); }
  .lx-pc-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 44px; color: rgba(13,13,13,0.1); background: #F0EDE9; }
  .lx-pc-overlay { position: absolute; inset: 0; background: rgba(13,13,13,0.28); transition: opacity 0.3s; pointer-events: none; }
  .lx-pc-cta-wrap { position: absolute; bottom: 18px; left: 0; right: 0; display: flex; justify-content: center; transition: all 0.28s cubic-bezier(.25,.8,.25,1); z-index: 3; }
  .lx-pc-cta { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #0D0D0D; background: #fff; padding: 10px 24px; border: none; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
  .lx-pc-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border: none; color: #0D0D0D; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: background 0.15s; line-height: 1; padding: 0; }
  .lx-pc-arr:hover { background: #fff; }
  .lx-pc-arr-l { left: 8px; }
  .lx-pc-arr-r { right: 8px; }
  .lx-pc-dots { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 5; }
  .lx-pc-dot { height: 4px; border-radius: 0; border: none; padding: 0; cursor: pointer; transition: all 0.25s; }
  .lx-pc-badges { position: absolute; top: 10px; left: 10px; right: 10px; display: flex; justify-content: space-between; align-items: flex-start; z-index: 5; pointer-events: none; }
  .lx-pc-badge-cat { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0D0D0D; background: #fff; padding: 4px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .lx-pc-badge-low { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; background: #C8352B; color: #fff; }
  .lx-pc-badge-out { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; background: rgba(255,255,255,0.88); color: #8A8480; }
  .lx-pc-info { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 9px; border-top: 1px solid #F0EDE9; }
  .lx-pc-name { font-size: 14px; font-weight: 500; color: #0D0D0D; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .lx-pc-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .lx-pc-price { font-family: 'Playfair Display', serif; font-size: 24px; color: #C8352B; letter-spacing: 0.02em; line-height: 1; }
  .lx-pc-price-na { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #C0BAB3; }
  .lx-pc-avail { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #C0BAB3; white-space: nowrap; }
  .lx-pc-avail-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* SKELETON */
  .lx-sk { background: #F8F5F1; border: 1px solid #E8E4DF; display: flex; flex-direction: column; animation: lxCardIn 0.4s ease both; overflow: hidden; }
  .lx-sk-img { padding-bottom: 125%; width: 100%; }
  .lx-sk-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
  .lx-sk-line { height: 14px; border-radius: 3px; }
  .lx-sk-lg { width: 72%; }
  .lx-sk-sm { width: 44%; }
  .shimmer { background: linear-gradient(90deg, #F0EDE9 0%, #E5E0DA 50%, #F0EDE9 100%); background-size: 200% 100%; animation: shimmer 1.6s ease infinite; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* EMPTY */
  .lx-empty { grid-column: 1 / -1; padding: 80px 24px; text-align: center; border: 1px dashed #E8E4DF; background: #F8F5F1; }
  .lx-empty-sym { font-family: 'Playfair Display', serif; font-size: 52px; color: #E8E4DF; display: block; margin-bottom: 14px; }
  .lx-empty-text { font-size: 14px; font-weight: 300; color: #C0BAB3; }

  /* FOOTER */
  .lx-footer { border-top: 1px solid #0D0D0D; background: #0D0D0D; }
  .lx-footer-inner { max-width: 1440px; margin: 0 auto; padding: 26px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .lx-footer-copy { font-size: 11px; letter-spacing: 0.04em; color: rgba(255,255,255,0.28); }
  .lx-footer-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #C8352B; border: 1px solid rgba(200,53,43,0.45); padding: 5px 14px; }

  /* RESPONSIVE */
  @media (max-width: 1280px) { .lx-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 960px) {
    .lx-topbar { display: none; }
    .lx-nav-links { display: none; }
    .lx-search-wrap { display: none; }
    .lx-search-toggle { display: flex; }
    .lx-logo-zone { padding: 0 16px; }
    .lx-nav-right { padding: 0 16px; margin-left: auto; }
    .lx-hero { padding: 16px 20px 0; }
    .lx-catalog { padding: 16px 20px 64px; }
    .lx-hero-inner { flex-direction: column; align-items: flex-start; gap: 14px; padding-bottom: 16px; }
    .lx-hero-stats { width: 100%; justify-content: flex-start; }
    .lx-stat { align-items: flex-start; padding: 0 20px 0 0; }
    .lx-stat:first-child { padding-left: 0; }
    .lx-stat-lbl { text-align: left; }
    .lx-footer-inner { padding: 20px; }
    .lx-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .lx-catalog-bar { display: none; }
    .lx-mob-search { background: #fff; }
  }
  @media (max-width: 480px) {
    .lx-hero-title { font-size: 40px; }
    .lx-stat-num { font-size: 30px; }
    .lx-grid { gap: 10px; }
  }
`
