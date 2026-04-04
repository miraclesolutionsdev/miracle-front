import { useState, useEffect, useMemo, useRef } from 'react'
import { productosApi, getProductoImagenSrc } from '../utils/api'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`

function getInitials(name = '') {
  return String(name).trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'MS'
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-img shimmer" />
      <div className="sk-body">
        <div className="sk-line sk-line-lg shimmer" />
        <div className="sk-line sk-line-sm shimmer" />
      </div>
    </div>
  )
}

/* ── Product card ── */
function ProductCard({ p, index }) {
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
  const ir = () => window.open(`${window.location.origin}/landing-producto/${p.id}`, '_blank', 'noopener,noreferrer')

  return (
    <article
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={ir}
      onKeyDown={(e) => e.key === 'Enter' && ir()}
      className="pc"
      style={{
        animationDelay: `${Math.min(index * 70, 500)}ms`,
        opacity: sinStock ? 0.6 : 1,
      }}
    >
      {/* Image */}
      <div className="pc-img-wrap" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img
            src={src}
            alt={p.nombre || 'Producto'}
            className="pc-img"
            style={{ transform: hov ? 'scale(1.07)' : 'scale(1)' }}
          />
        ) : (
          <div className="pc-placeholder">{getInitials(p.nombre)}</div>
        )}

        <div className="pc-overlay" style={{ opacity: hov ? 1 : 0 }} />

        <div
          className="pc-cta-wrap"
          style={{
            transform: hov ? 'translateY(0)' : 'translateY(14px)',
            opacity: hov ? 1 : 0,
          }}
        >
          <span className="pc-cta">Ver producto</span>
        </div>

        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="pc-arr pc-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="pc-arr pc-arr-r" aria-label="Siguiente">›</button>
          </>
        )}

        {total > 1 && (
          <div className="pc-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                className="pc-dot"
                style={{
                  width: i === imgIdx ? 18 : 5,
                  background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.45)',
                }}
              />
            ))}
          </div>
        )}

        <div className="pc-badges">
          <span className="pc-badge-cat">{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {stockBajo && !sinStock && <span className="pc-badge-low">Últimas {p.stock}</span>}
            {sinStock && <span className="pc-badge-out">Agotado</span>}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pc-info">
        <p className="pc-name">{p.nombre || 'Sin nombre'}</p>
        <div className="pc-meta">
          {p.precio != null ? (
            <span className="pc-price">{fmt(p.precio)}</span>
          ) : (
            <span className="pc-price-na">Consultar</span>
          )}
          {isProducto && !sinStock && (
            <span className="pc-avail">
              <span className="pc-avail-dot" style={{ background: stockBajo ? '#E09020' : '#22C55E' }} />
              {stockBajo ? `${p.stock} disponibles` : 'En stock'}
            </span>
          )}
          {sinStock && (
            <span className="pc-avail" style={{ color: '#BDBDBD' }}>
              <span className="pc-avail-dot" style={{ background: '#D0CBC4' }} />
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="pc-accent-line" style={{ transform: hov ? 'scaleX(1)' : 'scaleX(0)' }} />
    </article>
  )
}

/* ── Main store ── */
export default function MiracleStore() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    productosApi
      .listar({ estado: 'activo' })
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (searchOpen) mobileInputRef.current?.focus()
  }, [searchOpen])

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => p.tipo === 'producto')
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      )
    }
    return lista
  }, [productos, busqueda])

  const totalProductos = productos.filter((p) => p.tipo === 'producto').length
  const enStock = productos.filter((p) => p.tipo === 'producto' && p.stock > 0).length

  return (
    <>
      <style>{CSS_STORE}</style>

      <div className="ms-root">
        {/* ── TOPBAR ── */}
        <div className="ms-topbar">
          <span>Envíos disponibles&nbsp;&nbsp;·&nbsp;&nbsp;Calidad garantizada&nbsp;&nbsp;·&nbsp;&nbsp;Compra segura</span>
        </div>

        {/* ── NAV ── */}
        <nav className="ms-nav">
          <div className="ms-nav-inner">

            {/* Logo zone */}
            <div className="ms-logo-zone">
              <img
                src="https://miracle-store.s3.us-east-2.amazonaws.com/logo/logo+miracle.png"
                alt="Miracle"
                className="ms-logo-img"
              />
              <div className="ms-logo-text">
                <span className="ms-logo-name">MIRACLE</span>
                <span className="ms-logo-tag">Store oficial</span>
              </div>
            </div>

            {/* Nav center: simple text links */}
            <div className="ms-nav-links">
              <button type="button" className="ms-nav-link on">
                Colección
              </button>
              <button type="button" className="ms-nav-link ms-nav-link-new" disabled>
                Novedades
                <span className="ms-nav-soon">Pronto</span>
              </button>
            </div>

            {/* Right: search */}
            <div className="ms-nav-right">
              <div className="ms-search-wrap">
                <svg className="ms-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="ms-search-input"
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button type="button" className="ms-search-clear" onClick={() => setBusqueda('')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="button"
                className="ms-search-toggle"
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Buscar"
              >
                {searchOpen ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className={`ms-mobile-search${searchOpen ? ' open' : ''}`}>
            <div className="ms-mobile-search-rel">
              <svg className="ms-mob-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button type="button" className="ms-mob-search-clear" onClick={() => setBusqueda('')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="ms-hero">
          <div className="ms-hero-inner">
            <div className="ms-hero-left">
              <span className="ms-hero-sup">Tienda Oficial</span>
              <h1 className="ms-hero-title">
                Miracle <em>Store</em>
              </h1>
              <p className="ms-hero-sub">
                Diseñado para quienes no negocian ni comodidad ni estilo.
              </p>
            </div>
            {!loading && (
              <div className="ms-hero-stats">
                <div className="ms-stat">
                  <span className="ms-stat-num">{totalProductos}</span>
                  <span className="ms-stat-lbl">Productos</span>
                </div>
                <div className="ms-stat">
                  <span className="ms-stat-num">{enStock}</span>
                  <span className="ms-stat-lbl">En stock</span>
                </div>
              </div>
            )}
          </div>
          <div className="ms-hero-strip" />
        </section>

        {/* ── CATALOG ── */}
        <main className="ms-catalog">
          <div className="ms-catalog-bar">
            <p className="ms-count">
              <strong>{loading ? '—' : productosFiltrados.length}</strong>
              {' '}{productosFiltrados.length === 1 ? 'resultado' : 'resultados'}
              {busqueda && <> para &ldquo;{busqueda}&rdquo;</>}
            </p>
          </div>

          <div className="ms-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="ms-empty">
                <span className="ms-empty-symbol">—</span>
                <p className="ms-empty-text">
                  {busqueda ? `Sin resultados para "${busqueda}"` : 'Sin productos disponibles.'}
                </p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))
            )}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="ms-footer">
          <div className="ms-footer-inner">
            <img
              src="https://miracle-store.s3.us-east-2.amazonaws.com/logo/logo+miracle.png"
              alt="Miracle"
              className="ms-logo-img"
              style={{ opacity: 0.55, height: 36 }}
            />
            <p className="ms-footer-copy">© {new Date().getFullYear()} Miracle Solutions · Todos los derechos reservados</p>
            <span className="ms-footer-tag">Tienda Oficial</span>
          </div>
        </footer>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const CSS_STORE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ─── ROOT ─── */
  .ms-root {
    min-height: 100vh;
    background: #F8F5F1;
    color: #0D0D0D;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ─── TOPBAR ─── */
  .ms-topbar {
    background: #0D0D0D;
    color: rgba(255,255,255,0.55);
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.14em;
    padding: 8px 20px;
  }

  /* ─── NAV ─── */
  .ms-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(248,245,241,0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid #E8E4DF;
    box-shadow: 0 1px 0 #E8E4DF;
  }
  .ms-nav-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 0 0 0;
    height: 78px;
    display: flex;
    align-items: stretch;
    gap: 0;
  }

  /* Logo zone */
  .ms-logo-zone {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 32px 0 28px;
    border-left: 4px solid #C8352B;
    border-right: 1px solid #E8E4DF;
    margin-right: 16px;
    flex-shrink: 0;
  }
  .ms-logo-img {
    height: 62px;
    width: 62px;
    object-fit: cover;
    display: block;
    border-radius: 50%;
    border: 2px solid #E8E4DF;
  }
  .ms-logo-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .ms-logo-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.1em;
    color: #0D0D0D;
    line-height: 1;
  }
  .ms-logo-tag {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #C8352B;
  }

  /* Nav center: text links */
  .ms-nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    padding: 0 32px;
  }
  .ms-nav-link {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 6px 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: #8A8480;
    transition: color 0.18s ease;
    position: relative;
    white-space: nowrap;
  }
  .ms-nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 14px;
    right: 14px;
    height: 2px;
    background: #C8352B;
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  .ms-nav-link.on { color: #0D0D0D; font-weight: 600; }
  .ms-nav-link.on::after { transform: scaleX(1); }
  .ms-nav-link:not(.on):hover { color: #0D0D0D; }
  .ms-nav-link-new { opacity: 0.5; cursor: default; }
  .ms-nav-soon {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    background: #C8352B;
    padding: 2px 6px;
    margin-left: 6px;
    vertical-align: middle;
  }

  .ms-nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    padding: 0 32px;
  }
  .ms-search-wrap { position: relative; }
  .ms-search-input {
    background: #fff;
    border: 1.5px solid #E8E4DF;
    border-radius: 100px;
    padding: 9px 16px 9px 38px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #0D0D0D;
    outline: none;
    width: 195px;
    transition: all 0.22s ease;
  }
  .ms-search-input::placeholder { color: #C0BAB3; }
  .ms-search-input:focus {
    border-color: #C8352B;
    width: 235px;
  }
  .ms-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #C0BAB3;
    pointer-events: none;
  }
  .ms-search-clear {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #C0BAB3;
    cursor: pointer;
    padding: 2px;
    display: flex;
    transition: color 0.15s;
  }
  .ms-search-clear:hover { color: #0D0D0D; }
  .ms-search-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1.5px solid #E8E4DF;
    border-radius: 100px;
    background: #fff;
    color: #757575;
    cursor: pointer;
    transition: all 0.18s;
  }
  .ms-search-toggle:hover {
    background: #F0EDE9;
    color: #0D0D0D;
    border-color: #D0CBC4;
  }
  .ms-mobile-search {
    display: none;
    padding: 12px 20px 16px;
    border-top: 1px solid #E8E4DF;
    animation: fadeDown 0.18s ease;
  }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .ms-mobile-search.open { display: block; }
  .ms-mobile-search-rel { position: relative; }
  .ms-mobile-search input {
    width: 100%;
    background: #fff;
    border: 1.5px solid #E8E4DF;
    border-radius: 100px;
    padding: 12px 38px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #0D0D0D;
    outline: none;
    transition: border-color 0.18s;
  }
  .ms-mobile-search input::placeholder { color: #C0BAB3; }
  .ms-mobile-search input:focus { border-color: #C8352B; }
  .ms-mob-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #C0BAB3; pointer-events: none; }
  .ms-mob-search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #C0BAB3; cursor: pointer; display: flex; padding: 2px; }

  /* ─── HERO ─── */
  .ms-hero {
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 40px 0;
    position: relative;
  }
  .ms-hero-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    padding-bottom: 22px;
    border-bottom: 2.5px solid #0D0D0D;
  }
  .ms-hero-sup {
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #C8352B;
    margin-bottom: 6px;
    display: block;
  }
  .ms-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 400;
    letter-spacing: 0.03em;
    line-height: 1;
    color: #0D0D0D;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ms-hero-title em {
    font-style: normal;
    color: #C8352B;
  }
  .ms-hero-sub {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 300;
    color: #8A8480;
    max-width: 420px;
    line-height: 1.6;
  }
  .ms-hero-stats {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    align-items: center;
  }
  .ms-stat {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    border-left: 1px solid #E8E4DF;
  }
  .ms-stat:first-child { border-left: none; padding-left: 0; }
  .ms-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    font-weight: 400;
    color: #0D0D0D;
    line-height: 1;
    letter-spacing: 0.03em;
  }
  .ms-stat-lbl {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #C0BAB3;
    text-align: right;
  }
  .ms-hero-strip {
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: #C8352B;
  }

  /* ─── CATALOG ─── */
  .ms-catalog {
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 40px 80px;
  }
  .ms-catalog-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #E8E4DF;
  }
  .ms-count {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.03em;
    color: #C0BAB3;
  }
  .ms-count strong { color: #8A8480; font-weight: 600; }

  .ms-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  /* ─── PRODUCT CARD ─── */
  .pc {
    display: flex;
    flex-direction: column;
    background: #fff;
    cursor: pointer;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
    text-align: left;
    position: relative;
    border: 1px solid #E8E4DF;
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
    animation: cardIn 0.5s ease both;
    overflow: hidden;
  }
  .pc:hover {
    border-color: #C8352B;
    box-shadow: 0 16px 48px rgba(0,0,0,0.09);
    transform: translateY(-4px);
  }
  .pc:focus-visible {
    outline: 2px solid #C8352B;
    outline-offset: 2px;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .pc-accent-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #C8352B;
    transform-origin: left;
    transition: transform 0.28s ease;
  }
  .pc-img-wrap {
    position: relative;
    padding-bottom: 125%;
    overflow: hidden;
    background: #F0EDE9;
    flex-shrink: 0;
  }
  .pc-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(.25,.8,.25,1);
  }
  .pc-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 44px;
    letter-spacing: 0.05em;
    color: rgba(13,13,13,0.1);
    background: #F0EDE9;
  }
  .pc-overlay {
    position: absolute;
    inset: 0;
    background: rgba(13,13,13,0.28);
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .pc-cta-wrap {
    position: absolute;
    bottom: 18px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    transition: all 0.28s cubic-bezier(.25,.8,.25,1);
    z-index: 3;
  }
  .pc-cta {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #0D0D0D;
    background: #fff;
    padding: 10px 24px;
    border: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  .pc-arr {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(8px);
    border: none;
    color: #0D0D0D;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    transition: background 0.15s;
    line-height: 1;
    padding: 0;
  }
  .pc-arr:hover { background: #fff; }
  .pc-arr-l { left: 8px; }
  .pc-arr-r { right: 8px; }
  .pc-dots {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    z-index: 5;
  }
  .pc-dot {
    height: 4px;
    border-radius: 0;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .pc-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 5;
    pointer-events: none;
  }
  .pc-badge-cat {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #0D0D0D;
    background: #fff;
    padding: 4px 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .pc-badge-low {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    background: #C8352B;
    color: #fff;
  }
  .pc-badge-out {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    background: rgba(255,255,255,0.88);
    color: #8A8480;
  }
  .pc-info {
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    border-top: 1px solid #F0EDE9;
  }
  .pc-name {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #0D0D0D;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pc-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .pc-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: #C8352B;
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .pc-price-na {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #C0BAB3;
  }
  .pc-avail {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: #C0BAB3;
    white-space: nowrap;
  }
  .pc-avail-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ─── SKELETON ─── */
  .sk-card {
    background: #fff;
    border: 1px solid #E8E4DF;
    display: flex;
    flex-direction: column;
    animation: cardIn 0.4s ease both;
    overflow: hidden;
  }
  .sk-img { padding-bottom: 125%; width: 100%; }
  .sk-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
  .sk-line { height: 14px; border-radius: 3px; }
  .sk-line-lg { width: 72%; }
  .sk-line-sm { width: 44%; }
  .shimmer {
    background: linear-gradient(90deg, #F0EDE9 0%, #E5E0DA 50%, #F0EDE9 100%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease infinite;
  }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* ─── EMPTY ─── */
  .ms-empty {
    grid-column: 1 / -1;
    padding: 80px 24px;
    text-align: center;
    border: 1px dashed #E8E4DF;
    background: #fff;
  }
  .ms-empty-symbol {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: #E8E4DF;
    display: block;
    margin-bottom: 14px;
    letter-spacing: 0.1em;
  }
  .ms-empty-text {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: #C0BAB3;
  }

  /* ─── FOOTER ─── */
  .ms-footer {
    border-top: 1px solid #0D0D0D;
    background: #0D0D0D;
  }
  .ms-footer-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 26px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ms-footer-copy {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.28);
  }
  .ms-footer-tag {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #C8352B;
    border: 1px solid rgba(200,53,43,0.45);
    padding: 5px 14px;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 1280px) { .ms-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 960px) {
    .ms-topbar { display: none; }
    .ms-nav-links { display: none; }
    .ms-search-wrap { display: none; }
    .ms-search-toggle { display: flex; }
    .ms-logo-zone { padding: 0 16px 0 14px; }
    .ms-logo-text { display: none; }
    .ms-nav-right { padding: 0 16px; margin-left: auto; }
    .ms-hero { padding: 16px 20px 0; }
    .ms-catalog { padding: 16px 20px 64px; }
    .ms-hero-inner { flex-direction: column; align-items: flex-start; gap: 14px; padding-bottom: 16px; }
    .ms-hero-stats { width: 100%; justify-content: flex-start; }
    .ms-stat { align-items: flex-start; padding: 0 20px 0 0; }
    .ms-stat:first-child { padding-left: 0; }
    .ms-stat-lbl { text-align: left; }
    .ms-footer-inner { padding: 20px 20px; }
    .ms-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ms-catalog-bar { display: none; }
    .ms-mobile-search { background: #F8F5F1; }
  }
  @media (max-width: 480px) {
    .ms-hero-title { font-size: 40px; }
    .ms-stat-num { font-size: 30px; }
    .ms-grid { gap: 10px; }
    .ms-logo-img { height: 40px; }
  }
`
