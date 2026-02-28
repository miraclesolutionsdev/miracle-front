import { useEffect, useMemo, useState } from 'react'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc, authApi } from '../utils/api'

const ACCENT = '#F59E0B' // ámbar moderno

const formatPrecio = (valor) =>
  `$${(Number(valor) || 0).toLocaleString('es-CO')}`

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'T'
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function ProductCard({ producto, accent }) {
  const [hov, setHov] = useState(false)
  const isProducto = producto.tipo === 'producto'
  const inStock = isProducto && producto.stock != null && producto.stock > 0

  const imgSrc = getProductoImagenSrc(producto, 0)
  const nombre = producto.nombre || 'Sin nombre'
  const initials = getInitials(nombre)

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => window.open(`${window.location.origin}/landing-producto/${producto.id}`, '_blank', 'noopener,noreferrer')}
      onKeyDown={(e) => e.key === 'Enter' && (window.open(`${window.location.origin}/landing-producto/${producto.id}`, '_blank', 'noopener,noreferrer'))}
      style={{
        background: hov ? '#161616' : '#111',
        border: `1px solid ${hov ? accent + '44' : '#ffffff0f'}`,
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? `0 24px 48px rgba(0,0,0,.6), 0 0 40px ${accent}22` : '0 2px 12px rgba(0,0,0,.4)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '140px',
          background: `linear-gradient(135deg, #0e0e0e 0%, ${accent}12 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #ffffff08',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: hov ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: `${accent}18`,
              border: `1px solid ${accent}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '800',
              color: accent,
              transition: 'transform 0.3s ease',
              transform: hov ? 'scale(1.12)' : 'scale(1)',
            }}
          >
            {initials}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            fontSize: '10px',
            fontWeight: '700',
            color: accent + 'bb',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
        </div>
      </div>

      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#f0f0f0', letterSpacing: '-0.02em', margin: 0 }}>
          {nombre}
        </h3>
        <p style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.65, flex: 1, margin: 0 }}>
          {producto.descripcion || 'Sin descripción.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: '900', color: accent, letterSpacing: '-0.03em' }}>
            {formatPrecio(producto.precio)}
          </span>
          {isProducto && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: inStock ? '#4ade80' : '#f87171', fontWeight: '600' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: inStock ? '#4ade80' : '#f87171', display: 'inline-block' }} />
              {inStock ? `${producto.stock} disp.` : 'Sin stock'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            window.open(`${window.location.origin}/landing-producto/${producto.id}`, '_blank', 'noopener,noreferrer')
          }}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: `1px solid ${hov ? accent : accent + '44'}`,
            background: hov ? accent : 'transparent',
            color: hov ? '#000' : accent,
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Ver detalle →
        </button>
      </div>
    </div>
  )
}

export default function TiendaEstiloModerno() {
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

  const accent = ACCENT
  const tenantName = tenant?.nombre || 'Tienda'
  const words = tenantName.split(/\s+/).filter(Boolean)
  const lastWord = words[words.length - 1] || 'Tienda'
  const firstWords = words.slice(0, -1).join(' ')
  const enStockCount = productosActivos.filter((p) => p.tipo === 'producto' && p.stock > 0).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .t-root-mod { min-height: 100vh; background: #0a0a0a; color: #f0f0f0; font-family: 'Inter', sans-serif; }
        .t-hero-mod { max-width: 1200px; margin: 0 auto; padding: 64px 48px 0; }
        .t-eyebrow-mod { display: inline-flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${accent}; margin-bottom: 24px; }
        .t-eyebrow-mod::before { content: ''; width: 28px; height: 2px; background: ${accent}; border-radius: 1px; }
        .t-hero-top-mod { display: grid; grid-template-columns: 92px 1fr; align-items: flex-end; gap: 28px; margin-bottom: 0; }
        .t-logo-mod { width: 92px; height: 92px; border-radius: 18px; background: ${accent}18; border: 1px solid ${accent}33; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: ${accent}; font-family: 'Syne', sans-serif; flex-shrink: 0; margin-bottom: 8px; overflow: hidden; }
        .t-title-mod { font-family: 'Syne', sans-serif; font-size: clamp(52px, 9vw, 104px); font-weight: 800; line-height: 0.9; letter-spacing: -0.04em; margin: 0; color: #fff; }
        .t-title-mod em { font-style: normal; color: ${accent}; }
        .t-hero-bottom-mod { display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 32px; padding: 20px 0 0 120px; margin-bottom: 0; border-top: 1px solid #1a1a1a; margin-top: 20px; padding-top: 20px; }
        .t-slogan-mod { font-size: 14px; color: #666; line-height: 1.75; max-width: 440px; font-weight: 400; }
        .t-stats-mod { display: flex; gap: 36px; flex-shrink: 0; }
        .t-stat-mod { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .t-stat-val-mod { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: ${accent}; line-height: 1; letter-spacing: -0.04em; }
        .t-stat-lbl-mod { font-size: 9px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.14em; text-align: right; }
        .t-sep-mod { max-width: 1200px; margin: 48px auto 0; padding: 0 48px; display: flex; align-items: center; gap: 16px; }
        .t-sep-lbl-mod { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #2a2a2a; white-space: nowrap; }
        .t-sep-line-mod { flex: 1; height: 1px; background: #1a1a1a; }
        .t-sep-count-mod { font-size: 10px; font-weight: 600; color: #2a2a2a; white-space: nowrap; }
        .t-catalog-mod { max-width: 1200px; margin: 0 auto; padding: 28px 48px 80px; }
        .t-grid-mod { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 960px) { .t-grid-mod { grid-template-columns: repeat(2, 1fr); } .t-hero-mod, .t-sep-mod, .t-catalog-mod { padding-left: 24px; padding-right: 24px; } .t-hero-top-mod { grid-template-columns: 72px 1fr; gap: 18px; } .t-logo-mod { width: 72px; height: 72px; font-size: 22px; } .t-hero-bottom-mod { padding-left: 90px; } .t-title-mod { font-size: 56px; } }
        @media (max-width: 640px) { .t-grid-mod { grid-template-columns: 1fr; } .t-hero-top-mod { grid-template-columns: 1fr; } .t-logo-mod { display: none; } .t-hero-bottom-mod { padding-left: 0; flex-direction: column; } .t-stats-mod { justify-content: flex-start; } .t-stat-mod { align-items: flex-start; } .t-stat-lbl-mod { text-align: left; } .t-title-mod { font-size: 44px; } }
      `}</style>

      <div className="t-root-mod">
        <div className="t-hero-mod">
          <div className="t-eyebrow-mod">Tienda oficial</div>
          <div className="t-hero-top-mod">
            <div className="t-logo-mod">
              {tenant?.logoUrl ? (
                <img src={tenant.logoUrl} alt={tenantName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(tenantName)
              )}
            </div>
            <h1 className="t-title-mod">
              {firstWords && <span>{firstWords} </span>}
              <em>{lastWord}</em>
            </h1>
          </div>
          <div className="t-hero-bottom-mod">
            <p className="t-slogan-mod">{tenant?.descripcion || tenant?.eslogan || 'Tu tienda en línea.'}</p>
            <div className="t-stats-mod">
              <div className="t-stat-mod">
                <span className="t-stat-val-mod">{productosActivos.length}</span>
                <span className="t-stat-lbl-mod">Productos</span>
              </div>
              <div className="t-stat-mod">
                <span className="t-stat-val-mod">{enStockCount}</span>
                <span className="t-stat-lbl-mod">En stock</span>
              </div>
              <div className="t-stat-mod">
                <span className="t-stat-val-mod">{productosActivos.filter((p) => p.tipo === 'servicio').length}+</span>
                <span className="t-stat-lbl-mod">Planes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="t-sep-mod">
          <span className="t-sep-lbl-mod">Catálogo</span>
          <div className="t-sep-line-mod" />
          <span className="t-sep-count-mod">{productosActivos.length} items</span>
        </div>

        <div className="t-catalog-mod">
          {productos.length === 0 ? (
            <div className="rounded-2xl bg-[#141418] p-12 text-center ring-1 ring-white/[0.06]">
              <p className="text-white/40">Aún no hay productos en la tienda.</p>
            </div>
          ) : productosActivos.length === 0 ? (
            <div className="rounded-2xl bg-[#141418] p-12 text-center ring-1 ring-white/[0.06]">
              <p className="text-white/40">No hay productos activos en la tienda por el momento.</p>
            </div>
          ) : (
            <div className="t-grid-mod">
              {productosActivos.map((p) => (
                <ProductCard key={p.id} producto={p} accent={accent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
