import { useEffect, useMemo, useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, authApi } from '../utils/api'

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

function getInitials(name = '') {
  const s = String(name).trim()
  if (!s) return 'T'
  return s.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

/* ─── ESTILOS GLOBALES ─────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');

  .tc-root {
    min-height: 100vh;
    background: #0e0f0d;
    color: #e8e4dc;
    font-family: 'Lato', sans-serif;
  }

  .tc-hero {
    max-width: 1140px;
    margin: 0 auto;
    padding: 72px 48px 0;
  }

  .tc-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 56px;
  }

  .tc-logo-area {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .tc-logo-img {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #3a4a35;
  }

  .tc-logo-initials {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: #1e2a1a;
    border: 1px solid #3a4a35;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #8aad7a;
    flex-shrink: 0;
  }

  .tc-brand-name {
    font-family: 'Lato', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #8aad7a;
  }

  .tc-nav-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #4a5240;
  }

  .tc-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(56px, 9vw, 108px);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: #e8e4dc;
    margin: 0 0 0;
  }

  .tc-headline span.accent {
    color: #8aad7a;
    font-style: italic;
  }

  .tc-mid {
    display: grid;
    grid-template-columns: 1fr 380px;
    align-items: end;
    gap: 48px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid #1e2018;
  }

  .tc-slogan {
    font-size: 14px;
    font-weight: 300;
    color: #7a7a6a;
    line-height: 1.8;
    letter-spacing: 0.01em;
    max-width: 480px;
  }

  .tc-stats-row {
    display: flex;
    gap: 0;
    justify-content: flex-end;
  }

  .tc-stat {
    padding: 0 28px;
    border-left: 1px solid #1e2018;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  .tc-stat:first-child { border-left: none; padding-left: 0; }

  .tc-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #e8e4dc;
    line-height: 1;
  }

  .tc-stat-lbl {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #3a3a2a;
  }

  .tc-sep {
    max-width: 1140px;
    margin: 52px auto 0;
    padding: 0 48px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .tc-sep-lbl {
    font-family: 'Playfair Display', serif;
    font-size: 12px;
    font-style: italic;
    color: #3a3a2a;
    white-space: nowrap;
  }

  .tc-sep-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #1e2018, #111);
  }

  .tc-sep-count {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #3a3a2a;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .tc-catalog {
    max-width: 1140px;
    margin: 0 auto;
    padding: 32px 48px 96px;
  }

  .tc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .tc-card {
    display: flex;
    flex-direction: column;
    background: #111210;
    border: 1px solid #1c1e18;
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .tc-card:hover {
    border-color: #3a4a35;
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px #3a4a3540;
  }

  .tc-card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    filter: grayscale(20%) brightness(0.9);
    transition: filter 0.4s ease;
  }

  .tc-card:hover .tc-card-img {
    filter: grayscale(0%) brightness(1);
  }

  .tc-card-img-placeholder {
    height: 200px;
    background: linear-gradient(145deg, #141612 0%, #1a2016 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .tc-card-img-placeholder::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, #8aad7a08 0%, transparent 70%);
  }

  .tc-card-placeholder-initials {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #8aad7a;
    opacity: 0.6;
    position: relative;
    z-index: 1;
  }

  .tc-card-body {
    padding: 22px 24px 26px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .tc-card-tipo {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #8aad7a;
  }

  .tc-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: #e8e4dc;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin: 0;
  }

  .tc-card-price {
    font-family: 'Lato', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #8aad7a;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 4px 0 0;
  }

  .tc-card-desc {
    font-size: 12.5px;
    color: #4a4a3a;
    line-height: 1.7;
    flex: 1;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tc-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid #1c1e18;
  }

  .tc-card-stock {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .tc-card-stock-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .tc-card-btn {
    font-family: 'Lato', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #e8e4dc;
    background: transparent;
    border: 1px solid #2a2e24;
    border-radius: 2px;
    padding: 7px 16px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .tc-card-btn:hover {
    background: #8aad7a;
    border-color: #8aad7a;
    color: #0e0f0d;
  }

  .tc-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 24px;
    color: #3a3a2a;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 18px;
  }

  @media (max-width: 900px) {
    .tc-grid { grid-template-columns: repeat(2, 1fr); }
    .tc-hero, .tc-sep, .tc-catalog { padding-left: 24px; padding-right: 24px; }
    .tc-mid { grid-template-columns: 1fr; gap: 24px; }
    .tc-stats-row { justify-content: flex-start; }
    .tc-headline { font-size: 60px; }
  }

  @media (max-width: 560px) {
    .tc-grid { grid-template-columns: 1fr; }
    .tc-headline { font-size: 44px; }
    .tc-top-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
`

function ProductCard({ p }) {
  const imgSrc = getProductoImagenSrc(p, 0)
  const isProducto = p.tipo === 'producto'
  const inStock = isProducto && p.stock != null && p.stock > 0
  const nombre = p.nombre || 'Sin nombre'
  const initials = getInitials(nombre)

  return (
    <article
      className="tc-card"
      role="button"
      tabIndex={0}
      onClick={() =>
        window.open(
          `${window.location.origin}/landing-producto/${p.id}`,
          '_blank',
          'noopener,noreferrer',
        )
      }
      onKeyDown={(e) =>
        e.key === 'Enter' &&
        window.open(
          `${window.location.origin}/landing-producto/${p.id}`,
          '_blank',
          'noopener,noreferrer',
        )
      }
    >
      {imgSrc ? (
        <img src={imgSrc} alt={nombre} className="tc-card-img" />
      ) : (
        <div className="tc-card-img-placeholder">
          <span className="tc-card-placeholder-initials">{initials}</span>
        </div>
      )}

      <div className="tc-card-body">
        <span className="tc-card-tipo">
          {p.tipo === 'servicio' ? 'Servicio' : 'Producto'}
        </span>
        <h2 className="tc-card-name">{nombre}</h2>
        {p.precio != null && (
          <p className="tc-card-price">{formatPrecio(p.precio)}</p>
        )}
        <p className="tc-card-desc">{p.descripcion || 'Sin descripción.'}</p>

        <div className="tc-card-footer">
          {isProducto && (
            <span
              className="tc-card-stock"
              style={{ color: inStock ? '#6a8f5a' : '#8a4a3a' }}
            >
              <span
                className="tc-card-stock-dot"
                style={{ background: inStock ? '#6a8f5a' : '#8a4a3a' }}
              />
              {inStock ? `${p.stock} disp.` : 'Sin stock'}
            </span>
          )}
          {!isProducto && <span />}
          <button
            type="button"
            className="tc-card-btn"
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `${window.location.origin}/landing-producto/${p.id}`,
                '_blank',
                'noopener,noreferrer',
              )
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

  useEffect(() => {
    let cancelled = false
    authApi
      .obtenerPerfil()
      .then((data) => {
        if (cancelled) return
        if (data?.tenant) setTenant(data.tenant)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const productosActivos = useMemo(
    () => productos.filter((p) => p.estado === 'activo'),
    [productos],
  )

  const nombre = tenant?.nombre || 'Tienda'
  const words = nombre.split(' ').filter(Boolean)
  const lastWord = words[words.length - 1] || 'Tienda'
  const firstWords = words.slice(0, -1).join(' ')
  const initials = getInitials(nombre)
  const logoUrl = tenant?.logoUrl
  const slogan = tenant?.eslogan || ''
  const descripcion = tenant?.descripcion || ''
  const enStockCount = productosActivos.filter(
    (p) => p.tipo === 'producto' && p.stock != null && p.stock > 0,
  ).length

  return (
    <>
      <style>{STYLES}</style>

      <div className="tc-root">
        <div className="tc-hero">
          <div className="tc-top-bar">
            <div className="tc-logo-area">
              {logoUrl ? (
                <img src={logoUrl} alt={nombre} className="tc-logo-img" />
              ) : (
                <div className="tc-logo-initials">{initials}</div>
              )}
              <span className="tc-brand-name">{nombre}</span>
            </div>
            <span className="tc-nav-tag">Tienda oficial</span>
          </div>

          <h1 className="tc-headline">
            {firstWords && <>{firstWords}<br /></>}
            <span className="accent">{lastWord}</span>
          </h1>

          <div className="tc-mid">
            <p className="tc-slogan">
              {descripcion || slogan || 'Bienvenido a nuestra tienda.'}
            </p>
            <div className="tc-stats-row">
              <div className="tc-stat">
                <span className="tc-stat-val">{productosActivos.length}</span>
                <span className="tc-stat-lbl">Productos</span>
              </div>
              <div className="tc-stat">
                <span className="tc-stat-val">{enStockCount}</span>
                <span className="tc-stat-lbl">En stock</span>
              </div>
              <div className="tc-stat">
                <span className="tc-stat-val">
                  {productosActivos.filter(p => p.tipo === 'servicio').length}
                </span>
                <span className="tc-stat-lbl">Servicios</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tc-sep">
          <span className="tc-sep-lbl">Catálogo</span>
          <div className="tc-sep-line" />
          <span className="tc-sep-count">{productosActivos.length} items</span>
        </div>

        <div className="tc-catalog">
          <div className="tc-grid">
            {productos.length === 0 || productosActivos.length === 0 ? (
              <p className="tc-empty">
                {productos.length === 0
                  ? 'Aún no hay productos en la tienda.'
                  : 'No hay productos activos por el momento.'}
              </p>
            ) : (
              productosActivos.map((p) => <ProductCard key={p.id} p={p} />)
            )}
          </div>
        </div>
      </div>
    </>
  )
}
