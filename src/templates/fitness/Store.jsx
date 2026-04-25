import { useState, useRef } from 'react'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'
import MiniCart from '../../components/MiniCart'

function SkeletonCard() {
  return (
    <div className="ft-sk">
      <div className="ft-sk-img ft-shimmer" />
      <div className="ft-sk-body">
        <div className="ft-sk-line ft-sk-lg ft-shimmer" />
        <div className="ft-sk-line ft-sk-sm ft-shimmer" />
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
      className="ft-card"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, opacity: sinStock ? 0.45 : 1 }}
    >
      {/* Image */}
      <div className="ft-card-img" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre} className="ft-card-photo" style={{ transform: hov ? 'scale(1.12)' : 'scale(1)' }} />
        ) : (
          <div className="ft-card-no-img">{getInitials(p.nombre)}</div>
        )}

        {/* Neon glow overlay on hover */}
        <div className="ft-card-glow" style={{ opacity: hov ? 1 : 0 }} />

        {/* CTA */}
        <div className="ft-card-cta" style={{ transform: hov ? 'translateY(0)' : 'translateY(20px)', opacity: hov ? 1 : 0 }}>
          <span>VER PRODUCTO</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="ft-arr ft-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="ft-arr ft-arr-r" aria-label="Siguiente">›</button>
          </>
        )}

        {/* Badges */}
        <div className="ft-badges">
          {stockBajo && !sinStock && <span className="ft-badge-hot"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 1.45-.39 2.81-1.06 3.98l-1.73-1a6.003 6.003 0 00-8.54-7.16L7.05 6.11A9.004 9.004 0 0113 2.05zM5.06 13H3.04c.26 2.8 1.91 5.19 4.27 6.49l1.02-1.73A6.019 6.019 0 015.06 13zm6.94 7c-1.45 0-2.81-.39-3.98-1.06l-1 1.73C8.59 21.61 10.22 22 12 22c4.97 0 9-4.03 9-9h-2a7 7 0 01-7 7z"/></svg> ¡ÚLTIMAS {p.stock}!</span>}
          {sinStock && <span className="ft-badge-out">AGOTADO</span>}
        </div>
      </div>

      {/* Info */}
      <div className="ft-card-info">
        <p className="ft-card-name">{p.nombre || 'Sin nombre'}</p>
        <div className="ft-card-bottom">
          {p.precio != null ? (
            <span className="ft-card-price">{fmt(p.precio)}</span>
          ) : (
            <span className="ft-card-consult">CONSULTAR</span>
          )}
          {isProducto && !sinStock && (
            <span className="ft-card-stock">
              <span className="ft-stock-bar">
                <span className="ft-stock-fill" style={{ width: stockBajo ? '20%' : '80%', background: stockBajo ? '#FF3D00' : '#39FF14' }} />
              </span>
              {stockBajo ? 'Bajo' : 'Stock'}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="ft-card-line" style={{ transform: hov ? 'scaleX(1)' : 'scaleX(0)' }} />
    </article>
  )
}

export default function FitnessStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    totalProductos, enStock,
    categorias, categoriaConteo, categoriaActiva, setCategoriaActiva,
    subcategorias, subcategoriaConteo, subcategoriaActiva, setSubcategoriaActiva,
  } = useStoreData(slugProp)

  return (
    <>
      <style>{CSS}</style>
      <div className="ft-root">
        {/* HEADER */}
        <header className="ft-header">
          <div className="ft-header-inner">
            {/* Brand */}
            <div className="ft-brand">
              <span className="ft-brand-name">{tenantNombre || 'STORE'}</span>
              <span className="ft-brand-badge">OFFICIAL</span>
            </div>

            {/* Search */}
            <div className="ft-search-area">
              <div className="ft-search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                {busqueda && (
                  <button type="button" className="ft-search-x" onClick={() => setBusqueda('')}>✕</button>
                )}
              </div>
              <button type="button" className="ft-search-mob" onClick={() => setSearchOpen(s => !s)} aria-label="Buscar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>

            {/* Cart */}
            <MiniCart position="header" theme="fitness" />
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="ft-mob-search">
              <input ref={mobileInputRef} type="text" placeholder="¿Qué buscas?" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          )}
        </header>

        {/* HERO BANNER */}
        <section className="ft-hero">
          <div className="ft-hero-bg" />
          <div className="ft-hero-content">
            <span className="ft-hero-tag">/ TIENDA OFICIAL</span>
            <h1 className="ft-hero-title">{tenantNombre || 'STORE'}</h1>
            <p className="ft-hero-sub">POTENCIA TU RENDIMIENTO. SIN EXCUSAS.</p>
            {!loading && (
              <div className="ft-hero-counters">
                <div className="ft-counter">
                  <span className="ft-counter-num">{totalProductos}</span>
                  <span className="ft-counter-lbl">PRODUCTOS</span>
                </div>
                <div className="ft-counter-sep" />
                <div className="ft-counter">
                  <span className="ft-counter-num">{enStock}</span>
                  <span className="ft-counter-lbl">DISPONIBLES</span>
                </div>
              </div>
            )}
          </div>
          <div className="ft-hero-clip" />
        </section>

        {/* CATEGORIES */}
        {categorias.length > 0 && (
          <section className="ft-cat-section">
            <div className="ft-cat-header">
              <div className="ft-cat-line" />
              <span className="ft-cat-label">CATEGORÍAS</span>
              <div className="ft-cat-line" />
            </div>
            <div className="ft-cat-grid">
              <button
                type="button"
                className={`ft-cat-card${!categoriaActiva ? ' ft-cat-card-active' : ''}`}
                onClick={() => setCategoriaActiva('')}
              >
                <span className="ft-cat-card-name">TODOS</span>
                <span className="ft-cat-card-count">{totalProductos}</span>
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ft-cat-card${categoriaActiva === cat ? ' ft-cat-card-active' : ''}`}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  <span className="ft-cat-card-name">{cat.toUpperCase()}</span>
                  <span className="ft-cat-card-count">{categoriaConteo[cat] || 0}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SUBCATEGORIES */}
        {subcategorias.length > 0 && (
          <section className="ft-subcat-section">
            <div className="ft-subcat-bar">
              <button
                type="button"
                className={`ft-subcat-tab${!subcategoriaActiva ? ' ft-subcat-active' : ''}`}
                onClick={() => setSubcategoriaActiva('')}
              >
                TODOS
              </button>
              {subcategorias.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className={`ft-subcat-tab${subcategoriaActiva === sub ? ' ft-subcat-active' : ''}`}
                  onClick={() => setSubcategoriaActiva(sub)}
                >
                  {sub.toUpperCase()}
                  <span className="ft-subcat-count">{subcategoriaConteo[sub] || 0}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* GRID */}
        <main className="ft-main">

          {busqueda && (
            <p className="ft-results">
              {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{busqueda}"
            </p>
          )}

          <div className="ft-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productosFiltrados.length === 0 ? (
              <div className="ft-empty">
                <div className="ft-empty-icon">∅</div>
                <p>{busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos disponibles.'}</p>
              </div>
            ) : (
              productosFiltrados.map((p, i) => <ProductCard key={p.id} p={p} index={i} slug={slug} />)
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="ft-footer">
          <div className="ft-footer-inner">
            <span className="ft-footer-brand">{tenantNombre || 'STORE'}</span>
            <span className="ft-footer-copy">© {new Date().getFullYear()} Todos los derechos reservados</span>
            <span className="ft-footer-neon">POWERED BY HUSTLE</span>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ft-root { min-height: 100vh; background: #0A0A0A; color: #F0F0F0; font-family: 'Barlow', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* HEADER */
  .ft-header { position: sticky; top: 0; z-index: 50; background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(57,255,20,0.12); }
  .ft-header-inner { max-width: 1400px; margin: 0 auto; height: 72px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; padding: 0 32px; gap: 32px; }
  .ft-brand { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .ft-brand-name { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; }
  .ft-brand-badge { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.2em; padding: 3px 8px; border: 1px solid #39FF14; color: #39FF14; }
  .ft-search-area { display: flex; align-items: center; justify-content: center; gap: 12px; max-width: 600px; margin: 0 auto; }
  .ft-search-box { position: relative; display: flex; align-items: center; flex: 1; }
  .ft-search-box svg { position: absolute; left: 12px; color: #555; pointer-events: none; }
  .ft-search-box input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px 10px 40px; font-family: 'Barlow', sans-serif; font-size: 13px; color: #fff; outline: none; width: 100%; transition: all 0.2s; }
  .ft-search-box input::placeholder { color: #555; }
  .ft-search-box input:focus { border-color: #39FF14; background: rgba(57,255,20,0.03); }
  .ft-search-x { position: absolute; right: 10px; background: none; border: none; color: #666; cursor: pointer; font-size: 12px; }
  .ft-search-mob { display: none; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #888; cursor: pointer; align-items: center; justify-content: center; }
  .ft-mob-search { padding: 12px 32px 16px; border-top: 1px solid rgba(255,255,255,0.05); }
  .ft-mob-search input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px 16px; font-family: 'Barlow', sans-serif; font-size: 14px; color: #fff; outline: none; }
  .ft-mob-search input:focus { border-color: #39FF14; }

  /* HERO */
  .ft-hero { position: relative; overflow: hidden; padding: 60px 32px 50px; max-width: 1400px; margin: 0 auto; }
  .ft-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 20%, rgba(57,255,20,0.06) 0%, transparent 60%); pointer-events: none; }
  .ft-hero-content { position: relative; z-index: 1; }
  .ft-hero-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.25em; color: #39FF14; display: block; margin-bottom: 12px; }
  .ft-hero-title { font-family: 'Oswald', sans-serif; font-size: clamp(52px, 8vw, 96px); font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; line-height: 0.95; color: #fff; }
  .ft-hero-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 0.2em; color: #555; margin-top: 14px; text-transform: uppercase; }
  .ft-hero-counters { display: flex; align-items: center; gap: 20px; margin-top: 28px; }
  .ft-counter { display: flex; flex-direction: column; gap: 2px; }
  .ft-counter-num { font-family: 'Oswald', sans-serif; font-size: 36px; font-weight: 500; color: #39FF14; line-height: 1; }
  .ft-counter-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.2em; color: #555; }
  .ft-counter-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }
  .ft-hero-clip { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #39FF14, transparent 70%); }

  /* CATEGORIES SECTION */
  .ft-cat-section {
    max-width: 1400px; margin: 0 auto;
    padding: 0 32px 8px;
  }
  .ft-cat-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 20px;
  }
  .ft-cat-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57,255,20,0.15), transparent);
  }
  .ft-cat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
    color: #39FF14; flex-shrink: 0;
  }
  .ft-cat-grid {
    display: flex; gap: 10px;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .ft-cat-grid::-webkit-scrollbar { display: none; }
  .ft-cat-card {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 24px;
    background: #111;
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    white-space: nowrap; flex-shrink: 0;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .ft-cat-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: #39FF14;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .ft-cat-card:hover {
    border-color: rgba(255,255,255,0.12);
    background: #151515;
  }
  .ft-cat-card:hover::after { transform: scaleX(1); }
  .ft-cat-card-active {
    border-color: rgba(57,255,20,0.35) !important;
    background: rgba(57,255,20,0.04) !important;
  }
  .ft-cat-card-active::after { transform: scaleX(1) !important; }
  .ft-cat-card-name {
    font-family: 'Oswald', sans-serif;
    font-size: 15px; font-weight: 500; letter-spacing: 0.06em;
    color: #ccc;
    transition: color 0.2s;
  }
  .ft-cat-card-active .ft-cat-card-name { color: #fff; }
  .ft-cat-card-count {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    color: #39FF14;
    background: rgba(57,255,20,0.08);
    padding: 2px 8px;
    min-width: 28px; text-align: center;
  }

  /* SUBCATEGORY TABS */
  .ft-subcat-section {
    max-width: 1400px; margin: 0 auto;
    padding: 0 32px 8px;
  }
  .ft-subcat-bar {
    display: flex; gap: 6px;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding: 12px 0 4px;
    border-top: 1px solid rgba(255,255,255,0.04);
    scrollbar-width: none;
  }
  .ft-subcat-bar::-webkit-scrollbar { display: none; }
  .ft-subcat-tab {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
    padding: 8px 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.06);
    color: #555; cursor: pointer;
    white-space: nowrap; flex-shrink: 0;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .ft-subcat-tab:hover { color: #aaa; border-color: rgba(255,255,255,0.12); }
  .ft-subcat-active {
    color: #39FF14 !important;
    border-color: rgba(57,255,20,0.3) !important;
    background: rgba(57,255,20,0.04);
  }
  .ft-subcat-count {
    font-size: 10px; color: #444;
    background: rgba(255,255,255,0.04);
    padding: 1px 6px;
  }
  .ft-subcat-active .ft-subcat-count { color: #39FF14; background: rgba(57,255,20,0.1); }

  /* GRID */
  .ft-main { max-width: 1400px; margin: 0 auto; padding: 32px 32px 80px; }
  .ft-results { font-family: 'Barlow', sans-serif; font-size: 13px; color: #555; margin-bottom: 20px; letter-spacing: 0.04em; }
  .ft-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* CARD */
  .ft-card { background: #111; cursor: pointer; outline: none; user-select: none; text-align: left; position: relative; border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s ease; animation: ftCardIn 0.45s ease both; overflow: hidden; }
  .ft-card:hover { border-color: rgba(57,255,20,0.25); box-shadow: 0 0 30px rgba(57,255,20,0.08), 0 20px 60px rgba(0,0,0,0.4); transform: translateY(-3px); }
  @keyframes ftCardIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .ft-card-img { position: relative; padding-bottom: 95%; overflow: hidden; background: #0D0D0D; }
  .ft-card-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.25,.8,.25,1); }
  .ft-card-no-img { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-size: 48px; font-weight: 700; color: rgba(255,255,255,0.04); }
  .ft-card-glow { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(57,255,20,0.08) 100%); transition: opacity 0.4s; pointer-events: none; }
  .ft-card-cta { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; color: #39FF14; transition: all 0.3s cubic-bezier(.25,.8,.25,1); z-index: 3; }
  .ft-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: rgba(0,0,0,0.7); border: 1px solid rgba(57,255,20,0.2); color: #39FF14; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: all 0.15s; line-height: 1; padding: 0; }
  .ft-arr:hover { background: rgba(57,255,20,0.15); }
  .ft-arr-l { left: 8px; }
  .ft-arr-r { right: 8px; }
  .ft-badges { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 4px; z-index: 5; pointer-events: none; }
  .ft-badge-hot { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; padding: 5px 10px; background: #FF3D00; color: #fff; display: flex; align-items: center; gap: 5px; }
  .ft-badge-out { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; padding: 5px 10px; background: rgba(255,255,255,0.08); color: #666; }
  .ft-card-info { padding: 12px 14px 14px; }
  .ft-card-name { font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500; color: #ccc; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }
  .ft-card-bottom { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .ft-card-price { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 500; color: #39FF14; letter-spacing: 0.02em; line-height: 1; }
  .ft-card-consult { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.15em; color: #555; }
  .ft-card-stock { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; color: #555; letter-spacing: 0.06em; text-transform: uppercase; }
  .ft-stock-bar { width: 32px; height: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .ft-stock-fill { height: 100%; transition: width 0.3s; }
  .ft-card-line { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #39FF14; transform-origin: left; transition: transform 0.3s; }

  /* SKELETON */
  .ft-sk { background: #111; border: 1px solid rgba(255,255,255,0.04); animation: ftCardIn 0.4s ease both; overflow: hidden; }
  .ft-sk-img { padding-bottom: 95%; }
  .ft-sk-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
  .ft-sk-line { height: 14px; }
  .ft-sk-lg { width: 70%; }
  .ft-sk-sm { width: 40%; }
  .ft-shimmer { background: linear-gradient(90deg, #111 0%, #1a1a1a 50%, #111 100%); background-size: 200% 100%; animation: ftShimmer 1.6s ease infinite; }
  @keyframes ftShimmer { to { background-position: -200% 0; } }

  /* EMPTY */
  .ft-empty { grid-column: 1 / -1; padding: 80px 24px; text-align: center; border: 1px dashed rgba(255,255,255,0.06); }
  .ft-empty-icon { font-size: 48px; color: rgba(57,255,20,0.15); margin-bottom: 12px; }
  .ft-empty p { font-size: 14px; color: #444; }

  /* FOOTER */
  .ft-footer { border-top: 1px solid rgba(255,255,255,0.04); background: #050505; }
  .ft-footer-inner { max-width: 1400px; margin: 0 auto; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .ft-footer-brand { font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 0.08em; color: #333; }
  .ft-footer-copy { font-size: 11px; color: #333; letter-spacing: 0.04em; }
  .ft-footer-neon { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: #39FF14; opacity: 0.4; }

  /* RESPONSIVE */
  @media (max-width: 1100px) { .ft-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 850px) { .ft-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .ft-nav-center { display: none; }
    .ft-search-box { display: none; }
    .ft-search-mob { display: flex; }
    .ft-header-inner { padding: 0 16px; }
    .ft-hero { padding: 36px 16px 32px; }
    .ft-hero-title { font-size: 48px; }
    .ft-cat-section { padding: 0 16px 8px; }
    .ft-subcat-section { padding: 0 16px 8px; }
    .ft-cat-card { padding: 12px 18px; gap: 10px; }
    .ft-cat-card-name { font-size: 13px; }
    .ft-main { padding: 20px 16px 64px; }
    .ft-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ft-footer-inner { padding: 20px 16px; }
  }
  @media (max-width: 480px) {
    .ft-hero-title { font-size: 36px; }
    .ft-counter-num { font-size: 28px; }
  }
`
