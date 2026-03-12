import { useEffect, useMemo, useState } from 'react'
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
  const imgSrc = getProductoImagenSrc(p, 0)
  const isProducto = p.tipo === 'producto'
  const inStock = isProducto && p.stock != null && p.stock > 0
  const sinStock = isProducto && p.stock != null && p.stock <= 0
  const stockBajo = isProducto && p.stock != null && p.stock > 0 && p.stock <= 5
  const nombre = p.nombre || 'Sin nombre'
  const initials = getInitials(nombre)

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
        <div style={{ position: 'absolute', inset: 0 }}>
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
          padding: 48px 56px 0;
        }
        .tc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 48px;
          border-bottom: 1px solid #161814;
        }
        .tc-logo-area { display: flex; align-items: center; gap: 16px; }
        .tc-logo {
          width: 64px; height: 64px;
          border-radius: 4px;
          background: #151910;
          border: 1px solid #2a3525;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: ${ACCENT};
          overflow: hidden; flex-shrink: 0;
        }
        .tc-brand-name {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: ${ACCENT};
        }
        .tc-brand-cat {
          margin-top: 5px;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: ${ACCENT}70;
          border: 1px solid #2a3525;
          padding: 3px 10px;
          display: inline-block;
        }
        .tc-tag {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #2a2e24;
        }
        .tc-hero { padding: 60px 0 0; }
        .tc-eyebrow {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .tc-eyebrow-line { width: 32px; height: 1px; background: ${ACCENT}; }
        .tc-eyebrow-text {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: ${ACCENT};
        }
        .tc-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 8vw, 112px);
          font-weight: 700; line-height: 0.92;
          letter-spacing: -0.02em;
          color: #e8e4dc; margin: 0;
        }
        .tc-title .accent { color: ${ACCENT}; font-style: italic; }
        .tc-hero-bottom {
          display: grid;
          grid-template-columns: 1fr 360px;
          align-items: end;
          gap: 48px;
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid #161814;
        }
        .tc-desc {
          font-size: 14px; font-weight: 300;
          color: #4a4a3a; line-height: 1.85;
          letter-spacing: 0.01em; max-width: 440px;
        }
        .tc-stats { display: flex; justify-content: flex-end; gap: 0; }
        .tc-stat {
          padding: 0 28px;
          border-left: 1px solid #161814;
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
        }
        .tc-stat:first-child { border-left: none; padding-left: 0; }
        .tc-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 700;
          color: #e8e4dc; line-height: 1;
        }
        .tc-stat-lbl {
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #252820;
        }
        .tc-catalog-header {
          max-width: 1200px; margin: 60px auto 0;
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
          .tc-header, .tc-catalog-header, .tc-catalog { padding-left: 24px; padding-right: 24px; }
          .tc-hero-bottom { grid-template-columns: 1fr; }
          .tc-stats { justify-content: flex-start; }
          .tc-title { font-size: 60px; }
        }
        @media (max-width: 640px) {
          .tc-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .tc-title { font-size: 42px; }
          .tc-topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
        @media (max-width: 400px) {
          .tc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="tc-root">
        <div className="tc-header">
          <div className="tc-topbar">
            <div className="tc-logo-area">
              <div className="tc-logo">
                {logoUrl
                  ? <img src={logoUrl} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
              <div>
                <div className="tc-brand-name">{nombre}</div>
                {categoria && <div className="tc-brand-cat">{categoria}</div>}
              </div>
            </div>
            <span className="tc-tag">Tienda oficial</span>
          </div>

          <div className="tc-hero">
            <div className="tc-eyebrow">
              <div className="tc-eyebrow-line" />
              <span className="tc-eyebrow-text">Colección</span>
            </div>
            <h1 className="tc-title">
              {firstWords && <>{firstWords}<br /></>}
              <span className="accent">{lastWord}</span>
            </h1>
            <div className="tc-hero-bottom">
              <p className="tc-desc">
                {descripcion || slogan || 'Bienvenido a nuestra tienda. Explora nuestra colección cuidadosamente seleccionada.'}
              </p>
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
