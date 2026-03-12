import { useEffect, useMemo, useRef, useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, authApi } from '../utils/api'

const ACCENT = '#F59E0B'

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'T'
  return name.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function ProductCard({ producto, accent }) {
  const [hov, setHov] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const touchX = useRef(null)
  const totalImgs = Math.max(producto.imagenes?.length || 1, 1)
  const isProducto = producto.tipo === 'producto'
  const inStock = isProducto && producto.stock != null && producto.stock > 0
  const sinStock = isProducto && producto.stock != null && producto.stock <= 0
  const stockBajo = isProducto && producto.stock != null && producto.stock > 0 && producto.stock <= 5

  const imgSrc = getProductoImagenSrc(producto, imgIndex)
  const nombre = producto.nombre || 'Sin nombre'
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
      `${window.location.origin}/landing-producto/${producto.id}?estilo=moderno`,
      '_blank',
      'noopener,noreferrer',
    )

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={ir}
      onKeyDown={(e) => e.key === 'Enter' && ir()}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${hov ? accent + '55' : '#1a1a1a'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hov
          ? `0 32px 64px rgba(0,0,0,.7), 0 0 0 1px ${accent}22, 0 0 60px ${accent}10`
          : '0 2px 16px rgba(0,0,0,.5)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Imagen con ratio fijo */}
      <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#0a0a0a' }}>
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
                transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)',
                transform: hov ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, #111 0%, ${accent}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '800',
                color: accent + '80',
                fontFamily: "'Syne', sans-serif",
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
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                  border: `1px solid ${accent}40`, color: accent,
                  fontSize: '16px', lineHeight: 1, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hov ? 1 : 0.5, transition: 'opacity 0.2s ease',
                  zIndex: 3,
                }}
              >‹</button>
              <button
                type="button"
                onClick={goNext}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                  border: `1px solid ${accent}40`, color: accent,
                  fontSize: '16px', lineHeight: 1, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hov ? 1 : 0.5, transition: 'opacity 0.2s ease',
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
                      background: i === imgIndex ? accent : 'rgba(255,255,255,0.3)',
                      border: 'none', padding: 0, cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {/* Overlay gradiente abajo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: hov
                ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
              transition: 'background 0.35s ease',
            }}
          />
          {/* Badge tipo */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: accent,
              background: '#000000cc',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${accent}33`,
              borderRadius: '6px',
              padding: '4px 8px',
            }}
          >
            {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
          </div>
          {/* Badge stock bajo */}
          {stockBajo && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: '9px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                color: '#fff',
                background: '#ef4444cc',
                backdropFilter: 'blur(8px)',
                borderRadius: '6px',
                padding: '4px 8px',
              }}
            >
              ¡Últimas {producto.stock}!
            </div>
          )}
          {/* Precio overlay en hover */}
          {hov && (
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                fontSize: '22px',
                fontWeight: '900',
                color: accent,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {formatPrecio(producto.precio)}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="tm-card-body" style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: '800',
            color: '#f0f0f0',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.25,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {nombre}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: '#444',
            lineHeight: 1.7,
            flex: 1,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {producto.descripcion || 'Sin descripción.'}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            paddingTop: '14px',
            borderTop: '1px solid #1a1a1a',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: '900',
              color: accent,
              letterSpacing: '-0.03em',
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1,
            }}
          >
            {formatPrecio(producto.precio)}
          </span>
          {isProducto && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                color: sinStock ? '#ef4444' : inStock ? '#4ade80' : '#4ade80',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: sinStock ? '#ef4444' : '#4ade80',
                  display: 'inline-block',
                  boxShadow: sinStock ? '0 0 6px #ef4444' : '0 0 6px #4ade80',
                }}
              />
              {sinStock ? 'Sin stock' : `${producto.stock} disp.`}
            </span>
          )}
        </div>

        <button
          type="button"
          className="tm-card-btn"
          onClick={(e) => { e.stopPropagation(); ir() }}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '11px',
            borderRadius: '10px',
            border: `1px solid ${hov ? accent : accent + '33'}`,
            background: hov ? accent : 'transparent',
            color: hov ? '#000' : accent,
            fontSize: '11px',
            fontWeight: '800',
            fontFamily: "'Syne', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {hov ? 'Ver producto →' : 'Ver detalle'}
        </button>
      </div>
    </div>
  )
}

export default function TiendaEstiloModerno() {
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

  const accent = ACCENT
  const tenantName = tenant?.nombre || 'Tienda'
  const words = tenantName.split(/\s+/).filter(Boolean)
  const lastWord = words[words.length - 1] || 'Tienda'
  const firstWords = words.slice(0, -1).join(' ')
  const categoria = tenant?.categoria || ''
  const enStockCount = productosActivos.filter((p) => p.tipo === 'producto' && p.stock > 0).length
  const serviciosCount = productosActivos.filter((p) => p.tipo === 'servicio').length
  const initials = getInitials(tenantName)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .tm-root {
          min-height: 100vh;
          background: #080808;
          color: #f0f0f0;
          font-family: 'Inter', sans-serif;
        }
        .tm-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .tm-glow {
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse, ${ACCENT}08 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .tm-content { position: relative; z-index: 1; }
        .tm-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 48px 0;
        }
        .tm-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 40px;
          border-bottom: 1px solid #141414;
        }
        .tm-logo {
          width: 72px; height: 72px;
          border-radius: 14px;
          background: ${ACCENT}15;
          border: 1px solid ${ACCENT}30;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800;
          color: ${ACCENT};
          font-family: 'Syne', sans-serif;
          overflow: hidden;
          flex-shrink: 0;
        }
        .tm-brand { display: flex; align-items: center; gap: 16px; }
        .tm-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #444;
        }
        .tm-slogan {
          margin-top: 4px;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.04em;
          color: ${ACCENT}70;
          font-style: italic;
          font-family: 'Inter', sans-serif;
        }
        .tm-tag {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #222;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          padding: 5px 12px;
        }
        .tm-hero {
          padding: 64px 0 0;
        }
        .tm-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: ${ACCENT};
          margin-bottom: 20px;
        }
        .tm-eyebrow::before {
          content: ''; width: 24px; height: 1.5px;
          background: ${ACCENT}; border-radius: 1px;
        }
        .tm-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(56px, 9vw, 120px);
          font-weight: 800; line-height: 0.88;
          letter-spacing: -0.04em;
          color: #fff; margin: 0;
        }
        .tm-title em { font-style: normal; color: ${ACCENT}; }
        .tm-hero-bottom {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 32px;
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid #141414;
        }
        .tm-desc {
          font-size: 14px; font-weight: 300;
          color: #444; line-height: 1.8;
          max-width: 440px;
        }
        .tm-stats {
          display: flex; gap: 0; flex-shrink: 0;
        }
        .tm-stat {
          padding: 0 28px;
          border-left: 1px solid #141414;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 2px;
        }
        .tm-stat:first-child { border-left: none; padding-left: 0; }
        .tm-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 800;
          color: ${ACCENT}; line-height: 1;
          letter-spacing: -0.04em;
        }
        .tm-stat-lbl {
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #222; text-align: right;
        }
        .tm-catalog-header {
          max-width: 1280px; margin: 56px auto 0;
          padding: 0 48px;
          display: flex; align-items: center; gap: 20px;
        }
        .tm-catalog-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #222; white-space: nowrap;
        }
        .tm-catalog-line { flex: 1; height: 1px; background: #141414; }
        .tm-filters { display: flex; gap: 6px; flex-shrink: 0; }
        .tm-filter-btn {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 8px; padding: 6px 14px;
          border: 1px solid #1a1a1a;
          cursor: pointer; transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .tm-filter-btn.active {
          background: ${ACCENT};
          color: #000;
          border-color: ${ACCENT};
        }
        .tm-filter-btn:not(.active) {
          background: transparent;
          color: #333;
        }
        .tm-filter-btn:not(.active):hover {
          border-color: #333; color: #666;
        }
        .tm-catalog {
          max-width: 1280px; margin: 28px auto 0;
          padding: 0 48px 96px;
        }
        .tm-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .tm-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 24px;
          color: #1a1a1a;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          border: 1px dashed #1a1a1a;
          border-radius: 16px;
        }
        @media (max-width: 1024px) {
          .tm-grid { grid-template-columns: repeat(2, 1fr); }
          .tm-header, .tm-catalog-header, .tm-catalog { padding-left: 28px; padding-right: 28px; }
          .tm-title { font-size: 72px; }
        }
        @media (max-width: 768px) {
          .tm-header, .tm-catalog-header, .tm-catalog { padding-left: 20px; padding-right: 20px; }
          .tm-header { padding-top: 28px; }
          .tm-topbar { flex-direction: column; align-items: flex-start; gap: 16px; padding-bottom: 28px; }
          .tm-logo { width: 60px; height: 60px; font-size: 20px; border-radius: 12px; }
          .tm-brand { gap: 12px; }
          .tm-tag { display: none; }
          .tm-hero { padding-top: 40px; }
          .tm-title { font-size: 52px; }
          .tm-hero-bottom { grid-template-columns: 1fr; gap: 20px; margin-top: 24px; padding-top: 20px; }
          .tm-stats { justify-content: flex-start; gap: 0; }
          .tm-stat { align-items: flex-start; padding: 0 20px; }
          .tm-stat:first-child { padding-left: 0; }
          .tm-stat-val { font-size: 26px; }
          .tm-stat-lbl { text-align: left; }
          .tm-catalog-header { margin-top: 36px; gap: 14px; }
          .tm-catalog { margin-top: 18px; padding-bottom: 72px; }
          .tm-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        @media (max-width: 480px) {
          .tm-header, .tm-catalog-header, .tm-catalog { padding-left: 16px; padding-right: 16px; }
          .tm-header { padding-top: 20px; }
          .tm-logo { width: 52px; height: 52px; font-size: 18px; border-radius: 10px; }
          .tm-brand-name { font-size: 11px; letter-spacing: 0.16em; }
          .tm-slogan { font-size: 10px; }
          .tm-hero { padding-top: 28px; }
          .tm-title { font-size: 38px; letter-spacing: -0.03em; line-height: 0.9; }
          .tm-eyebrow { margin-bottom: 14px; }
          .tm-desc { font-size: 13px; line-height: 1.7; }
          .tm-stat-val { font-size: 24px; }
          .tm-stat { padding: 0 16px; }
          .tm-catalog-header { gap: 10px; flex-wrap: wrap; }
          .tm-catalog-label { font-size: 9px; }
          .tm-filters { gap: 5px; }
          .tm-filter-btn { padding: 5px 10px; font-size: 9px; }
          .tm-grid { gap: 10px; }
          .tm-catalog { padding-bottom: 56px; }
          .tm-card-body { padding: 14px 14px 16px !important; gap: 6px !important; }
          .tm-card-btn { padding: 9px !important; font-size: 10px !important; margin-top: 6px !important; }
        }
        @media (max-width: 360px) {
          .tm-title { font-size: 32px; }
          .tm-grid { grid-template-columns: 1fr; gap: 12px; }
          .tm-stat { padding: 0 12px; }
          .tm-card-body { padding: 12px !important; }
        }
      `}</style>

      <div className="tm-root">
        <div className="tm-noise" />
        <div className="tm-glow" />
        <div className="tm-content">
          <div className="tm-header">
            <div className="tm-topbar">
              <div className="tm-brand">
                <div className="tm-logo">
                  {tenant?.logoUrl
                    ? <img src={tenant.logoUrl} alt={tenantName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials}
                </div>
                <div>
                  <div className="tm-brand-name">{tenantName}</div>
                  {tenant?.eslogan && <div className="tm-slogan">{tenant.eslogan}</div>}
                </div>
                {categoria && (
                  <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT + '80', border: `1px solid ${ACCENT}20`, borderRadius: '6px', padding: '4px 10px' }}>
                    {categoria}
                  </span>
                )}
              </div>
              <span className="tm-tag">Tienda oficial</span>
            </div>

            <div className="tm-hero">
              <div className="tm-eyebrow">Catálogo</div>
              <h1 className="tm-title">
                {firstWords && <span>{firstWords} </span>}
                <em>{lastWord}</em>
              </h1>
              <div className="tm-hero-bottom">
                <div className="tm-desc">
                  {tenant?.descripcion || 'Explora nuestra colección y encuentra lo que necesitas.'}
                </div>
                <div className="tm-stats">
                  <div className="tm-stat">
                    <span className="tm-stat-val">{productosActivos.length}</span>
                    <span className="tm-stat-lbl">Items</span>
                  </div>
                  <div className="tm-stat">
                    <span className="tm-stat-val">{enStockCount}</span>
                    <span className="tm-stat-lbl">En stock</span>
                  </div>
                  <div className="tm-stat">
                    <span className="tm-stat-val">{serviciosCount}</span>
                    <span className="tm-stat-lbl">Servicios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-catalog-header">
            <span className="tm-catalog-label">Explorar</span>
            <div className="tm-catalog-line" />
            <div className="tm-filters">
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'productos', label: 'Productos' },
                { key: 'servicios', label: 'Servicios' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`tm-filter-btn${filtro === key ? ' active' : ''}`}
                  onClick={() => setFiltro(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="tm-catalog">
            {productosFiltrados.length === 0 ? (
              <div className="tm-grid">
                <div className="tm-empty">Sin productos disponibles.</div>
              </div>
            ) : (
              <div className="tm-grid">
                {productosFiltrados.map((p) => (
                  <ProductCard key={p.id} producto={p} accent={ACCENT} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
