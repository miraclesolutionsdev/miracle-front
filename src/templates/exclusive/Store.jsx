import { useState, useRef, useMemo, useEffect } from 'react'
import { useLocation, useNavigate as useRRNavigate } from 'react-router-dom'
import useStoreData from '../useStoreData'
import { fmt, getInitials, navigateToProduct, getProductoImagenSrc } from '../templateUtils'
import MiniCart from '../../components/MiniCart'

function SkeletonCard() {
  return (
    <div className="ex-sk">
      <div className="ex-sk-img shimmer-ex" />
      <div className="ex-sk-body">
        <div className="ex-sk-line ex-sk-lg shimmer-ex" />
        <div className="ex-sk-line ex-sk-sm shimmer-ex" />
        <div className="ex-sk-line ex-sk-xs shimmer-ex" />
      </div>
    </div>
  )
}

function ProductCard({ p, index, slug, featured = false, cat = '' }) {
  const navigate = useRRNavigate()
  const [hov, setHov] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const touchX = useRef(null)

  const goToProduct = () => {
    const base = slug ? `/${slug}/tienda/${p.id}` : `/${p.id}`
    navigate(cat ? `${base}?from=${encodeURIComponent(cat)}` : base)
  }
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
      onClick={goToProduct}
      onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
      className={`ex-pc${featured ? ' ex-pc-featured' : ''}`}
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms`, opacity: sinStock ? 0.55 : 1 }}
    >
      <div className="ex-pc-img-wrap" onTouchStart={onTS} onTouchEnd={onTE}>
        {src ? (
          <img src={src} alt={p.nombre || 'Producto'} className="ex-pc-img"
            style={{ transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div className="ex-pc-placeholder">{getInitials(p.nombre)}</div>
        )}
        <div className="ex-pc-overlay" style={{ opacity: hov ? 1 : 0 }} />
        <div className="ex-pc-cta-wrap" style={{ transform: hov ? 'translateY(0)' : 'translateY(12px)', opacity: hov ? 1 : 0 }}>
          <span className="ex-pc-cta">Ver producto</span>
        </div>
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="ex-pc-arr ex-pc-arr-l" aria-label="Anterior">‹</button>
            <button type="button" onClick={goNext} className="ex-pc-arr ex-pc-arr-r" aria-label="Siguiente">›</button>
          </>
        )}
        {total > 1 && (
          <div className="ex-pc-dots">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                className="ex-pc-dot"
                style={{ width: i === imgIdx ? 18 : 5, background: i === imgIdx ? '#3d4f3a' : 'rgba(61,79,58,0.35)' }} />
            ))}
          </div>
        )}
        <div className="ex-pc-badges">
          {stockBajo && !sinStock && <span className="ex-pc-badge-low">Últimas {p.stock}</span>}
          {sinStock && <span className="ex-pc-badge-out">Agotado</span>}
          {featured && !sinStock && !stockBajo && <span className="ex-pc-badge-feat">Destacado</span>}
        </div>
      </div>
      <div className="ex-pc-info">
        <p className="ex-pc-name">{p.nombre || 'Sin nombre'}</p>
        {p.descripcion && <p className="ex-pc-sub">{p.descripcion.slice(0, featured ? 110 : 72)}{p.descripcion.length > (featured ? 110 : 72) ? '…' : ''}</p>}
        <div className="ex-pc-footer">
          <div className="ex-pc-price-wrap">
            {p.precio != null
              ? <span className="ex-pc-price">{fmt(p.precio)}</span>
              : <span className="ex-pc-price-na">Consultar</span>}
            {isProducto && !sinStock && (
              <span className="ex-pc-avail">
                <span className="ex-pc-avail-dot" style={{ background: stockBajo ? '#b89a5a' : '#5a7055' }} />
                {stockBajo ? `${p.stock} disponibles` : 'En stock'}
              </span>
            )}
            {sinStock && (
              <span className="ex-pc-avail" style={{ color: '#7a8275' }}>
                <span className="ex-pc-avail-dot" style={{ background: '#c8d5c2' }} />
                Agotado
              </span>
            )}
          </div>
          <div className="ex-pc-add" aria-label="Agregar al carrito">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}


// ─── WHY US SECTION ─────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    num: '01',
    title: 'Expertos en vaporizadores.',
    body: 'No vendemos de todo. Solo vaporizadores, y los conocemos a fondo. Cada producto que ofrecemos lo elegimos porque realmente vale la pena.',
  },
  {
    num: '02',
    title: 'Asesoría personalizada.',
    body: 'Antes de comprar o después, podés consultarnos. Te ayudamos a elegir el equipo ideal para tu caso — sin presiones, con criterio.',
  },
  {
    num: '03',
    title: 'Envío rápido y discreto.',
    body: 'Despachamos a todo Colombia con empaque sin marcas. Rápido, seguro, sin llamar la atención.',
  },
]

function WhyUsSection() {
  const [hov, setHov] = useState(null)

  return (
    <section className="wu-root">
      <div className="wu-inner">
        <div className="wu-left">
          <div className="wu-kicker">
            <span className="wu-kicker-line" />
            <span className="wu-kicker-text">Nuestra diferencia</span>
          </div>
          <h2 className="wu-heading">
            ¿Por qué<br />
            <em>comprar acá?</em>
          </h2>
        </div>

        <div className="wu-right">
          {WHY_ITEMS.map((item, i) => (
            <div
              key={item.num}
              className={`wu-item${hov === i ? ' wu-item-hov' : ''}`}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <span className="wu-num">{item.num}</span>
              <div className="wu-item-body">
                <h3 className="wu-item-title">{item.title}</h3>
                <p className="wu-item-desc">{item.body}</p>
              </div>
              <div className="wu-item-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
// ────────────────────────────────────────────────────────────────────────────

// ─── FOR WHOM SECTION ───────────────────────────────────────────────────────
const PROFILES = [
  {
    id: 'principiante',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M14 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="20" cy="22" r="2.5" fill="currentColor"/>
        <path d="M20 24.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Principiante',
    sub: 'Querés empezar bien. Sin humo, sin complicaciones.',
    desc: 'Fácil de usar, seguro y discreto para tu primera vez.',
    cta: 'Para principiantes',
  },
  {
    id: 'portatil',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <rect x="15" y="8" width="10" height="22" rx="5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M20 30v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M17 34h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="20" cy="14" r="2" fill="currentColor"/>
      </svg>
    ),
    title: 'Portátil diario',
    sub: 'On-the-go. Discreto, rápido, siempre listo.',
    desc: 'Los mejores vapes de bolsillo para el ritmo de tu día.',
    cta: 'Ver portátiles',
  },
  {
    id: 'casa',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M8 18L20 8l12 10v14a2 2 0 01-2 2H10a2 2 0 01-2-2V18z" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="16" y="24" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="20" cy="18" r="2.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Uso en casa',
    sub: 'Sesiones largas, sabor premium. Sin apuros.',
    desc: 'Desktop o semipermanente: máximo confort, sabor puro.',
    cta: 'Ver modelos desktop',
  },
  {
    id: 'potencia',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path d="M22 6l-8 14h8l-4 14 10-16h-8L22 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Máxima potencia',
    sub: 'El estándar de oro. Para los que no negocian calidad.',
    desc: 'Volcano, Mighty, Crafty+: la cima de la tecnología vape.',
    cta: 'Ver gama alta',
  },
]

function ForWhomSection() {
  const [active, setActive] = useState(null)

  return (
    <section className="fw-root">
      <div className="fw-inner">
        <header className="fw-header">
          <div className="fw-kicker">
            <span className="fw-kicker-line" />
            <span className="fw-kicker-text">Guía de selección</span>
          </div>
          <h2 className="fw-title">¿Para quién es<br /><em>este vaporizador?</em></h2>
          <p className="fw-subtitle">Cada perfil, el equipo ideal. Encontrá el tuyo.</p>
        </header>

        <div className="fw-grid">
          {PROFILES.map((p) => {
            const isActive = active === p.id
            return (
              <article
                key={p.id}
                className={`fw-card${isActive ? ' fw-card-active' : ''}`}
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(isActive ? null : p.id)}
              >
                <div className="fw-card-icon">{p.icon}</div>
                <div className="fw-card-body">
                  <h3 className="fw-card-title">{p.title}</h3>
                  <p className="fw-card-sub">{p.sub}</p>
                  <p className="fw-card-desc">{p.desc}</p>
                </div>
                <div className="fw-card-footer">
                  <span className="fw-card-cta">
                    {p.cta}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <div className="fw-card-accent" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
// ────────────────────────────────────────────────────────────────────────────

// ─── BRANDS SECTION ─────────────────────────────────────────────────────────
const BRANDS = [
  {
    name: 'AirVape',
    tag: 'Portátiles',
    desc: 'Convección pura, diseño ultradelgado.',
    img: '/heroes/airvape-banner.jpg',
    wide: true,   // ocupa 2 columnas
  },
  {
    name: 'PAX',
    tag: 'Premium',
    desc: 'El iPhone de los vaporizadores.',
    img: '/heroes/pax-banner.jpg',
    wide: false,
  },
  {
    name: 'Arizer',
    tag: 'Desktop & Portátil',
    desc: 'Calidad canadiense, sabor sin igual.',
    img: '/heroes/arizer-banner.jpg',
    wide: false,
  },
  {
    name: 'Storz & Bickel',
    tag: 'El estándar de oro',
    desc: 'Volcano, Mighty y Crafty+ — la cima.',
    img: '/heroes/storz-bickel-banner.jpg',
    wide: true,
  },
]

function BrandsSection() {
  return (
    <section className="br-root">
      <div className="br-header">
        <div className="br-header-left">
          <span className="br-kicker-line" />
          <span className="br-kicker-text">Colecciones</span>
        </div>
        <p className="br-header-desc">Las marcas más reconocidas del mundo, disponibles en Colombia.</p>
      </div>

      <div className="br-grid">
        {BRANDS.map((b, i) => (
          <a
            key={b.name}
            href="#catalogo"
            className={`br-card${b.wide ? ' br-card-wide' : ''}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Imagen de fondo */}
            <div className="br-card-bg" style={{ backgroundImage: `url(${b.img})` }} />

            {/* Overlay — de abajo hacia arriba, sutil */}
            <div className="br-card-overlay" />

            {/* Contenido */}
            <div className="br-card-body">
              <div className="br-card-top">
                <span className="br-card-tag">{b.tag}</span>
              </div>
              <div className="br-card-bottom">
                <h3 className="br-card-name">{b.name}</h3>
                <p className="br-card-desc">{b.desc}</p>
                <span className="br-card-cta">
                  Ver colección
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
// ────────────────────────────────────────────────────────────────────────────

// ─── HERO CAROUSEL ──────────────────────────────────────────────────────────
// ⚠️  Reemplaza estas URLs con las rutas reales de tus imágenes
// Sugerencia: ponlas en /public/heroes/ y referencia como '/heroes/airvape.jpg'
const SLIDES = [
  {
    img: '/heroes/airvape-banner.jpg',
    brand: 'AirVape',
    title: 'Portátiles',
    sub: 'Tecnología de punta en la palma de tu mano.',
    cta: 'Ver colección',
  },
  {
    img: '/heroes/pax-banner.jpg',
    brand: 'PAX',
    title: 'Premium',
    sub: 'Diseño minimalista. Experiencia máxima.',
    cta: 'Explorar',
  },
  {
    img: '/heroes/arizer-banner.jpg',
    brand: 'Arizer',
    title: 'Desktop',
    sub: 'Para quienes no negocian la calidad.',
    cta: 'Ver modelos',
  },
  {
    img: '/heroes/storz-bickel-banner.jpg',
    brand: 'Storz & Bickel',
    title: 'Volcano',
    sub: 'El estándar de oro en vaporizadores.',
    cta: 'Descubrir',
  },
]

function HeroCarousel({ tenantNombre }) {
  const [cur, setCur] = useState(0)
  const [prev, setPrev] = useState(null)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    if (animating || idx === cur) return
    setPrev(cur)
    setAnimating(true)
    setCur(idx)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 700)
  }

  const next = () => goTo((cur + 1) % SLIDES.length)
  const goPrev = () => goTo((cur - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    timerRef.current = setInterval(next, 5500)
    return () => clearInterval(timerRef.current)
  }, [cur, animating])

  return (
    <section className="hc-root" aria-label="Colección destacada">
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hc-slide${i === cur ? ' hc-slide-active' : ''}${i === prev ? ' hc-slide-prev' : ''}`}
          aria-hidden={i !== cur}
        >
          {/* Imagen de fondo */}
          <div
            className="hc-bg"
            style={{ backgroundImage: `url(${s.img})` }}
          />
          {/* Gradiente overlay — más denso a la izquierda */}
          <div className="hc-overlay" />

          {/* Contenido */}
          <div className="hc-content">
            <div className="hc-text">
              <p className="hc-brand">{s.brand}</p>
              <h2 className="hc-title"><em>{s.title}</em></h2>
              <p className="hc-sub">{s.sub}</p>
              <a href="#catalogo" className="hc-cta">{s.cta}</a>
            </div>

            {/* Número de slide — detalle editorial */}
            <div className="hc-slide-num">
              <span className="hc-slide-cur">{String(cur + 1).padStart(2, '0')}</span>
              <span className="hc-slide-sep" />
              <span className="hc-slide-total">{String(SLIDES.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas */}
      <button type="button" className="hc-arr hc-arr-l" onClick={goPrev} aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button type="button" className="hc-arr hc-arr-r" onClick={next} aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="hc-dots" role="tablist" aria-label="Slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === cur}
            aria-label={`Slide ${i + 1}`}
            className={`hc-dot${i === cur ? ' hc-dot-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="hc-progress" key={cur}>
        <div className="hc-progress-bar" />
      </div>
    </section>
  )
}
// ────────────────────────────────────────────────────────────────────────────

const TOPBAR_MSGS = [
  { text: 'Los mejores vaporizadores de hierba,', em: 'al mejor precio de Colombia.' },
  { text: 'DynaVap, Mighty, Arizer y más —', em: 'envío a todo el país.' },
  { text: 'Vaporizá con calidad premium.', em: 'Stock disponible hoy.' },
]

function Topbar() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % TOPBAR_MSGS.length)
        setVisible(true)
      }, 350)
    }, 4000)
    return () => clearInterval(iv)
  }, [])

  const msg = TOPBAR_MSGS[idx]
  return (
    <div className="ex-topbar">
      <span className="ex-topbar-msg" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-6px)' }}>
        {msg.text}&nbsp;<em className="ex-topbar-em">{msg.em}</em>
      </span>
    </div>
  )
}

// ─── CATALOG VIEW ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'default', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre A–Z' },
]

function CatalogView({ catLabel, productos, slug, loading, onBack }) {
  const [sort, setSort] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)

  const sorted = useMemo(() => {
    const list = [...productos]
    if (sort === 'price-asc') list.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0))
    else if (sort === 'price-desc') list.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0))
    else if (sort === 'name-asc') list.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
    return list
  }, [productos, sort])

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Destacados'

  return (
    <main className="cv-root">
      {/* Compact catalog band — breadcrumb + title + count + sort in one row */}
      <div className="cv-header">
        <div className="cv-header-inner">
          {/* Left: back nav + title */}
          <div className="cv-header-left">
            <button type="button" className="cv-back" onClick={onBack} aria-label="Volver a la tienda">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tienda
            </button>
            <span className="cv-header-sep">/</span>
            <h1 className="cv-header-title">{catLabel || 'Resultados'}</h1>
            {!loading && <span className="cv-header-badge">{sorted.length}</span>}
          </div>
          {/* Right: sort */}
          <div className="cv-sort-wrap">
            <button
              type="button"
              className="cv-sort-btn"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden style={{ opacity: 0.6 }}>
                <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span>{sortLabel}</span>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {sortOpen && (
              <div className="cv-sort-dropdown">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={`cv-sort-option${sort === o.value ? ' cv-sort-option-active' : ''}`}
                    onClick={() => { setSort(o.value); setSortOpen(false) }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="cv-grid-wrap">
        {loading ? (
          <div className="ex-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="ex-empty" style={{ border: '0.5px dashed var(--ex-bone-border)', background: 'var(--ex-bone)', padding: '5rem 2rem', textAlign: 'center' }}>
            <span className="ex-empty-sym">∅</span>
            <p className="ex-empty-text">No hay productos en esta categoría aún.</p>
          </div>
        ) : (
          <div className="ex-grid">
            {sorted.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                index={i}
                slug={slug}
                cat={catLabel}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
// ────────────────────────────────────────────────────────────────────────────

// ExclusiveStore v2
export default function ExclusiveStore({ slug: slugProp }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    productos,
    categorias, setCategoriaActiva,
  } = useStoreData(slugProp)

  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState('landing') // 'landing' | 'catalog'
  const [activeCatLabel, setActiveCatLabel] = useState('')

  // Read ?q= param on mount (redirect from Landing search)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    const cat = params.get('cat')
    if (q) {
      setBusqueda(q)
      setSearchOpen(true)
      setView('catalog')
      setActiveCatLabel('')
    } else if (cat) {
      setCategoriaActiva(cat)
      setActiveCatLabel(cat)
      setView('catalog')
    }
  }, [location.search])

  const handleNavCat = (label) => {
    // Map nav label → categoria value in store data (case-insensitive match)
    const match = categorias.find((c) => c.toLowerCase() === label.toLowerCase())
    if (match) {
      setCategoriaActiva(match)
      setActiveCatLabel(match)
      setView('catalog')
    } else {
      // No products yet for this category — still show empty catalog
      setCategoriaActiva(label)
      setActiveCatLabel(label)
      setView('catalog')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToLanding = () => {
    setCategoriaActiva('')
    setActiveCatLabel('')
    setView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Pick 2-3 random featured products for hero (con imagen si es posible)
  const heroProducts = useMemo(() => {
    const todos = productos.filter((p) => p.tipo === 'producto' && p.stock > 0)
    const conImg = todos.filter((p) => p.imagenes?.length > 0)
    const pool = conImg.length >= 2 ? conImg : todos
    if (pool.length === 0) return []
    // tomar hasta 3 al azar pero de forma estable (seed por totalProductos)
    const shuffled = [...pool].sort((a, b) => a.id > b.id ? 1 : -1)
    return shuffled.slice(0, Math.min(3, shuffled.length))
  }, [productos])

  return (
    <>
      <style>{CSS}</style>
      <div className="ex-root">

        {/* TOPBAR */}
        <Topbar />

        {/* NAV */}
        <nav className="ex-nav">
          <div className="ex-nav-inner">

            {/* Hamburger mobile */}
            <button type="button" className="ex-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
              <span /><span /><span />
            </button>

            {/* Logo */}
            <div className="ex-nav-logo">
              <span className="ex-logo-name">{tenantNombre || 'STORE'}</span>
              <span className="ex-logo-tag">Tienda oficial</span>
            </div>

            {/* Divisor logo / links */}
            <div className="ex-nav-divider" aria-hidden="true" />

            {/* Category links */}
            <div className="ex-nav-center">
              {[
                { label: 'Pen' },
                { label: 'Portátiles' },
                { label: 'Desktop' },
                { label: 'Accesorios' },
                { label: 'Kits' },
                { label: 'Repuestos' },
                { label: 'Ofertas', accent: true },
              ].map(({ label, accent }) => {
                const isActive = view === 'catalog' && activeCatLabel.toLowerCase() === label.toLowerCase()
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleNavCat(label)}
                    className={`ex-nav-link${accent ? ' ex-nav-link-accent' : ''}${isActive ? ' ex-nav-link-active' : ''}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Right actions */}
            <div className="ex-nav-right">
              {/* Desktop search toggle */}
              <button
                type="button"
                className="ex-nav-icon-btn"
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Buscar"
              >
                {searchOpen ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                )}
              </button>

              {/* Cart */}
              <MiniCart position="header" theme="exclusive" />
            </div>
          </div>

          {/* Search bar — expandible bajo el nav */}
          <div className={`ex-nav-search-bar${searchOpen ? ' ex-nav-search-bar-open' : ''}`}>
            <div className="ex-nav-search-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ex-nav-search-ico" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                className="ex-nav-search-input"
                placeholder="Buscar productos, marcas, modelos…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button type="button" className="ex-nav-search-clear" onClick={() => setBusqueda('')} aria-label="Limpiar">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu drawer */}
          {menuOpen && (
            <div className="ex-mob-menu">
              {[
                { label: 'Pen' },
                { label: 'Portátiles' },
                { label: 'Desktop' },
                { label: 'Accesorios' },
                { label: 'Kits' },
                { label: 'Repuestos' },
                { label: 'Ofertas', accent: true },
              ].map(({ label, accent }) => (
                <button
                  key={label}
                  type="button"
                  className={`ex-mob-menu-link${accent ? ' ex-mob-menu-link-accent' : ''}`}
                  onClick={() => { handleNavCat(label); setMenuOpen(false) }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* ── CATALOG VIEW ── */}
        {view === 'catalog' && (
          <CatalogView
            catLabel={activeCatLabel}
            productos={productosFiltrados}
            slug={slug}
            loading={loading}
            onBack={handleBackToLanding}
          />
        )}

        {/* ── LANDING VIEW ── */}
        {view === 'landing' && (<>

        {/* HERO CAROUSEL */}
        <HeroCarousel tenantNombre={tenantNombre} />

        {/* MARCAS */}
        <BrandsSection />

        {/* TRUST BAR */}
        <div className="ex-trust">
          {[
            { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', label: 'Envío gratis Colombia' },
            { icon: 'M22 12h-4l-3 9L9 3l-3 9H2', label: 'Respuesta rápida' },
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Compra 100% segura' },
            { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Empaque discreto' },
          ].map(({ icon, label }) => (
            <div key={label} className="ex-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ex-trust-icon" aria-hidden="true">
                <path d={icon} />
              </svg>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* PARA QUIÉN */}
        <ForWhomSection />

        {/* POR QUÉ NOSOTROS */}
        <WhyUsSection />

        </>)}

        {/* FOOTER */}
        <footer className="ex-footer">
          <div className="ex-footer-inner">
            <div className="ex-footer-left">
              <span className="ex-footer-logo">{tenantNombre || 'Store'}</span>
              <span className="ex-footer-copy">© {new Date().getFullYear()} · Todos los derechos reservados</span>
            </div>
            <div className="ex-footer-right">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>Pago 100% seguro</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ex-white: #ffffff;
    --ex-bone: #f7f5f0;
    --ex-bone-mid: #ede9e1;
    --ex-bone-border: #e0dbd0;
    --ex-ink: #2c3028;
    --ex-ink-mid: #4a5246;
    --ex-ink-soft: #7a8275;
    --ex-sage: #3d4f3a;
    --ex-sage-mid: #5a7055;
    --ex-sage-mist: #c8d5c2;
    --ex-gold: #b89a5a;
  }

  .ex-root { min-height: 100vh; background: var(--ex-white); color: var(--ex-ink); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* TOPBAR */
  .ex-topbar { background: var(--ex-sage); text-align: center; padding: 9px 20px; overflow: hidden; }
  .ex-topbar-msg { display: inline-block; font-size: 11.5px; font-weight: 400; letter-spacing: 0.08em; color: rgba(255,255,255,0.8); transition: opacity 0.3s ease, transform 0.3s ease; white-space: nowrap; }
  .ex-topbar-em { font-style: italic; font-weight: 500; color: rgba(255,255,255,1); letter-spacing: 0.04em; }

  /* NAV */
  .ex-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.99); backdrop-filter: blur(20px); border-bottom: 1px solid var(--ex-bone-border); }
  .ex-nav-inner { max-width: 100%; margin: 0 auto; height: 52px; display: flex; align-items: stretch; padding: 0 2rem; gap: 0; }

  /* Logo — ocupa toda la altura, centrado verticalmente */
  .ex-nav-logo { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 3px; flex-shrink: 0; cursor: default; padding-right: 0; }
  .ex-logo-name { font-size: 16px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ex-ink); font-weight: 700; line-height: 1; font-family: 'Inter', sans-serif; }
  .ex-logo-tag { font-size: 7.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ex-ink-soft); font-weight: 400; font-family: 'Inter', sans-serif; }

  /* Divisor vertical logo / links */
  .ex-nav-divider { width: 1px; height: 18px; background: var(--ex-bone-border); margin: auto 1.6rem; flex-shrink: 0; align-self: center; }

  /* Category links — full height, underline pegado al borde inferior del nav */
  .ex-nav-center { display: flex; align-items: stretch; gap: 0; flex: 1; }
  .ex-nav-link { position: relative; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ex-ink-mid); background: none; border: none; cursor: pointer; padding: 0 13px; font-family: 'Inter', sans-serif; font-weight: 600; transition: color 0.15s; display: flex; align-items: center; white-space: nowrap; }
  .ex-nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--ex-ink); transform: scaleX(0); transform-origin: left; transition: transform 0.22s cubic-bezier(.25,.8,.25,1); }
  .ex-nav-link:hover { color: var(--ex-ink); }
  .ex-nav-link:hover::after { transform: scaleX(1); }
  .ex-nav-link-accent { color: var(--ex-gold); }
  .ex-nav-link-accent::after { background: var(--ex-gold); }
  .ex-nav-link-accent:hover { color: #8a6c22; }
  .ex-nav-link-active { color: var(--ex-ink) !important; }
  .ex-nav-link-active::after { transform: scaleX(1) !important; }

  /* Right actions — íconos grandes, bien centrados */
  .ex-nav-right { display: flex; align-items: stretch; gap: 0; margin-left: auto; }
  .ex-nav-icon-btn { display: flex; align-items: center; justify-content: center; width: 48px; height: 100%; background: none; border: none; cursor: pointer; color: var(--ex-ink-mid); transition: color 0.15s, background 0.15s; }
  .ex-nav-icon-btn:hover { color: var(--ex-ink); background: var(--ex-bone); }

  /* Expandable search bar below nav */
  .ex-nav-search-bar { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.28s ease, opacity 0.2s ease; background: var(--ex-white); }
  .ex-nav-search-bar-open { max-height: 58px; opacity: 1; border-bottom: 1px solid var(--ex-bone-border); }
  .ex-nav-search-inner { max-width: 100%; padding: 0 2rem; height: 50px; display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--ex-bone-border); }
  .ex-nav-search-ico { color: var(--ex-ink-soft); flex-shrink: 0; }
  .ex-nav-search-input { flex: 1; background: none; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--ex-ink); letter-spacing: 0.02em; }
  .ex-nav-search-input::placeholder { color: var(--ex-ink-soft); }
  .ex-nav-search-clear { background: none; border: none; cursor: pointer; color: var(--ex-ink-soft); display: flex; padding: 4px; transition: color 0.15s; }
  .ex-nav-search-clear:hover { color: var(--ex-ink); }

  /* Mobile */
  .ex-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; margin-right: 14px; align-self: center; }
  .ex-hamburger span { display: block; width: 22px; height: 2px; background: var(--ex-ink); border-radius: 1px; transition: all 0.2s; }
  .ex-mob-menu { background: var(--ex-white); border-top: 1px solid var(--ex-bone-border); padding: 0.4rem 2rem 1.2rem; display: flex; flex-direction: column; }
  .ex-mob-menu-link { text-align: left; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ex-ink-mid); background: none; border: none; cursor: pointer; padding: 13px 0; font-family: 'Inter', sans-serif; font-weight: 600; border-bottom: 1px solid var(--ex-bone-border); transition: color 0.15s; }
  .ex-mob-menu-link:last-child { border-bottom: none; }
  .ex-mob-menu-link:hover { color: var(--ex-ink); }
  .ex-mob-menu-link-accent { color: var(--ex-gold); }

  /* HERO CAROUSEL */
  .hc-root { position: relative; width: 100%; height: clamp(340px, 52vw, 520px); overflow: hidden; background: #111; }

  /* Slides — apilados, transición opacity */
  .hc-slide { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.7s ease; }
  .hc-slide-active { opacity: 1; pointer-events: auto; z-index: 2; }
  .hc-slide-prev { opacity: 0; z-index: 1; }

  /* Imagen de fondo */
  .hc-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 8s ease; }
  .hc-slide-active .hc-bg { transform: scale(1.04); }
  .hc-slide:not(.hc-slide-active) .hc-bg { transform: scale(1); }

  /* Overlay gradiente — denso izquierda, transparente derecha */
  .hc-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(12,14,10,0.82) 0%, rgba(12,14,10,0.45) 45%, rgba(12,14,10,0.08) 100%); }

  /* Contenido sobre el slide */
  .hc-content { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 3.5rem 2.8rem; z-index: 3; }

  /* Texto izquierda */
  .hc-text { display: flex; flex-direction: column; gap: 0; max-width: 440px; }
  .hc-brand { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ex-sage-mist); font-weight: 500; margin-bottom: 8px; font-family: 'Inter', sans-serif; }
  .hc-title { font-family: 'Playfair Display', serif; font-size: clamp(42px, 6vw, 68px); font-weight: 400; line-height: 0.95; color: #fff; margin-bottom: 14px; }
  .hc-title em { font-style: italic; color: var(--ex-sage-mist); }
  .hc-sub { font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.65; margin-bottom: 22px; font-family: 'Inter', sans-serif; font-weight: 300; max-width: 320px; }
  .hc-cta { display: inline-flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; color: #fff; background: transparent; border: 1px solid rgba(255,255,255,0.5); padding: 11px 22px; text-decoration: none; transition: background 0.2s, border-color 0.2s; cursor: pointer; width: fit-content; }
  .hc-cta:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.9); }

  /* Número de slide — derecha abajo */
  .hc-slide-num { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; align-self: flex-end; }
  .hc-slide-cur { font-family: 'Playfair Display', serif; font-size: 28px; color: #fff; line-height: 1; }
  .hc-slide-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.25); }
  .hc-slide-total { font-family: 'Playfair Display', serif; font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1; }

  /* Flechas */
  .hc-arr { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 44px; height: 44px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.8); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s; }
  .hc-arr:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.5); color: #fff; }
  .hc-arr-l { left: 1.8rem; }
  .hc-arr-r { right: 1.8rem; }

  /* Dots */
  .hc-dots { position: absolute; bottom: 1.4rem; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; }
  .hc-dot { width: 22px; height: 2px; background: rgba(255,255,255,0.28); border: none; padding: 0; cursor: pointer; transition: background 0.25s, width 0.25s; }
  .hc-dot-active { background: #fff; width: 36px; }

  /* Progress bar */
  .hc-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.1); z-index: 10; overflow: hidden; }
  .hc-progress-bar { height: 100%; background: rgba(255,255,255,0.5); width: 0; animation: hcProgress 5.5s linear forwards; }
  @keyframes hcProgress { from { width: 0 } to { width: 100% } }

  /* Mobile */
  @media (max-width: 768px) {
    .hc-root { height: clamp(260px, 65vw, 380px); }
    .hc-content { padding: 0 1.5rem 2rem; }
    .hc-title { font-size: clamp(32px, 9vw, 44px); }
    .hc-sub { display: none; }
    .hc-slide-num { display: none; }
    .hc-arr { width: 36px; height: 36px; }
    .hc-arr-l { left: 0.8rem; }
    .hc-arr-r { right: 0.8rem; }
  }

  /* BRANDS SECTION */
  .br-root { background: var(--ex-white); padding: 3.5rem 2.5rem 4rem; max-width: 100%; }

  .br-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; max-width: 1440px; margin-left: auto; margin-right: auto; padding-bottom: 1.2rem; border-bottom: 0.5px solid var(--ex-bone-border); }
  .br-header-left { display: flex; align-items: center; gap: 12px; }
  .br-kicker-line { display: block; width: 24px; height: 0.5px; background: var(--ex-sage-mid); flex-shrink: 0; }
  .br-kicker-text { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ex-sage-mid); font-weight: 500; font-family: 'Inter', sans-serif; }
  .br-header-desc { font-size: 12px; color: var(--ex-ink-soft); letter-spacing: 0.02em; font-family: 'Inter', sans-serif; }

  /* Grid: 2 col desktop — las wide ocupan 2 columnas */
  .br-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--ex-bone-border); border: 0.5px solid var(--ex-bone-border); max-width: 1440px; margin: 0 auto; }

  /* Card base */
  .br-card { position: relative; display: block; overflow: hidden; text-decoration: none; cursor: pointer; background: var(--ex-bone-mid); height: 220px; }
  .br-card-wide { grid-column: span 2; height: 260px; }

  /* Imagen fondo */
  .br-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.7s cubic-bezier(.25,.8,.25,1); filter: saturate(0.85); }
  .br-card:hover .br-card-bg { transform: scale(1.04); filter: saturate(1); }

  /* Overlay — gradiente de abajo, casi invisible en reposo, más visible en hover */
  .br-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,24,18,0.72) 0%, rgba(20,24,18,0.18) 55%, transparent 100%); opacity: 0.85; transition: opacity 0.35s; }
  .br-card:hover .br-card-overlay { opacity: 1; }

  /* Contenido */
  .br-card-body { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 1.4rem 1.8rem; z-index: 2; }

  /* Tag arriba izquierda */
  .br-card-top {}
  .br-card-tag { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.1); border: 0.5px solid rgba(255,255,255,0.2); padding: 4px 10px; font-family: 'Inter', sans-serif; font-weight: 500; backdrop-filter: blur(4px); }

  /* Nombre + desc + cta abajo */
  .br-card-bottom { display: flex; flex-direction: column; gap: 4px; }
  .br-card-name { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.8vw, 32px); font-weight: 400; color: #fff; line-height: 1.05; margin-bottom: 4px; transform: translateY(6px); transition: transform 0.3s ease; }
  .br-card:hover .br-card-name { transform: translateY(0); }
  .br-card-desc { font-size: 12px; color: rgba(255,255,255,0.6); font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: 0.02em; opacity: 0; transform: translateY(8px); transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s; }
  .br-card:hover .br-card-desc { opacity: 1; transform: translateY(0); }
  .br-card-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.9); font-family: 'Inter', sans-serif; font-weight: 600; margin-top: 10px; opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease 0.08s, transform 0.25s ease 0.08s; border-bottom: 0.5px solid rgba(255,255,255,0.4); padding-bottom: 2px; width: fit-content; }
  .br-card:hover .br-card-cta { opacity: 1; transform: translateY(0); }

  /* Sin imagen — fallback con color */
  .br-card-bg[style*="url(/heroes"]  { background-color: var(--ex-sage); }

  /* Responsive */
  @media (max-width: 768px) {
    .br-root { padding: 2.5rem 0 3rem; }
    .br-header { padding: 0 1.5rem 1rem; margin-bottom: 0; }
    .br-header-desc { display: none; }
    .br-card-wide { grid-column: span 2; height: 200px; }
    .br-card { height: 170px; }
    .br-card-name { font-size: 22px; }
    .br-card-desc { display: none; }
    .br-card-cta { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 480px) {
    .br-grid { grid-template-columns: 1fr; }
    .br-card-wide { grid-column: span 1; }
  }

  /* WHY US SECTION */
  .wu-root { background: var(--ex-sage); padding: 5.5rem 2.5rem; }
  .wu-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.6fr; gap: 5rem; align-items: start; }

  .wu-left { position: sticky; top: 2rem; }
  .wu-kicker { display: flex; align-items: center; gap: 10px; margin-bottom: 1.4rem; }
  .wu-kicker-line { display: block; width: 24px; height: 0.5px; background: var(--ex-gold); flex-shrink: 0; }
  .wu-kicker-text { font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ex-gold); font-weight: 500; font-family: 'Inter', sans-serif; }
  .wu-heading { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 50px); font-weight: 400; color: rgba(247,245,240,0.95); line-height: 1.18; margin: 0; }
  .wu-heading em { font-style: italic; color: var(--ex-gold); }

  .wu-right { display: flex; flex-direction: column; }

  .wu-item { position: relative; padding: 2rem 0 2rem 1.5rem; border-top: 0.5px solid rgba(255,255,255,0.12); display: grid; grid-template-columns: 2.8rem 1fr; gap: 1.6rem; align-items: start; cursor: default; }
  .wu-item:last-child { border-bottom: 0.5px solid rgba(255,255,255,0.12); }

  .wu-item-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 1.5px; background: var(--ex-gold); transform: scaleY(0); transform-origin: top; transition: transform 0.35s cubic-bezier(.25,.8,.25,1); }
  .wu-item-hov .wu-item-bar { transform: scaleY(1); }

  .wu-num { font-family: 'Playfair Display', serif; font-size: 12px; font-style: italic; color: var(--ex-gold); letter-spacing: 0.06em; line-height: 1; padding-top: 5px; user-select: none; opacity: 0.8; }

  .wu-item-body { display: flex; flex-direction: column; gap: 10px; }
  .wu-item-title { font-family: 'Playfair Display', serif; font-size: clamp(16px, 1.5vw, 20px); font-weight: 400; color: rgba(247,245,240,0.95); line-height: 1.3; margin: 0; transition: color 0.2s; }
  .wu-item-hov .wu-item-title { color: var(--ex-gold); }
  .wu-item-desc { font-size: 13px; color: rgba(247,245,240,0.6); line-height: 1.72; font-family: 'Inter', sans-serif; font-weight: 400; margin: 0; }

  @media (max-width: 900px) {
    .wu-inner { grid-template-columns: 1fr; gap: 2.5rem; max-width: 640px; }
    .wu-left { position: static; }
    .wu-heading { font-size: clamp(28px, 7vw, 40px); }
  }
  @media (max-width: 640px) {
    .wu-root { padding: 3.5rem 1.5rem; }
    .wu-item { grid-template-columns: 2.4rem 1fr; gap: 1rem; padding: 1.6rem 0 1.6rem 1.2rem; }
  }

  /* FOR WHOM SECTION */
  .fw-root { background: var(--ex-bone); padding: 5rem 2.5rem 5.5rem; }
  .fw-inner { max-width: 1200px; margin: 0 auto; }

  .fw-header { text-align: center; margin-bottom: 3.5rem; }
  .fw-kicker { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 1.2rem; }
  .fw-kicker-line { display: block; width: 24px; height: 0.5px; background: var(--ex-sage-mid); }
  .fw-kicker-text { font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ex-sage-mid); font-weight: 500; font-family: 'Inter', sans-serif; }
  .fw-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: var(--ex-ink); line-height: 1.2; margin: 0 0 0.9rem; }
  .fw-title em { font-style: italic; color: var(--ex-sage); }
  .fw-subtitle { font-size: 13px; color: var(--ex-ink-soft); letter-spacing: 0.04em; font-family: 'Inter', sans-serif; }

  .fw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--ex-bone-border); border: 0.5px solid var(--ex-bone-border); }

  .fw-card { position: relative; background: var(--ex-white); display: flex; flex-direction: column; padding: 2.2rem 2rem 2rem; cursor: pointer; transition: background 0.25s; overflow: hidden; }
  .fw-card:hover, .fw-card-active { background: var(--ex-white); }

  .fw-card-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--ex-sage); transform: scaleX(0); transform-origin: left; transition: transform 0.3s cubic-bezier(.25,.8,.25,1); }
  .fw-card:hover .fw-card-accent, .fw-card-active .fw-card-accent { transform: scaleX(1); }

  .fw-card-icon { color: var(--ex-ink-soft); margin-bottom: 1.5rem; transition: color 0.25s, transform 0.25s; }
  .fw-card:hover .fw-card-icon, .fw-card-active .fw-card-icon { color: var(--ex-sage); transform: translateY(-3px); }

  .fw-card-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .fw-card-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: var(--ex-ink); line-height: 1.2; margin: 0; }
  .fw-card:hover .fw-card-title, .fw-card-active .fw-card-title { color: var(--ex-sage); }
  .fw-card-sub { font-size: 12.5px; color: var(--ex-ink-mid); line-height: 1.55; font-family: 'Inter', sans-serif; font-weight: 500; margin: 0; }
  .fw-card-desc { font-size: 11.5px; color: var(--ex-ink-soft); line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400; margin: 0; opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease 0.05s, transform 0.25s ease 0.05s; }
  .fw-card:hover .fw-card-desc, .fw-card-active .fw-card-desc { opacity: 1; transform: translateY(0); }

  .fw-card-footer { margin-top: 1.8rem; padding-top: 1.2rem; border-top: 0.5px solid var(--ex-bone-border); }
  .fw-card-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ex-ink-soft); font-family: 'Inter', sans-serif; font-weight: 600; transition: color 0.2s, gap 0.2s; }
  .fw-card:hover .fw-card-cta, .fw-card-active .fw-card-cta { color: var(--ex-sage); gap: 10px; }

  @media (max-width: 1024px) {
    .fw-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .fw-root { padding: 3.5rem 1.5rem 4rem; }
    .fw-grid { grid-template-columns: 1fr; }
    .fw-card-desc { opacity: 1; transform: translateY(0); }
  }

  /* TRUST BAR */
  .ex-trust { display: flex; background: var(--ex-sage); border-bottom: 0.5px solid rgba(0,0,0,0.06); }
  .ex-trust-item { flex: 1; padding: 0.9rem 1rem; border-right: 0.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; letter-spacing: 0.07em; color: rgba(255,255,255,0.75); }
  .ex-trust-item:last-child { border-right: none; }
  .ex-trust-icon { color: rgba(255,255,255,0.55); flex-shrink: 0; }

  /* CATALOG VIEW */
  .cv-root { background: var(--ex-bone); min-height: 60vh; }
  .cv-root .ex-grid { background: transparent; }

  /* Compact catalog band */
  .cv-header { background: var(--ex-sage); border-bottom: 0.5px solid rgba(247,245,240,0.1); position: sticky; top: 52px; z-index: 30; }
  .cv-header-inner { max-width: 1280px; margin: 0 auto; padding: 0 2.5rem; height: 52px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .cv-header-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .cv-back { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,245,240,0.55); background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; padding: 0; min-height: 44px; white-space: nowrap; transition: color 0.15s; flex-shrink: 0; }
  .cv-back:hover { color: rgba(247,245,240,0.9); }
  .cv-header-sep { color: rgba(247,245,240,0.2); font-size: 12px; flex-shrink: 0; }
  .cv-header-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 400; font-style: italic; color: rgba(247,245,240,0.95); line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
  .cv-header-badge { display: inline-flex; align-items: center; font-size: 10px; font-weight: 600; color: rgba(184,154,90,0.8); font-family: 'Inter', sans-serif; background: rgba(184,154,90,0.12); border: 1px solid rgba(184,154,90,0.22); padding: 2px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.04em; }

  .cv-sort-wrap { position: relative; flex-shrink: 0; }
  .cv-sort-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 0.07em; color: rgba(247,245,240,0.65); background: rgba(247,245,240,0.07); border: 0.5px solid rgba(247,245,240,0.18); padding: 6px 11px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: background 0.15s, color 0.15s, border-color 0.15s; border-radius: 2px; min-height: 32px; }
  .cv-sort-btn:hover { background: rgba(247,245,240,0.13); color: rgba(247,245,240,0.95); border-color: rgba(247,245,240,0.3); }
  .cv-sort-dropdown { position: absolute; top: calc(100% + 4px); right: 0; background: var(--ex-white); border: 0.5px solid var(--ex-bone-border); min-width: 200px; z-index: 50; box-shadow: 0 8px 24px rgba(44,48,40,0.08); }
  .cv-sort-option { display: block; width: 100%; text-align: left; padding: 10px 16px; font-size: 12px; color: var(--ex-ink-mid); background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; letter-spacing: 0.04em; transition: background 0.12s, color 0.12s; }
  .cv-sort-option:hover { background: var(--ex-bone); color: var(--ex-ink); }
  .cv-sort-option-active { color: var(--ex-sage); font-weight: 600; }

  .cv-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2.5rem 5rem; background: var(--ex-bone); }

  @media (max-width: 768px) {
    .cv-header-inner { padding: 0 1.5rem; }
    .cv-grid-wrap { padding: 1.5rem 1.5rem 4rem; }
  }

  /* CATALOG */
  .ex-catalog { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem 4rem; }
  .ex-catalog-header { display: flex; align-items: flex-end; justify-content: space-between; padding: 2rem 0 1.4rem; border-bottom: 0.5px solid var(--ex-bone-border); margin-bottom: 2rem; }
  .ex-catalog-header-left {}
  .ex-catalog-label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ex-ink-soft); margin-bottom: 4px; }
  .ex-catalog-count { font-size: 12px; color: var(--ex-ink-soft); display: flex; align-items: center; gap: 8px; }
  .ex-catalog-count strong { color: var(--ex-ink-mid); font-weight: 500; }
  .ex-catalog-clear { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; letter-spacing: 0.08em; color: var(--ex-ink-soft); background: none; border: 0.5px solid var(--ex-bone-border); border-radius: 2px; padding: 3px 8px; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .ex-catalog-clear:hover { color: var(--ex-ink); border-color: var(--ex-ink-soft); }

  /* GRID — gap real entre cards, fondo neutral */
  .ex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; background: transparent; border: none; }

  /* PRODUCT CARD */
  .ex-pc { display: flex; flex-direction: column; background: var(--ex-white); cursor: pointer; outline: none; user-select: none; text-align: left; position: relative; transition: transform 0.22s cubic-bezier(.25,.8,.25,1), box-shadow 0.22s cubic-bezier(.25,.8,.25,1); animation: exCardIn 0.45s ease both; overflow: hidden; border-radius: 10px; box-shadow: 0 1px 4px rgba(44,48,40,0.06); }
  .ex-pc:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(44,48,40,0.11); }
  .ex-pc:focus-visible { outline: 2px solid var(--ex-sage); outline-offset: 2px; }
  @keyframes exCardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .ex-pc-img-wrap { position: relative; padding-bottom: 92%; overflow: hidden; background: var(--ex-bone-mid); flex-shrink: 0; border-radius: 10px 10px 0 0; }
  .ex-pc-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.65s cubic-bezier(.25,.8,.25,1); }
  .ex-pc-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 38px; color: var(--ex-sage-mist); background: var(--ex-bone-mid); }
  .ex-pc-overlay { position: absolute; inset: 0; background: rgba(44,48,40,0.14); transition: opacity 0.3s; pointer-events: none; }
  .ex-pc-cta-wrap { position: absolute; bottom: 14px; left: 0; right: 0; display: flex; justify-content: center; transition: all 0.25s cubic-bezier(.25,.8,.25,1); z-index: 3; }
  .ex-pc-cta { font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ex-ink); background: var(--ex-white); padding: 9px 20px; border-radius: 20px; box-shadow: 0 2px 8px rgba(44,48,40,0.12); }
  .ex-pc-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: rgba(255,255,255,0.92); border: none; color: var(--ex-ink); font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 5; transition: background 0.15s; line-height: 1; padding: 0; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .ex-pc-arr:hover { background: var(--ex-white); }
  .ex-pc-arr-l { left: 10px; }
  .ex-pc-arr-r { right: 10px; }
  .ex-pc-dots { position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 5; }
  .ex-pc-dot { height: 4px; border-radius: 4px; border: none; padding: 0; cursor: pointer; transition: all 0.22s; }
  .ex-pc-badges { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; z-index: 5; pointer-events: none; }
  .ex-pc-badge-feat { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: var(--ex-gold); color: var(--ex-white); border-radius: 20px; }
  .ex-pc-badge-low  { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: var(--ex-gold); color: var(--ex-white); border-radius: 20px; }
  .ex-pc-badge-out  { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: rgba(247,245,240,0.92); color: var(--ex-ink-soft); border-radius: 20px; }
  .ex-pc-info { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; gap: 5px; }
  .ex-pc-name { font-size: 13.5px; font-weight: 500; color: var(--ex-ink); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-sub { font-size: 11px; color: var(--ex-ink-soft); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .ex-pc-price-wrap { display: flex; flex-direction: column; gap: 2px; }
  .ex-pc-price { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--ex-ink); letter-spacing: 0.01em; line-height: 1; }
  .ex-pc-price-na { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); }
  .ex-pc-avail { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--ex-ink-soft); letter-spacing: 0.05em; }
  .ex-pc-avail-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .ex-pc-add { width: 34px; height: 34px; background: var(--ex-bone); border: 0.5px solid var(--ex-bone-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--ex-sage); flex-shrink: 0; transition: background 0.18s, border-color 0.18s, transform 0.18s; }
  .ex-pc:hover .ex-pc-add { background: var(--ex-sage); border-color: var(--ex-sage); color: var(--ex-white); transform: scale(1.1); }

  /* SKELETON */
  .ex-sk { background: var(--ex-white); display: flex; flex-direction: column; animation: exCardIn 0.4s ease both; overflow: hidden; }
  .ex-sk-img { padding-bottom: 92%; width: 100%; }
  .ex-sk-body { padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 10px; }
  .ex-sk-line { height: 12px; border-radius: 2px; }
  .ex-sk-lg { width: 68%; }
  .ex-sk-sm { width: 42%; }
  .ex-sk-xs { width: 28%; }
  .shimmer-ex { background: linear-gradient(90deg, var(--ex-bone) 0%, var(--ex-bone-mid) 50%, var(--ex-bone) 100%); background-size: 200% 100%; animation: shimmerEx 1.7s ease infinite; }
  @keyframes shimmerEx { to { background-position: -200% 0; } }

  /* EMPTY */
  .ex-empty { grid-column: 1 / -1; padding: 5rem 24px; text-align: center; border: 0.5px dashed var(--ex-bone-border); background: var(--ex-bone); }
  .ex-empty-sym { font-family: 'Playfair Display', serif; font-size: 44px; color: var(--ex-bone-border); display: block; margin-bottom: 12px; }
  .ex-empty-text { font-size: 13px; font-weight: 400; color: var(--ex-ink-soft); }

  /* FOOTER */
  .ex-footer { border-top: 0.5px solid var(--ex-bone-border); background: var(--ex-white); }
  .ex-footer-inner { max-width: 1200px; margin: 0 auto; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; }
  .ex-footer-left { display: flex; align-items: center; gap: 16px; }
  .ex-footer-logo { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-ink-soft); font-weight: 500; }
  .ex-footer-copy { font-size: 11px; color: var(--ex-bone-border); }
  .ex-footer-right { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ex-ink-soft); }

  /* Touch targets: add button must be 44×44 on mobile */
  @media (hover: none) {
    .ex-pc-add { width: 44px; height: 44px; }
    .fw-card { cursor: default; }
    .cv-sort-btn { padding: 10px 14px; min-height: 44px; }
  }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .ex-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  }

  @media (max-width: 768px) {
    /* Topbar — mensaje más compacto en mobile */
    .ex-topbar { padding: 7px 16px; }
    .ex-topbar-msg { font-size: 10.5px; white-space: normal; text-align: center; line-height: 1.4; }

    /* Nav */
    .ex-nav-center { display: none; }
    .ex-nav-divider { display: none; }
    .ex-hamburger { display: flex; }
    .ex-nav-inner { padding: 0 1.2rem; }

    /* Catalog header */
    .cv-header-inner { padding: 0 1.2rem; }
    .cv-back { min-height: 44px; }
    .cv-sort-dropdown { min-width: 180px; }
    .cv-grid-wrap { padding: 1.2rem 1.2rem 4rem; }

    /* Product grid en catálogo móvil: 2 cols, sin featured span */
    .cv-grid-wrap .ex-pc-featured { grid-column: span 1; flex-direction: column; }
    .cv-grid-wrap .ex-pc-featured .ex-pc-img-wrap { flex: none; padding-bottom: 92%; min-height: 0; }
    .cv-grid-wrap .ex-pc-featured .ex-pc-info { border-left: none; border-top: 0.5px solid var(--ex-bone-border); padding: 1rem 1.1rem 1.2rem; }

    /* Product card info compacta */
    .ex-pc-info { padding: 1rem 1.1rem 1.2rem; gap: 4px; }
    .ex-pc-name { font-size: 13px; }
    .ex-pc-price { font-size: 16px; }

    /* Trust */
    .ex-trust { flex-wrap: wrap; }
    .ex-trust-item { flex: 1 1 48%; border-bottom: 0.5px solid rgba(255,255,255,0.1); padding: 0.75rem 0.6rem; font-size: 10px; }
    .ex-trust-item:nth-child(2n) { border-right: none; }

    /* Catalog (legacy) */
    .ex-catalog { padding: 0 1.2rem 3rem; }

    /* Footer */
    .ex-footer-inner { padding: 1rem 1.2rem; flex-direction: column; align-items: flex-start; gap: 6px; }
    .ex-footer-copy { display: none; }
  }

  @media (max-width: 480px) {
    /* Grid mobile: 2 cols, gap más compacto */
    .ex-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }

    /* Featured no ocupa 2 cols en mobile */
    .ex-pc-featured { grid-column: span 1; flex-direction: column; }
    .ex-pc-featured .ex-pc-img-wrap { flex: none; padding-bottom: 92%; min-height: 0; }
    .ex-pc-featured .ex-pc-info { border-left: none; border-top: 0.5px solid var(--ex-bone-border); }

    /* Sort dropdown no se sale de pantalla */
    .cv-sort-dropdown { right: 0; left: auto; min-width: 170px; max-width: calc(100vw - 2.4rem); }

    /* Trust: 2x2 más compacto */
    .ex-trust-item { font-size: 9.5px; gap: 5px; }

    /* ForWhom: 1 col, cards más compactas */
    .fw-card { padding: 1.6rem 1.4rem 1.4rem; }
    .fw-card-footer { margin-top: 1.2rem; padding-top: 0.8rem; }

    /* WhyUs: texto ajustado */
    .wu-item-desc { font-size: 12.5px; }

    /* CatalogView header más compacto */
    .cv-header-title { font-size: 15px; }
    .cv-sort-btn { font-size: 10px; }

    /* Footer: solo logo */
    .ex-footer-inner { gap: 4px; }
    .ex-footer-right { display: none; }

    /* Catalog header legacy */
    .ex-catalog-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .hc-bg, .hc-slide, .br-card-bg, .fw-card-accent, .wu-item-bar,
    .ex-pc-img, .ex-pc-overlay, .ex-pc-cta-wrap, .ex-nav-link::after { transition: none !important; animation: none !important; }
    .hc-progress-bar { animation: none !important; width: 100% !important; }
  }
`
