import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'

function SkeletonCard() {
  return (
    <div className="mn-sk">
      <div className="mn-sk-img mn-shimmer" />
      <div className="mn-sk-body">
        <div className="mn-sk-line mn-sk-lg mn-shimmer" />
        <div className="mn-sk-line mn-sk-sm mn-shimmer" />
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
      className="mn-card"
      style={{ animationDelay: `${Math.min(index * 80, 500)}ms`, opacity: sinStock ? 0.5 : 1 }}
    >
      <div className="mn-card-img" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre} className="mn-card-photo" style={{ transform: hov ? 'scale(1.04)' : 'scale(1)' }} />
        ) : (
          <div className="mn-card-no-img">{getInitials(p.nombre)}</div>
        )}

        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="mn-arr mn-arr-l" style={{ opacity: hov ? 1 : 0 }} aria-label="Anterior">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" onClick={goNext} className="mn-arr mn-arr-r" style={{ opacity: hov ? 1 : 0 }} aria-label="Siguiente">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}

        {total > 1 && (
          <div className="mn-dots">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className="mn-dot" style={{ opacity: i === imgIdx ? 1 : 0.25, transform: i === imgIdx ? 'scale(1.3)' : 'scale(1)' }} />
            ))}
          </div>
        )}

        {sinStock && <div className="mn-sold-out">Agotado</div>}
      </div>

      <div className="mn-card-info">
        <p className="mn-card-name">{p.nombre || 'Sin nombre'}</p>
        {p.precio != null ? (
          <p className="mn-card-price">{fmt(p.precio)}</p>
        ) : (
          <p className="mn-card-price mn-consult">Consultar precio</p>
        )}
        {stockBajo && !sinStock && (
          <p className="mn-card-low">Quedan {p.stock}</p>
        )}
      </div>
    </article>
  )
}

export default function MinimalStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, totalProductos,
  } = useStoreData(slugProp)

  return (
    <>
      <style>{CSS}</style>
      <div className="mn-root">
        {/* HEADER — just logo centered */}
        <header className="mn-header">
          <span className="mn-logo">{tenantNombre || 'Store'}</span>
        </header>

        {/* SEARCH — centered below header */}
        <div className="mn-search-section">
          <div className="mn-search-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="mn-search"
            />
            {busqueda && (
              <button type="button" className="mn-search-clear" onClick={() => setBusqueda('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          {!loading && !busqueda && (
            <p className="mn-subtitle">{totalProductos} producto{totalProductos !== 1 ? 's' : ''}</p>
          )}
          {busqueda && (
            <p className="mn-subtitle">{productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* GRID */}
        <main className="mn-main">
          <div className="mn-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="mn-empty">
                <p>{busqueda ? `Nada encontrado para "${busqueda}"` : 'Sin productos por ahora.'}</p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mn-footer">
          <p>© {new Date().getFullYear()} {tenantNombre || 'Store'}</p>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mn-root { min-height: 100vh; background: #FAFAFA; color: #1A1A1A; font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* HEADER */
  .mn-header { text-align: center; padding: 48px 24px 0; }
  .mn-logo { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 200; letter-spacing: 0.12em; text-transform: uppercase; color: #1A1A1A; }

  /* SEARCH */
  .mn-search-section { text-align: center; padding: 32px 24px 0; }
  .mn-search-wrap { position: relative; display: inline-flex; align-items: center; max-width: 420px; width: 100%; }
  .mn-search-wrap svg { position: absolute; left: 20px; color: #C0C0C0; pointer-events: none; }
  .mn-search { width: 100%; background: #FFFFFF; border: 1px solid #EBEBEB; border-radius: 60px; padding: 14px 48px 14px 52px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 300; color: #1A1A1A; outline: none; transition: all 0.3s ease; box-shadow: 0 2px 20px rgba(0,0,0,0.03); }
  .mn-search::placeholder { color: #C0C0C0; font-weight: 300; }
  .mn-search:focus { border-color: #1A1A1A; box-shadow: 0 4px 30px rgba(0,0,0,0.06); }
  .mn-search-clear { position: absolute; right: 16px; background: none; border: none; color: #C0C0C0; cursor: pointer; display: flex; padding: 4px; transition: color 0.2s; }
  .mn-search-clear:hover { color: #1A1A1A; }
  .mn-subtitle { font-size: 12px; font-weight: 300; color: #B0B0B0; margin-top: 16px; letter-spacing: 0.06em; }

  /* GRID */
  .mn-main { max-width: 1100px; margin: 0 auto; padding: 48px 40px 100px; }
  .mn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }

  /* CARD */
  .mn-card { cursor: pointer; outline: none; user-select: none; text-align: center; animation: mnFadeIn 0.6s ease both; transition: transform 0.4s ease; }
  .mn-card:hover { transform: translateY(-6px); }
  @keyframes mnFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .mn-card-img { position: relative; padding-bottom: 120%; overflow: hidden; background: #FFFFFF; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); transition: box-shadow 0.4s; }
  .mn-card:hover .mn-card-img { box-shadow: 0 12px 48px rgba(0,0,0,0.08); }
  .mn-card-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.25,.8,.25,1); border-radius: 20px; }
  .mn-card-no-img { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 200; color: #E0E0E0; border-radius: 20px; }
  .mn-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; color: #1A1A1A; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.25s; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .mn-arr:hover { background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .mn-arr-l { left: 12px; }
  .mn-arr-r { right: 12px; }
  .mn-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 5; }
  .mn-dot { width: 5px; height: 5px; border-radius: 50%; background: #1A1A1A; transition: all 0.25s; }
  .mn-sold-out { position: absolute; top: 16px; right: 16px; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #999; background: rgba(255,255,255,0.9); padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(8px); }
  .mn-card-info { padding: 20px 8px 0; }
  .mn-card-name { font-size: 14px; font-weight: 400; color: #1A1A1A; line-height: 1.5; margin-bottom: 6px; }
  .mn-card-price { font-size: 15px; font-weight: 500; color: #1A1A1A; }
  .mn-card-price.mn-consult { font-size: 12px; font-weight: 300; color: #B0B0B0; }
  .mn-card-low { font-size: 11px; font-weight: 400; color: #E88D4F; margin-top: 4px; }

  /* SKELETON */
  .mn-sk { animation: mnFadeIn 0.4s ease both; }
  .mn-sk-img { padding-bottom: 120%; border-radius: 20px; }
  .mn-sk-body { padding: 20px 8px 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .mn-sk-line { height: 12px; border-radius: 6px; }
  .mn-sk-lg { width: 60%; }
  .mn-sk-sm { width: 35%; }
  .mn-shimmer { background: linear-gradient(90deg, #F0F0F0 0%, #E8E8E8 50%, #F0F0F0 100%); background-size: 200% 100%; animation: mnShimmer 1.6s ease infinite; }
  @keyframes mnShimmer { to { background-position: -200% 0; } }

  /* EMPTY */
  .mn-empty { grid-column: 1 / -1; padding: 100px 24px; text-align: center; }
  .mn-empty p { font-size: 14px; font-weight: 300; color: #C0C0C0; }

  /* FOOTER */
  .mn-footer { text-align: center; padding: 40px 24px; }
  .mn-footer p { font-size: 11px; font-weight: 300; color: #D0D0D0; letter-spacing: 0.06em; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .mn-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .mn-main { padding: 32px 20px 80px; }
  }
  @media (max-width: 540px) {
    .mn-header { padding: 32px 16px 0; }
    .mn-logo { font-size: 22px; }
    .mn-grid { gap: 16px; }
    .mn-card-img { border-radius: 14px; }
    .mn-card-photo { border-radius: 14px; }
  }
`
