import { useEffect, useMemo, useRef, useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, authApi } from '../utils/api'

const ACCENT = '#8aad7a'
const ACCENT_DARK = '#6a9a5a'

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

function getInitials(name = '') {
  const s = String(name).trim()
  if (!s) return 'T'
  return s.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function ProductCard({ p }) {
  const [hov, setHov] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const touchX = useRef(null)
  const totalImgs = Math.max(p.imagenes?.length || 1, 1)
  const imgSrc = getProductoImagenSrc(p, imgIndex)
  const isProducto = p.tipo === 'producto'
  const inStock = isProducto && p.stock != null && p.stock > 0
  const sinStock = isProducto && p.stock != null && p.stock <= 0
  const stockBajo = isProducto && p.stock != null && p.stock > 0 && p.stock <= 5
  const nombre = p.nombre || 'Sin nombre'
  const initials = getInitials(nombre)

  const goNext = (e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % totalImgs) }
  const goPrev = (e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + totalImgs) % totalImgs) }
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const d = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(d) > 40) { if (d < 0) goNext(e); else goPrev(e) }
    touchX.current = null
  }

  const ir = () =>
    window.open(
      `${window.location.origin}/landing-producto/${p.id}?estilo=clasico`,
      '_blank',
      'noopener,noreferrer',
    )

  return (
    <article
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={ir}
      onKeyDown={(e) => e.key === 'Enter' && ir()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#0f100e',
        border: `1px solid ${hov ? '#3a4a35' : '#1a1e16'}`,
        borderRadius: '2px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov
          ? `0 24px 56px rgba(0,0,0,0.6), 0 0 0 1px #3a4a3530`
          : '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Imagen en ratio portrait 3:4 */}
      <div style={{ position: 'relative', paddingBottom: '133%', overflow: 'hidden', background: '#0a0b09' }}>
        <div
          style={{ position: 'absolute', inset: 0 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease, filter 0.4s ease',
                transform: hov ? 'scale(1.06)' : 'scale(1)',
                filter: hov ? 'brightness(0.85)' : 'brightness(0.75) grayscale(15%)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(145deg, #111310 0%, #1a2016 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Playfair Display', serif",
                fontSize: '32px',
                fontWeight: '700',
                color: ACCENT + '50',
              }}
            >
              {initials}
            </div>
          )}
          {/* Flechas carrusel */}
          {totalImgs > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                style={{
                  position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(10,11,9,0.7)', backdropFilter: 'blur(6px)',
                  border: `1px solid ${ACCENT}30`, color: ACCENT,
                  fontSize: '16px', lineHeight: 1, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hov ? 1 : 0.6, transition: 'opacity 0.2s ease',
                  zIndex: 3,
                }}
              >‹</button>
              <button
                type="button"
                onClick={goNext}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(10,11,9,0.7)', backdropFilter: 'blur(6px)',
                  border: `1px solid ${ACCENT}30`, color: ACCENT,
                  fontSize: '16px', lineHeight: 1, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hov ? 1 : 0.6, transition: 'opacity 0.2s ease',
                  zIndex: 3,
                }}
              >›</button>
              {/* Dots */}
              <div style={{
                position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 5, zIndex: 3,
              }}>
                {Array.from({ length: totalImgs }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImgIndex(i) }}
                    style={{
                      width: i === imgIndex ? 18 : 6, height: 6, borderRadius: 3,
                      background: i === imgIndex ? ACCENT : 'rgba(255,255,255,0.35)',
                      border: 'none', padding: 0, cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Overlay base */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: hov
                ? 'linear-gradient(to top, rgba(10,11,9,0.85) 0%, rgba(10,11,9,0.2) 50%, transparent 100%)'
                : 'linear-gradient(to top, rgba(10,11,9,0.7) 0%, transparent 60%)',
              transition: 'all 0.4s ease',
            }}
          />

          {/* Badge tipo arriba izq */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontSize: '8px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: ACCENT,
              background: 'rgba(10,11,9,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${ACCENT}30`,
              padding: '4px 9px',
            }}
          >
            {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
          </div>

          {/* Badge stock bajo */}
          {stockBajo && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                fontSize: '8px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                color: '#fff',
                background: 'rgba(180,50,50,0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 9px',
              }}
            >
              Últimas {p.stock}
            </div>
          )}

          {/* Precio flotante abajo en hover */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 16,
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              fontWeight: '700',
              color: ACCENT,
              lineHeight: 1,
              opacity: hov ? 1 : 0,
              transform: hov ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.3s ease',
            }}
          >
            {p.precio != null ? formatPrecio(p.precio) : ''}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="tc-card-body"
        style={{
          padding: '20px 22px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          borderTop: `1px solid ${hov ? '#2a3526' : '#1a1e16'}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '17px',
            fontWeight: '600',
            color: '#e8e4dc',
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {nombre}
        </h2>

        {p.precio != null && (
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '16px',
              fontWeight: '700',
              color: ACCENT,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              margin: '2px 0 0',
            }}
          >
            {formatPrecio(p.precio)}
          </p>
        )}

        <p
          style={{
            fontSize: '12px',
            fontWeight: '300',
            color: '#3a3a2a',
            lineHeight: 1.75,
            flex: 1,
            margin: '4px 0 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {p.descripcion || 'Sin descripción.'}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px solid #1a1e16',
          }}
        >
          {isProducto ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                color: sinStock ? '#8a4a3a' : '#6a8a5a',
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: sinStock ? '#8a4a3a' : '#6a8a5a',
                  display: 'inline-block',
                }}
              />
              {sinStock ? 'Sin stock' : `${p.stock} disponibles`}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            className="tc-card-btn"
            onClick={(e) => { e.stopPropagation(); ir() }}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: hov ? '#0a0b09' : '#e8e4dc',
              background: hov ? ACCENT : 'transparent',
              border: `1px solid ${hov ? ACCENT : '#2a2e24'}`,
              padding: '7px 16px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  )
}

export default function TiendaEstiloClasico() {
  const { productos } = useProductos()
  const [tenant, setTenant] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    let cancelled = false
    authApi.obtenerPerfil().then((data) => {
      if (!cancelled && data?.tenant) setTenant(data.tenant)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  const productosFiltrados = useMemo(() => {
    if (filtro === 'productos') return productosActivos.filter((p) => p.tipo === 'producto')
    if (filtro === 'servicios') return productosActivos.filter((p) => p.tipo === 'servicio')
    return productosActivos
  }, [productosActivos, filtro])

  const nombre = tenant?.nombre || 'Tienda'
  const words = nombre.split(' ').filter(Boolean)
  const lastWord = words[words.length - 1] || 'Tienda'
  const firstWords = words.slice(0, -1).join(' ')
  const initials = getInitials(nombre)
  const logoUrl = tenant?.logoUrl
  const slogan = tenant?.eslogan || ''
  const descripcion = tenant?.descripcion || ''
  const categoria = tenant?.categoria || ''
  const enStockCount = productosActivos.filter((p) => p.tipo === 'producto' && p.stock > 0).length
  const serviciosCount = productosActivos.filter((p) => p.tipo === 'servicio').length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;600;700&display=swap');

        .tc-root {
          min-height: 100vh;
          background: #0a0b09;
          color: #e8e4dc;
          font-family: 'Lato', sans-serif;
        }
        .tc-header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 56px;
          border-bottom: 1px solid #161814;
        }
        .tc-topbar {
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }
        .tc-logo {
          width: 92px; height: 92px;
          border-radius: 4px;
          background: #151910;
          border: 1px solid #2a3525;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: ${ACCENT};
          overflow: hidden; flex-shrink: 0;
        }
        .tc-brand {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          padding-top: 4px;
        }
        .tc-brand-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 2.8vw, 34px);
          font-weight: 700; line-height: 1.05;
          letter-spacing: -0.015em;
          color: #e8e4dc; margin: 0;
        }
        .tc-brand-title .accent { color: ${ACCENT}; font-style: italic; }
        .tc-brand-slogan {
          font-family: 'Playfair Display', serif;
          font-size: 13px; font-weight: 400; font-style: italic;
          color: ${ACCENT}80;
          letter-spacing: 0.02em;
          margin: 0;
        }
        .tc-brand-cat {
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: ${ACCENT}70;
          border: 1px solid #2a3525;
          padding: 3px 10px;
          display: inline-block;
          width: fit-content;
        }
        .tc-desc {
          font-size: 13px; font-weight: 300;
          color: #3a3a2a; line-height: 1.8;
          letter-spacing: 0.01em; max-width: 540px;
          margin: 4px 0 0;
        }
        .tc-topbar-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
          flex-shrink: 0;
          padding-top: 4px;
        }
        .tc-tag {
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #2a2e24;
        }
        .tc-stats { display: flex; gap: 0; }
        .tc-stat {
          padding: 0 20px;
          border-left: 1px solid #161814;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 3px;
        }
        .tc-stat:first-child { border-left: none; padding-left: 0; }
        .tc-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #e8e4dc; line-height: 1;
        }
        .tc-stat-lbl {
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #252820; text-align: right;
        }
        .tc-catalog-header {
          max-width: 1200px; margin: 32px auto 0;
          padding: 0 56px;
          display: flex; align-items: center; gap: 20px;
        }
        .tc-catalog-label {
          font-family: 'Playfair Display', serif;
          font-size: 12px; font-style: italic;
          color: #2a2e24; white-space: nowrap;
        }
        .tc-catalog-line { flex: 1; height: 1px; background: #161814; }
        .tc-filters { display: flex; gap: 6px; }
        .tc-filter-btn {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 6px 14px;
          border: 1px solid #1e2218;
          cursor: pointer; transition: all 0.25s ease;
          font-family: 'Lato', sans-serif;
          background: transparent;
        }
        .tc-filter-btn.active {
          background: ${ACCENT};
          color: #0a0b09;
          border-color: ${ACCENT};
        }
        .tc-filter-btn:not(.active) { color: #2a2e24; }
        .tc-filter-btn:not(.active):hover { border-color: #2a3526; color: #4a5240; }
        .tc-catalog {
          max-width: 1200px; margin: 28px auto 0;
          padding: 0 56px 96px;
        }
        .tc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .tc-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 24px;
          color: #1e2218;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 18px;
          border: 1px solid #161814;
        }
        @media (max-width: 1024px) {
          .tc-grid { grid-template-columns: repeat(2, 1fr); }
          .tc-header, .tc-catalog-header, .tc-catalog { padding-left: 28px; padding-right: 28px; }
          .tc-hero-bottom { grid-template-columns: 1fr; gap: 28px; }
          .tc-stats { justify-content: flex-start; }
          .tc-title { font-size: 68px; }
        }
        @media (max-width: 768px) {
          .tc-header, .tc-catalog-header, .tc-catalog { padding-left: 20px; padding-right: 20px; }
          .tc-header { padding-top: 22px; padding-bottom: 22px; }
          .tc-logo { width: 74px; height: 74px; font-size: 22px; }
          .tc-tag { display: none; }
          .tc-topbar-right { gap: 10px; }
          .tc-stat { padding: 0 16px; }
          .tc-stat-val { font-size: 22px; }
          .tc-stat-lbl { text-align: right; }
          .tc-brand-title { font-size: 26px; }
          .tc-catalog-header { margin-top: 24px; gap: 14px; }
          .tc-catalog { margin-top: 16px; padding-bottom: 64px; }
          .tc-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 600px) {
          .tc-topbar { flex-wrap: wrap; gap: 16px; }
          .tc-topbar-right { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; }
          .tc-stat { padding: 0 14px; align-items: flex-start; }
          .tc-stat-lbl { text-align: left; }
          .tc-brand-title { font-size: 22px; }
        }
        @media (max-width: 480px) {
          .tc-header, .tc-catalog-header, .tc-catalog { padding-left: 16px; padding-right: 16px; }
          .tc-header { padding-top: 18px; padding-bottom: 18px; }
          .tc-logo { width: 60px; height: 60px; font-size: 18px; }
          .tc-topbar { gap: 12px; }
          .tc-brand-title { font-size: 20px; }
          .tc-brand-slogan { font-size: 11px; }
          .tc-brand-cat { font-size: 8px; padding: 2px 8px; }
          .tc-desc { font-size: 12px; }
          .tc-stat-val { font-size: 20px; }
          .tc-stat-lbl { font-size: 7px; }
          .tc-stat { padding: 0 10px; }
          .tc-catalog-header { gap: 10px; }
          .tc-catalog-label { font-size: 10px; }
          .tc-filters { gap: 5px; }
          .tc-filter-btn { padding: 5px 10px; font-size: 8px; letter-spacing: 0.14em; }
          .tc-grid { gap: 10px; }
          .tc-catalog { padding-bottom: 56px; }
          .tc-card-body { padding: 14px 14px 16px !important; gap: 4px !important; }
          .tc-card-btn { padding: 6px 12px !important; font-size: 8px !important; }
        }
        @media (max-width: 360px) {
          .tc-grid { grid-template-columns: 1fr; gap: 12px; }
          .tc-stat { padding: 0 8px; }
          .tc-card-body { padding: 12px !important; }
        }
      `}</style>

      <div className="tc-root">
        <div className="tc-header">
          <div className="tc-topbar">
            <div className="tc-logo">
              {logoUrl
                ? <img src={logoUrl} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <div className="tc-brand">
              <h1 className="tc-brand-title">
                {firstWords && <span>{firstWords} </span>}
                <span className="accent">{lastWord}</span>
              </h1>
              {slogan && <p className="tc-brand-slogan">{slogan}</p>}
              {categoria && <span className="tc-brand-cat">{categoria}</span>}
              {descripcion && <p className="tc-desc">{descripcion}</p>}
            </div>
            <div className="tc-topbar-right">
              <span className="tc-tag">Tienda oficial</span>
              <div className="tc-stats">
                <div className="tc-stat">
                  <span className="tc-stat-val">{productosActivos.length}</span>
                  <span className="tc-stat-lbl">Productos</span>
                </div>
                <div className="tc-stat">
                  <span className="tc-stat-val">{enStockCount}</span>
                  <span className="tc-stat-lbl">En stock</span>
                </div>
                <div className="tc-stat">
                  <span className="tc-stat-val">{serviciosCount}</span>
                  <span className="tc-stat-lbl">Servicios</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tc-catalog-header">
          <span className="tc-catalog-label">Catálogo</span>
          <div className="tc-catalog-line" />
          <div className="tc-filters">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'productos', label: 'Productos' },
              { key: 'servicios', label: 'Servicios' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`tc-filter-btn${filtro === key ? ' active' : ''}`}
                onClick={() => setFiltro(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="tc-catalog">
          {productosFiltrados.length === 0 ? (
            <div className="tc-grid">
              <p className="tc-empty">Sin productos disponibles.</p>
            </div>
          ) : (
            <div className="tc-grid">
              {productosFiltrados.map((p) => <ProductCard key={p.id} p={p} />)
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}
