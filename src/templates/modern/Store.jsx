import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'
import MiniCart from '../../components/MiniCart'

function SkeletonCard() {
  return (
    <div className="md-sk">
      <div className="md-sk-img md-shimmer" />
      <div className="md-sk-body">
        <div className="md-sk-line md-sk-lg md-shimmer" />
        <div className="md-sk-line md-sk-sm md-shimmer" />
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
      className="md-card"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, opacity: sinStock ? 0.55 : 1 }}
    >
      <div className="md-card-img" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre} className="md-card-photo" style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <div className="md-card-no-img">{getInitials(p.nombre)}</div>
        )}

        {/* Quick view on hover */}
        <div className="md-card-quickview" style={{ opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(8px)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Vista rápida
        </div>

        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="md-arr md-arr-l" style={{ opacity: hov ? 1 : 0 }} aria-label="Anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" onClick={goNext} className="md-arr md-arr-r" style={{ opacity: hov ? 1 : 0 }} aria-label="Siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}

        {/* Badges */}
        <div className="md-badges">
          {stockBajo && !sinStock && <span className="md-badge md-badge-low">Últimas {p.stock} unidades</span>}
          {sinStock && <span className="md-badge md-badge-out">Agotado</span>}
        </div>
      </div>

      <div className="md-card-info">
        <p className="md-card-name">{p.nombre || 'Sin nombre'}</p>
        <div className="md-card-footer">
          {p.precio != null ? (
            <span className="md-card-price">{fmt(p.precio)}</span>
          ) : (
            <span className="md-card-consult">Consultar</span>
          )}
          {isProducto && !sinStock && (
            <span className="md-card-stock" style={{ color: stockBajo ? '#F59E0B' : '#10B981' }}>
              <span className="md-stock-dot" style={{ background: stockBajo ? '#F59E0B' : '#10B981' }} />
              {stockBajo ? 'Pocas unidades' : 'En stock'}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ModernStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    totalProductos, enStock,
  } = useStoreData(slugProp)

  return (
    <>
      <style>{CSS}</style>
      <div className="md-root">
        {/* TOPBAR */}
        <div className="md-topbar">
          <span>Envío disponible · Compra segura · Calidad garantizada</span>
        </div>

        {/* NAV */}
        <nav className="md-nav">
          <MiniCart position="header" />
          <div className="md-nav-inner">
            <div className="md-logo">
              <span className="md-logo-name">{tenantNombre || 'Store'}</span>
            </div>

            <div className="md-nav-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Buscar en la tienda..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {busqueda && (
                <button type="button" onClick={() => setBusqueda('')} className="md-nav-search-x">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>

            <div className="md-nav-actions">
              <button type="button" className="md-nav-mob-search" onClick={() => setSearchOpen(s => !s)} aria-label="Buscar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="md-mob-search-bar">
              <input ref={mobileInputRef} type="text" placeholder="Buscar productos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          )}
        </nav>

        {/* BREADCRUMB + STATS */}
        <div className="md-breadcrumb-area">
          <div className="md-breadcrumb-inner">
            <div className="md-breadcrumb">
              <span className="md-bc-item">Inicio</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <span className="md-bc-item md-bc-active">Productos</span>
            </div>
            {!loading && (
              <div className="md-meta-pills">
                <span className="md-pill">{totalProductos} productos</span>
                <span className="md-pill">{enStock} disponibles</span>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="md-main">
          {/* Filters bar */}
          <div className="md-filters-bar">
            <p className="md-showing">
              Mostrando <strong>{loading ? '...' : productosFiltrados.length}</strong> producto{productosFiltrados.length !== 1 ? 's' : ''}
              {busqueda && <> para "<em>{busqueda}</em>"</>}
            </p>
          </div>

          {/* Grid */}
          <div className="md-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="md-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p className="md-empty-title">{busqueda ? 'Sin resultados' : 'Sin productos'}</p>
                <p className="md-empty-sub">{busqueda ? `No encontramos nada para "${busqueda}"` : 'No hay productos disponibles por el momento.'}</p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="md-footer">
          <div className="md-footer-inner">
            <div className="md-footer-brand">
              <span className="md-footer-name">{tenantNombre || 'Store'}</span>
              <span className="md-footer-sub">Tienda oficial</span>
            </div>
            <div className="md-footer-links">
              <span>Términos y condiciones</span>
              <span>Política de privacidad</span>
            </div>
            <p className="md-footer-copy">© {new Date().getFullYear()} {tenantNombre || 'Store'}. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Archivo:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .md-root { min-height: 100vh; background: #F7F7F8; color: #18181B; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* TOPBAR */
  .md-topbar { background: #4F46E5; color: rgba(255,255,255,0.85); text-align: center; font-size: 12px; font-weight: 500; padding: 8px 16px; letter-spacing: 0.02em; }

  /* NAV */
  .md-nav { position: sticky; top: 0; z-index: 50; background: #FFFFFF; border-bottom: 1px solid #E4E4E7; }
  .md-nav-inner { max-width: 1300px; margin: 0 auto; height: 64px; display: flex; align-items: center; padding: 0 24px; gap: 20px; }
  .md-logo { flex-shrink: 0; }
  .md-logo-name { font-family: 'Archivo', sans-serif; font-size: 20px; font-weight: 800; color: #18181B; letter-spacing: -0.02em; }
  .md-nav-search { position: relative; flex: 1; max-width: 520px; margin: 0 auto; }
  .md-nav-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #A1A1AA; pointer-events: none; }
  .md-nav-search input { width: 100%; background: #F4F4F5; border: 1.5px solid transparent; border-radius: 10px; padding: 10px 38px 10px 42px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #18181B; outline: none; transition: all 0.2s; }
  .md-nav-search input::placeholder { color: #A1A1AA; }
  .md-nav-search input:focus { background: #fff; border-color: #4F46E5; }
  .md-nav-search-x { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #A1A1AA; cursor: pointer; display: flex; padding: 2px; }
  .md-nav-actions { flex-shrink: 0; display: flex; gap: 8px; }
  .md-nav-mob-search { display: none; width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #E4E4E7; background: #fff; color: #71717A; cursor: pointer; align-items: center; justify-content: center; }
  .md-mob-search-bar { padding: 8px 24px 14px; border-top: 1px solid #E4E4E7; }
  .md-mob-search-bar input { width: 100%; background: #F4F4F5; border: 1.5px solid transparent; border-radius: 10px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #18181B; outline: none; }
  .md-mob-search-bar input:focus { border-color: #4F46E5; }

  /* BREADCRUMB */
  .md-breadcrumb-area { background: #FFFFFF; border-bottom: 1px solid #E4E4E7; }
  .md-breadcrumb-inner { max-width: 1300px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .md-breadcrumb { display: flex; align-items: center; gap: 6px; }
  .md-bc-item { font-size: 13px; color: #A1A1AA; }
  .md-bc-active { color: #18181B; font-weight: 500; }
  .md-breadcrumb svg { color: #D4D4D8; }
  .md-meta-pills { display: flex; gap: 6px; }
  .md-pill { font-size: 12px; font-weight: 500; color: #71717A; background: #F4F4F5; padding: 4px 12px; border-radius: 6px; }

  /* MAIN */
  .md-main { max-width: 1400px; margin: 0 auto; padding: 24px 24px 80px; }
  .md-filters-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .md-showing { font-size: 13px; color: #71717A; }
  .md-showing strong { color: #18181B; font-weight: 600; }
  .md-showing em { font-style: normal; color: #4F46E5; }
  .md-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* CARD */
  .md-card { background: #FFFFFF; border-radius: 12px; cursor: pointer; outline: none; user-select: none; text-align: left; overflow: hidden; border: 1px solid #E4E4E7; transition: all 0.25s ease; animation: mdCardIn 0.4s ease both; }
  .md-card:hover { border-color: #4F46E5; box-shadow: 0 8px 32px rgba(79,70,229,0.08); transform: translateY(-2px); }
  .md-card:focus-visible { outline: 2px solid #4F46E5; outline-offset: 2px; }
  @keyframes mdCardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .md-card-img { position: relative; padding-bottom: 95%; overflow: hidden; background: #FAFAFA; }
  .md-card-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(.25,.8,.25,1); }
  .md-card-no-img { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Archivo', sans-serif; font-size: 40px; font-weight: 800; color: #E4E4E7; }
  .md-card-quickview { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #fff; background: #4F46E5; padding: 8px 18px; border-radius: 8px; transition: all 0.25s; z-index: 3; white-space: nowrap; box-shadow: 0 4px 16px rgba(79,70,229,0.3); }
  .md-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: #fff; border: 1px solid #E4E4E7; border-radius: 8px; color: #18181B; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.2s; }
  .md-arr:hover { border-color: #4F46E5; color: #4F46E5; }
  .md-arr-l { left: 10px; }
  .md-arr-r { right: 10px; }
  .md-badges { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 4px; z-index: 5; pointer-events: none; }
  .md-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
  .md-badge-low { background: #FEF3C7; color: #B45309; }
  .md-badge-out { background: #F4F4F5; color: #71717A; }
  .md-card-info { padding: 14px 16px 16px; }
  .md-card-name { font-size: 14px; font-weight: 500; color: #18181B; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }
  .md-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .md-card-price { font-family: 'Archivo', sans-serif; font-size: 20px; font-weight: 700; color: #18181B; line-height: 1; }
  .md-card-consult { font-size: 12px; font-weight: 500; color: #A1A1AA; }
  .md-card-stock { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; white-space: nowrap; }
  .md-stock-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* SKELETON */
  .md-sk { background: #fff; border-radius: 12px; border: 1px solid #E4E4E7; overflow: hidden; animation: mdCardIn 0.4s ease both; }
  .md-sk-img { padding-bottom: 95%; }
  .md-sk-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .md-sk-line { height: 14px; border-radius: 6px; }
  .md-sk-lg { width: 70%; }
  .md-sk-sm { width: 40%; }
  .md-shimmer { background: linear-gradient(90deg, #F4F4F5 0%, #E4E4E7 50%, #F4F4F5 100%); background-size: 200% 100%; animation: mdShimmer 1.6s ease infinite; }
  @keyframes mdShimmer { to { background-position: -200% 0; } }

  /* EMPTY */
  .md-empty { grid-column: 1 / -1; padding: 80px 24px; text-align: center; background: #fff; border-radius: 12px; border: 1px dashed #E4E4E7; }
  .md-empty svg { color: #D4D4D8; margin: 0 auto 16px; display: block; }
  .md-empty-title { font-family: 'Archivo', sans-serif; font-size: 18px; font-weight: 700; color: #18181B; margin-bottom: 6px; }
  .md-empty-sub { font-size: 14px; color: #A1A1AA; }

  /* FOOTER */
  .md-footer { background: #18181B; margin-top: 40px; }
  .md-footer-inner { max-width: 1300px; margin: 0 auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 16px; }
  .md-footer-brand { display: flex; flex-direction: column; gap: 2px; }
  .md-footer-name { font-family: 'Archivo', sans-serif; font-size: 18px; font-weight: 800; color: #fff; }
  .md-footer-sub { font-size: 11px; font-weight: 500; color: #4F46E5; letter-spacing: 0.06em; text-transform: uppercase; }
  .md-footer-links { display: flex; gap: 20px; }
  .md-footer-links span { font-size: 12px; color: #71717A; cursor: pointer; transition: color 0.15s; }
  .md-footer-links span:hover { color: #A1A1AA; }
  .md-footer-copy { font-size: 11px; color: #3F3F46; }

  /* RESPONSIVE */
  @media (max-width: 1200px) { .md-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) { .md-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .md-topbar { font-size: 11px; padding: 6px 12px; }
    .md-nav-search { display: none; }
    .md-nav-mob-search { display: flex; }
    .md-nav-inner { padding: 0 16px; }
    .md-breadcrumb-inner { padding: 10px 16px; }
    .md-meta-pills { display: none; }
    .md-main { padding: 16px 16px 64px; }
    .md-grid { gap: 12px; }
    .md-footer-inner { padding: 24px 16px; }
  }
  @media (max-width: 480px) {
    .md-grid { gap: 10px; }
    .md-card-info { padding: 10px 12px 14px; }
    .md-card-price { font-size: 16px; }
  }
`
