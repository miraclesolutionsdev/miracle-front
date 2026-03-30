import { useState, useEffect, useMemo, useRef } from 'react'
import { productosApi, getProductoImagenSrc } from '../utils/api'

const GOLD = '#C9963A'
const GOLD_L = '#E2B55A'
const GOLD_RGB = '201,150,58'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`

function getInitials(name = '') {
  return String(name).trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'MS'
}

/* ── Skeleton card shown while loading ── */
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
        opacity: sinStock ? 0.65 : 1,
      }}
    >
      {/* ── Image ── */}
      <div className="pc-img-wrap" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img
            src={src}
            alt={p.nombre || 'Producto'}
            className="pc-img"
            style={{ transform: hov ? 'scale(1.08)' : 'scale(1)' }}
          />
        ) : (
          <div className="pc-placeholder">{getInitials(p.nombre)}</div>
        )}

        {/* Dark overlay on hover */}
        <div className="pc-overlay" style={{ opacity: hov ? 1 : 0 }} />

        {/* CTA pill */}
        <div
          className="pc-cta-wrap"
          style={{
            transform: hov ? 'translateY(0)' : 'translateY(10px)',
            opacity: hov ? 1 : 0,
          }}
        >
          <span className="pc-cta">Descubrir →</span>
        </div>

        {/* Carousel arrows */}
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="pc-arr pc-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="pc-arr pc-arr-r" aria-label="Siguiente">›</button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="pc-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                className="pc-dot"
                style={{
                  width: i === imgIdx ? 20 : 5,
                  background: i === imgIdx ? GOLD_L : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="pc-badges">
          <span className="pc-badge-cat">{p.tipo === 'servicio' ? 'Servicio' : 'Producto'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {stockBajo && !sinStock && (
              <span className="pc-badge-low">Últimas {p.stock}</span>
            )}
            {sinStock && (
              <span className="pc-badge-out">Agotado</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Info ── */}
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
              <span
                className="pc-avail-dot"
                style={{ background: stockBajo ? '#D4A017' : '#6FCF97' }}
              />
              {stockBajo ? `${p.stock} disponibles` : 'En stock'}
            </span>
          )}
          {sinStock && (
            <span className="pc-avail" style={{ color: 'rgba(255,150,120,0.7)' }}>
              <span className="pc-avail-dot" style={{ background: 'rgba(255,120,100,0.7)' }} />
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Bottom gold line appears on hover */}
      <div
        className="pc-hover-line"
        style={{ transform: hov ? 'scaleX(1)' : 'scaleX(0)' }}
      />
    </article>
  )
}

/* ── Main store ── */
export default function MiracleStore() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
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
    let lista = productos
    if (filtro === 'productos') lista = lista.filter((p) => p.tipo === 'producto')
    if (filtro === 'servicios') lista = lista.filter((p) => p.tipo === 'servicio')
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      )
    }
    return lista
  }, [productos, filtro, busqueda])

  const counts = {
    todos: productos.length,
    productos: productos.filter((p) => p.tipo === 'producto').length,
    servicios: productos.filter((p) => p.tipo === 'servicio').length,
  }
  const enStock = productos.filter((p) => p.tipo === 'producto' && p.stock > 0).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── ROOT ─── */
        .ms-root {
          min-height: 100vh;
          background: #0A0805;
          color: #F2EBD9;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* Noise texture overlay */
        .ms-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient glow */
        .ms-root::after {
          content: '';
          position: fixed;
          top: -10%;
          right: -5%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(ellipse, rgba(${GOLD_RGB},0.05) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* ─── NAV ─── */
        .ms-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10,8,5,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(${GOLD_RGB},0.15);
        }
        .ms-nav-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 0;
        }

        /* Logo */
        .ms-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          margin-right: 40px;
        }
        .ms-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .ms-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          font-style: italic;
          color: #F2EBD9;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .ms-logo-text em {
          font-style: italic;
          color: ${GOLD};
        }

        /* Nav center: categories */
        .ms-nav-cats {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .ms-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(242,235,217,0.38);
          transition: color 0.2s;
          position: relative;
          white-space: nowrap;
        }
        .ms-cat::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 1px;
          background: ${GOLD};
          transform: scaleX(0);
          transition: transform 0.22s ease;
        }
        .ms-cat.on {
          color: ${GOLD_L};
        }
        .ms-cat.on::after {
          transform: scaleX(1);
        }
        .ms-cat:not(.on):hover {
          color: rgba(242,235,217,0.65);
        }
        .ms-cat-cnt {
          font-size: 9px;
          vertical-align: super;
          margin-left: 2px;
          opacity: 0.55;
        }

        /* Nav right: search */
        .ms-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .ms-search-wrap { position: relative; }
        .ms-search-input {
          background: rgba(242,235,217,0.04);
          border: 1px solid rgba(${GOLD_RGB},0.18);
          padding: 8px 14px 8px 34px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(242,235,217,0.85);
          outline: none;
          width: 175px;
          transition: all 0.22s;
          letter-spacing: 0.02em;
        }
        .ms-search-input::placeholder { color: rgba(242,235,217,0.2); }
        .ms-search-input:focus {
          border-color: rgba(${GOLD_RGB},0.45);
          background: rgba(${GOLD_RGB},0.05);
          width: 220px;
        }
        .ms-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(242,235,217,0.2);
          pointer-events: none;
        }
        .ms-search-clear {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(242,235,217,0.3);
          cursor: pointer;
          padding: 2px;
          display: flex;
          transition: color 0.15s;
        }
        .ms-search-clear:hover { color: rgba(242,235,217,0.7); }

        /* Mobile search toggle */
        .ms-search-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(${GOLD_RGB},0.2);
          background: rgba(${GOLD_RGB},0.05);
          color: rgba(242,235,217,0.45);
          cursor: pointer;
          transition: all 0.18s;
        }
        .ms-search-toggle:hover {
          background: rgba(${GOLD_RGB},0.1);
          color: ${GOLD_L};
          border-color: rgba(${GOLD_RGB},0.4);
        }

        /* Mobile search bar */
        .ms-mobile-search {
          display: none;
          padding: 10px 20px 14px;
          border-top: 1px solid rgba(${GOLD_RGB},0.1);
          animation: fadeDown 0.18s ease;
        }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .ms-mobile-search.open { display: block; }
        .ms-mobile-search-rel { position: relative; }
        .ms-mobile-search input {
          width: 100%;
          background: rgba(242,235,217,0.04);
          border: 1px solid rgba(${GOLD_RGB},0.35);
          padding: 11px 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(242,235,217,0.9);
          outline: none;
          letter-spacing: 0.02em;
          transition: border-color 0.18s;
        }
        .ms-mobile-search input::placeholder { color: rgba(242,235,217,0.2); }
        .ms-mobile-search input:focus { border-color: rgba(${GOLD_RGB},0.55); }
        .ms-mob-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(242,235,217,0.22); pointer-events: none;
        }
        .ms-mob-search-clear {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(242,235,217,0.3); cursor: pointer;
          display: flex; padding: 2px;
        }

        /* ─── MOBILE CAT BAR ─── */
        .ms-mobile-cats {
          display: none;
          overflow-x: auto;
          gap: 0;
          border-bottom: 1px solid rgba(${GOLD_RGB},0.1);
          scrollbar-width: none;
          background: rgba(10,8,5,0.92);
        }
        .ms-mobile-cats::-webkit-scrollbar { display: none; }
        .ms-mobile-cats .ms-cat { padding: 12px 18px; }

        /* ─── HERO ─── */
        .ms-hero {
          max-width: 1440px;
          margin: 0 auto;
          padding: 56px 40px 0;
          position: relative;
          z-index: 1;
        }
        .ms-hero-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(${GOLD_RGB},0.12);
        }
        .ms-hero-left {}
        .ms-hero-sup {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: ${GOLD};
          opacity: 0.7;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ms-hero-sup::before, .ms-hero-sup::after {
          content: '';
          height: 1px;
          width: 24px;
          background: ${GOLD};
          opacity: 0.5;
          display: block;
        }
        .ms-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 6vw, 88px);
          font-weight: 600;
          font-style: italic;
          letter-spacing: -0.02em;
          line-height: 0.9;
          color: #F2EBD9;
        }
        .ms-hero-title em {
          font-style: italic;
          color: ${GOLD};
        }
        .ms-hero-sub {
          margin-top: 18px;
          font-size: 13px;
          font-weight: 300;
          color: rgba(242,235,217,0.35);
          max-width: 360px;
          line-height: 1.75;
          letter-spacing: 0.01em;
        }

        /* Stats */
        .ms-hero-stats {
          display: flex;
          gap: 0;
          flex-shrink: 0;
          align-items: flex-end;
        }
        .ms-stat {
          padding: 0 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          border-left: 1px solid rgba(${GOLD_RGB},0.15);
        }
        .ms-stat:first-child { border-left: none; padding-left: 0; }
        .ms-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          font-weight: 500;
          font-style: italic;
          color: ${GOLD};
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .ms-stat-lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(242,235,217,0.2);
          text-align: right;
        }

        /* ─── CATALOG ─── */
        .ms-catalog {
          max-width: 1440px;
          margin: 0 auto;
          padding: 36px 40px 96px;
          position: relative;
          z-index: 1;
        }
        .ms-catalog-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(${GOLD_RGB},0.07);
        }
        .ms-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(242,235,217,0.2);
        }
        .ms-count strong { color: rgba(242,235,217,0.4); font-weight: 500; }

        .ms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* ─── PRODUCT CARD ─── */
        .pc {
          display: flex;
          flex-direction: column;
          background: #100D08;
          cursor: pointer;
          outline: none;
          user-select: none;
          -webkit-user-select: none;
          text-align: left;
          position: relative;
          border: 1px solid rgba(${GOLD_RGB},0.06);
          transition: border-color 0.3s ease;
          animation: cardIn 0.55s ease both;
        }
        .pc:hover {
          border-color: rgba(${GOLD_RGB},0.25);
        }
        .pc:focus-visible {
          outline: 1px solid rgba(${GOLD_RGB},0.55);
          outline-offset: 2px;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pc-hover-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
          transform-origin: center;
          transition: transform 0.3s ease;
          z-index: 2;
        }

        .pc-img-wrap {
          position: relative;
          padding-bottom: 133%;
          overflow: hidden;
          background: #0D0A06;
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
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-style: italic;
          color: rgba(${GOLD_RGB},0.2);
          background: linear-gradient(135deg, #100D08 0%, rgba(${GOLD_RGB},0.03) 100%);
        }
        .pc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,8,5,0.75) 0%,
            rgba(10,8,5,0.2) 50%,
            transparent 100%
          );
          transition: opacity 0.3s;
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
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0A0805;
          background: ${GOLD_L};
          padding: 8px 20px;
          border: none;
          box-shadow: 0 4px 20px rgba(${GOLD_RGB},0.35);
        }

        .pc-arr {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          background: rgba(10,8,5,0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(${GOLD_RGB},0.25);
          color: ${GOLD_L};
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
        .pc-arr:hover { background: rgba(10,8,5,0.95); }
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
          transition: all 0.25s;
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
          font-family: 'DM Sans', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${GOLD};
          background: rgba(10,8,5,0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(${GOLD_RGB},0.3);
          padding: 3px 8px;
        }
        .pc-badge-low {
          font-family: 'DM Sans', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          background: rgba(220,80,50,0.88);
          color: #F2EBD9;
        }
        .pc-badge-out {
          font-family: 'DM Sans', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          background: rgba(10,8,5,0.8);
          color: rgba(242,235,217,0.4);
          border: 1px solid rgba(242,235,217,0.12);
        }

        .pc-info {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(${GOLD_RGB},0.07);
        }
        .pc-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(242,235,217,0.82);
          line-height: 1.45;
          letter-spacing: 0.01em;
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
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-style: italic;
          font-weight: 600;
          color: ${GOLD_L};
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .pc-price-na {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(242,235,217,0.3);
        }
        .pc-avail {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: rgba(242,235,217,0.32);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .pc-avail-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ─── SKELETON ─── */
        .sk-card {
          background: #100D08;
          border: 1px solid rgba(${GOLD_RGB},0.06);
          display: flex;
          flex-direction: column;
          animation: cardIn 0.4s ease both;
        }
        .sk-img {
          padding-bottom: 133%;
          width: 100%;
        }
        .sk-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
        .sk-line { height: 12px; }
        .sk-line-lg { width: 75%; }
        .sk-line-sm { width: 45%; }
        .shimmer {
          background: linear-gradient(90deg,
            rgba(${GOLD_RGB},0.03) 0%,
            rgba(${GOLD_RGB},0.08) 50%,
            rgba(${GOLD_RGB},0.03) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s ease infinite;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        /* ─── EMPTY ─── */
        .ms-empty {
          grid-column: 1 / -1;
          padding: 80px 24px;
          text-align: center;
          border: 1px solid rgba(${GOLD_RGB},0.08);
        }
        .ms-empty-symbol {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 36px;
          color: rgba(${GOLD_RGB},0.2);
          display: block;
          margin-bottom: 12px;
        }
        .ms-empty-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(242,235,217,0.18);
        }

        /* ─── FOOTER ─── */
        .ms-footer {
          border-top: 1px solid rgba(${GOLD_RGB},0.12);
          position: relative;
          z-index: 1;
        }
        .ms-footer-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 22px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ms-footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(242,235,217,0.15);
        }
        .ms-footer-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(${GOLD_RGB},0.4);
          border: 1px solid rgba(${GOLD_RGB},0.18);
          padding: 4px 12px;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1280px) { .ms-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 960px) {
          .ms-nav-inner { padding: 0 20px; }
          .ms-nav-cats { display: none; }
          .ms-search-wrap { display: none; }
          .ms-search-toggle { display: flex; }
          .ms-mobile-cats { display: flex; }
          .ms-logo { margin-right: auto; }
          .ms-hero { padding: 32px 20px 0; }
          .ms-catalog { padding: 24px 20px 72px; }
          .ms-hero-inner { flex-direction: column; align-items: flex-start; gap: 24px; }
          .ms-hero-stats { width: 100%; justify-content: flex-start; }
          .ms-stat { align-items: flex-start; padding: 0 24px 0 0; }
          .ms-stat:first-child { padding-left: 0; }
          .ms-stat-lbl { text-align: left; }
          .ms-footer-inner { padding: 18px 20px; }
          .ms-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .ms-catalog-bar { display: none; }
        }
        @media (max-width: 480px) {
          .ms-hero-title { font-size: 46px; }
          .ms-stat-num { font-size: 36px; }
          .ms-grid { gap: 10px; }
        }
      `}</style>

      <div className="ms-root">
        {/* ── NAV ── */}
        <nav className="ms-nav">
          <div className="ms-nav-inner">
            {/* Logo */}
            <div className="ms-logo">
              <img src="https://miracle-store.s3.us-east-2.amazonaws.com/logo/logo+miracle.png" alt="Miracle" className="ms-logo-img" />
            </div>

            {/* Categories (desktop) */}
            <div className="ms-nav-cats">
              {['todos', 'productos', 'servicios'].map((key) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1)
                return (
                  <button
                    key={key}
                    type="button"
                    className={`ms-cat${filtro === key ? ' on' : ''}`}
                    onClick={() => setFiltro(key)}
                  >
                    {label}
                    <span className="ms-cat-cnt">{counts[key]}</span>
                  </button>
                )
              })}
            </div>

            {/* Right: search */}
            <div className="ms-nav-right">
              <div className="ms-search-wrap">
                <svg className="ms-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="ms-search-input"
                  placeholder="Buscar..."
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

        {/* Mobile categories */}
        <div className="ms-mobile-cats">
          {['todos', 'productos', 'servicios'].map((key) => (
            <button
              key={key}
              type="button"
              className={`ms-cat${filtro === key ? ' on' : ''}`}
              onClick={() => setFiltro(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="ms-cat-cnt">{counts[key]}</span>
            </button>
          ))}
        </div>

        {/* ── HERO ── */}
        <section className="ms-hero">
          <div className="ms-hero-inner">
            <div className="ms-hero-left">
              <p className="ms-hero-sup">Tienda Oficial</p>
              <h1 className="ms-hero-title">
                Miracle <em>Store</em>
              </h1>
              <p className="ms-hero-sub">
                Servicios y productos de marketing digital para escalar tu negocio.
              </p>
            </div>
            {!loading && (
              <div className="ms-hero-stats">
                <div className="ms-stat">
                  <span className="ms-stat-num">{productos.length}</span>
                  <span className="ms-stat-lbl">Ítems</span>
                </div>
                <div className="ms-stat">
                  <span className="ms-stat-num">{enStock}</span>
                  <span className="ms-stat-lbl">En stock</span>
                </div>
                <div className="ms-stat">
                  <span className="ms-stat-num">{counts.servicios}</span>
                  <span className="ms-stat-lbl">Servicios</span>
                </div>
              </div>
            )}
          </div>
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
                <span className="ms-empty-symbol">∅</span>
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
            <div className="ms-logo">
              <img src="https://miracle-store.s3.us-east-2.amazonaws.com/logo/logo+miracle.png" alt="Miracle" className="ms-logo-img" style={{ opacity: 0.45 }} />
            </div>
            <p className="ms-footer-copy">© {new Date().getFullYear()} Miracle Solutions · Todos los derechos reservados</p>
            <span className="ms-footer-tag">Tienda oficial</span>
          </div>
        </footer>
      </div>
    </>
  )
}
