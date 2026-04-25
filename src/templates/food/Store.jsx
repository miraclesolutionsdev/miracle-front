import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'
import MiniCart from '../../components/MiniCart'

function SkeletonCard() {
  return (
    <div className="fd-sk">
      <div className="fd-sk-img fd-shimmer" />
      <div className="fd-sk-body">
        <div className="fd-sk-line fd-sk-lg fd-shimmer" />
        <div className="fd-sk-line fd-sk-sm fd-shimmer" />
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
      className="fd-card"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms`, opacity: sinStock ? 0.55 : 1 }}
    >
      {/* Image */}
      <div className="fd-card-img" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre} className="fd-card-photo" style={{ transform: hov ? 'scale(1.08)' : 'scale(1)' }} />
        ) : (
          <div className="fd-card-no-img">{getInitials(p.nombre)}</div>
        )}

        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="fd-arr fd-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="fd-arr fd-arr-r" aria-label="Siguiente">›</button>
          </>
        )}

        {/* Badges */}
        {stockBajo && !sinStock && (
          <span className="fd-badge-hot">🔥 Últimas {p.stock}</span>
        )}
        {sinStock && <span className="fd-badge-out">Agotado</span>}
      </div>

      {/* Info */}
      <div className="fd-card-info">
        <p className="fd-card-name">{p.nombre || 'Sin nombre'}</p>
        <div className="fd-card-row">
          {p.precio != null ? (
            <span className="fd-card-price">{fmt(p.precio)}</span>
          ) : (
            <span className="fd-card-consult">Precio a consultar</span>
          )}
        </div>
        <button type="button" className="fd-card-btn" onClick={(e) => { e.stopPropagation(); navigateToProduct(p.id, slug) }}>
          Ver detalles
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </article>
  )
}

export default function FoodStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    totalProductos,
  } = useStoreData(slugProp)

  return (
    <>
      <style>{CSS}</style>
      <div className="fd-root">
        {/* HEADER */}
        <header className="fd-header">
          <MiniCart position="header" />
          <div className="fd-header-inner">
            <div className="fd-brand">
              <span className="fd-brand-icon">🛒</span>
              <div>
                <span className="fd-brand-name">{tenantNombre || 'Store'}</span>
                <span className="fd-brand-sub">Tienda oficial</span>
              </div>
            </div>

            <div className="fd-search-desktop">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="¿Qué estás buscando?" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {busqueda && (
                <button type="button" onClick={() => setBusqueda('')} className="fd-search-x">✕</button>
              )}
            </div>

            <button type="button" className="fd-search-mob-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
          {searchOpen && (
            <div className="fd-mob-search">
              <input ref={mobileInputRef} type="text" placeholder="¿Qué buscas hoy?" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          )}
        </header>

        {/* HERO BANNER */}
        <section className="fd-hero">
          <div className="fd-hero-inner">
            <div className="fd-hero-text">
              <h1 className="fd-hero-title">Descubre nuestros<br/><em>productos</em></h1>
              <p className="fd-hero-sub">{!loading ? `${totalProductos} productos disponibles para ti` : 'Cargando catálogo...'}</p>
            </div>
            <div className="fd-hero-deco">
              <div className="fd-hero-circle" />
              <div className="fd-hero-circle fd-hero-circle-2" />
            </div>
          </div>
        </section>

        {/* RESULTS */}
        {busqueda && (
          <div className="fd-results-bar">
            <p>{productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "<strong>{busqueda}</strong>"</p>
          </div>
        )}

        {/* GRID */}
        <main className="fd-main">
          <div className="fd-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="fd-empty">
                <span className="fd-empty-icon">🔍</span>
                <p>{busqueda ? `No encontramos "${busqueda}"` : 'No hay productos disponibles.'}</p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="fd-footer">
          <div className="fd-footer-inner">
            <span className="fd-footer-brand">{tenantNombre || 'Store'}</span>
            <span className="fd-footer-copy">© {new Date().getFullYear()} · Todos los derechos reservados</span>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Quicksand:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fd-root { min-height: 100vh; background: #FFF9F4; color: #2D2218; font-family: 'Nunito', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* HEADER */
  .fd-header { position: sticky; top: 0; z-index: 50; background: #FFFFFF; box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
  .fd-header-inner { max-width: 1200px; margin: 0 auto; height: 68px; display: flex; align-items: center; padding: 0 24px; gap: 16px; }
  .fd-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .fd-brand-icon { font-size: 28px; }
  .fd-brand-name { font-family: 'Quicksand', sans-serif; font-size: 20px; font-weight: 700; color: #2D2218; display: block; line-height: 1.1; }
  .fd-brand-sub { font-size: 10px; font-weight: 600; color: #FF6B00; letter-spacing: 0.08em; text-transform: uppercase; }
  .fd-search-desktop { position: relative; display: flex; align-items: center; flex: 1; max-width: 480px; margin: 0 auto; }
  .fd-search-desktop svg { position: absolute; left: 16px; color: #CCBFB3; pointer-events: none; }
  .fd-search-desktop input { width: 100%; background: #FFF5ED; border: 2px solid transparent; border-radius: 50px; padding: 11px 40px 11px 46px; font-family: 'Nunito', sans-serif; font-size: 14px; color: #2D2218; outline: none; transition: all 0.2s; }
  .fd-search-desktop input::placeholder { color: #CCBFB3; }
  .fd-search-desktop input:focus { border-color: #FF6B00; background: #fff; }
  .fd-search-x { position: absolute; right: 14px; background: none; border: none; color: #CCBFB3; cursor: pointer; font-size: 13px; }
  .fd-search-mob-btn { display: none; width: 42px; height: 42px; border-radius: 50%; border: none; background: #FFF5ED; color: #FF6B00; cursor: pointer; align-items: center; justify-content: center; }
  .fd-mob-search { padding: 10px 24px 14px; }
  .fd-mob-search input { width: 100%; background: #FFF5ED; border: 2px solid transparent; border-radius: 50px; padding: 12px 20px; font-family: 'Nunito', sans-serif; font-size: 14px; color: #2D2218; outline: none; }
  .fd-mob-search input:focus { border-color: #FF6B00; }

  /* HERO */
  .fd-hero { background: linear-gradient(135deg, #FF6B00 0%, #FF8F40 100%); overflow: hidden; position: relative; }
  .fd-hero-inner { max-width: 1200px; margin: 0 auto; padding: 40px 24px 36px; position: relative; z-index: 1; }
  .fd-hero-text { position: relative; z-index: 2; }
  .fd-hero-title { font-family: 'Quicksand', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: #fff; line-height: 1.2; }
  .fd-hero-title em { font-style: italic; font-family: 'Nunito', sans-serif; font-weight: 800; }
  .fd-hero-sub { font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.8); margin-top: 8px; }
  .fd-hero-deco { position: absolute; top: -20px; right: -20px; z-index: 0; }
  .fd-hero-circle { width: 180px; height: 180px; border-radius: 50%; background: rgba(255,255,255,0.08); position: absolute; top: 0; right: 0; }
  .fd-hero-circle-2 { width: 120px; height: 120px; top: 60px; right: 80px; background: rgba(255,255,255,0.05); }

  /* RESULTS */
  .fd-results-bar { max-width: 1200px; margin: 0 auto; padding: 16px 24px 0; }
  .fd-results-bar p { font-size: 13px; color: #99887A; }
  .fd-results-bar strong { color: #FF6B00; }

  /* GRID */
  .fd-main { max-width: 1400px; margin: 0 auto; padding: 24px 24px 80px; }
  .fd-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* CARD */
  .fd-card { background: #FFFFFF; border-radius: 16px; cursor: pointer; outline: none; user-select: none; text-align: left; overflow: hidden; transition: all 0.3s ease; animation: fdCardIn 0.4s ease both; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .fd-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(255,107,0,0.1); }
  @keyframes fdCardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fd-card-img { position: relative; padding-bottom: 95%; overflow: hidden; background: #FFF5ED; }
  .fd-card-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(.25,.8,.25,1); }
  .fd-card-no-img { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Quicksand', sans-serif; font-size: 36px; font-weight: 700; color: #F0E0D0; }
  .fd-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; color: #2D2218; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; box-shadow: 0 2px 8px rgba(0,0,0,0.1); line-height: 1; padding: 0; }
  .fd-arr-l { left: 8px; }
  .fd-arr-r { right: 8px; }
  .fd-badge-hot { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; padding: 4px 10px; background: #FF3D00; color: #fff; border-radius: 20px; z-index: 5; pointer-events: none; }
  .fd-badge-out { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 700; padding: 4px 10px; background: rgba(0,0,0,0.5); color: #fff; border-radius: 20px; z-index: 5; pointer-events: none; }
  .fd-card-info { padding: 14px 16px 16px; }
  .fd-card-name { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600; color: #2D2218; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 6px; }
  .fd-card-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .fd-card-price { font-family: 'Quicksand', sans-serif; font-size: 22px; font-weight: 700; color: #FF6B00; line-height: 1; }
  .fd-card-consult { font-size: 12px; font-weight: 600; color: #CCBFB3; }
  .fd-card-btn { width: 100%; padding: 10px; background: #FF6B00; border: none; border-radius: 10px; color: #fff; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
  .fd-card-btn:hover { background: #E85E00; }

  /* SKELETON */
  .fd-sk { background: #fff; border-radius: 16px; overflow: hidden; animation: fdCardIn 0.4s ease both; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
  .fd-sk-img { padding-bottom: 95%; }
  .fd-sk-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .fd-sk-line { height: 14px; border-radius: 8px; }
  .fd-sk-lg { width: 75%; }
  .fd-sk-sm { width: 45%; }
  .fd-shimmer { background: linear-gradient(90deg, #FFF5ED 0%, #FFE8D6 50%, #FFF5ED 100%); background-size: 200% 100%; animation: fdShimmer 1.6s ease infinite; }
  @keyframes fdShimmer { to { background-position: -200% 0; } }

  /* EMPTY */
  .fd-empty { grid-column: 1 / -1; padding: 80px 24px; text-align: center; }
  .fd-empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
  .fd-empty p { font-size: 14px; color: #CCBFB3; font-weight: 600; }

  /* FOOTER */
  .fd-footer { background: #2D2218; }
  .fd-footer-inner { max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .fd-footer-brand { font-family: 'Quicksand', sans-serif; font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.5); }
  .fd-footer-copy { font-size: 11px; color: rgba(255,255,255,0.2); }

  /* RESPONSIVE */
  @media (max-width: 1100px) { .fd-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px) {
    .fd-search-desktop { display: none; }
    .fd-search-mob-btn { display: flex; margin-left: auto; }
    .fd-header-inner { padding: 0 16px; }
    .fd-hero-inner { padding: 28px 16px; }
    .fd-main { padding: 16px 16px 64px; }
    .fd-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .fd-footer-inner { padding: 20px 16px; }
  }
  @media (max-width: 480px) {
    .fd-hero-title { font-size: 26px; }
    .fd-grid { gap: 10px; }
    .fd-card-info { padding: 10px 12px 12px; }
    .fd-card-price { font-size: 18px; }
  }
`
