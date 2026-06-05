import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useLocation, useNavigate as useRRNavigate, Link } from 'react-router-dom'
import useStoreData from '../useStoreData'
import { fmt, getInitials, getProductoImagenSrc, buildStoreBase, buildCartUrl, buildProductUrl } from '../templateUtils'
import MiniCart from '../../components/store/MiniCart'

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
    const base = buildProductUrl(p.id, slug)
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
          {p.descuento > 0 && !sinStock && <span className="ex-pc-badge-discount">-{p.descuento}%</span>}
          {stockBajo && !sinStock && <span className="ex-pc-badge-low">Últimas {p.stock}</span>}
          {sinStock && <span className="ex-pc-badge-out">Agotado</span>}
          {featured && !sinStock && !stockBajo && !p.descuento && <span className="ex-pc-badge-feat">Destacado</span>}
        </div>
      </div>
      <div className="ex-pc-info">
        <p className="ex-pc-name">{p.nombre || 'Sin nombre'}</p>
        {p.descripcion && <p className="ex-pc-sub">{p.descripcion.slice(0, featured ? 110 : 72)}{p.descripcion.length > (featured ? 110 : 72) ? '…' : ''}</p>}
        <div className="ex-pc-footer">
          <div className="ex-pc-price-wrap">
            {p.precio != null ? (
              p.descuento > 0 ? (
                <>
                  <span className="ex-pc-price-old">{fmt(p.precio)}</span>
                  <span className="ex-pc-price ex-pc-price-sale">{fmt(p.precio * (1 - p.descuento / 100))}</span>
                </>
              ) : (
                <span className="ex-pc-price">{fmt(p.precio)}</span>
              )
            ) : <span className="ex-pc-price-na">Consultar</span>}
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
  {
    num: '04',
    title: 'Garantía y soporte post-venta.',
    body: 'No desaparecemos después de la compra. Si tenés un problema con tu equipo, estamos para resolverlo — sin vueltas.',
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
          <div className="wu-stats">
            <div className="wu-stat">
              <span className="wu-stat-num">+500</span>
              <span className="wu-stat-label">envíos realizados</span>
            </div>
            <div className="wu-stat-divider" />
            <div className="wu-stat">
              <span className="wu-stat-num">6</span>
              <span className="wu-stat-label">marcas premium</span>
            </div>
          </div>
          <a
            href="https://wa.me/573243520379?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20un%20vaporizador"
            target="_blank"
            rel="noopener noreferrer"
            className="wu-cta"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hablar con un asesor
          </a>
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
    id: 'medicinal',
    label: 'El usuario medicinal',
    tagline: 'Buscás alivio, no recreación. Priorizás consistencia y dosificación exacta.',
    blocks: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M12 7V5m0 14v-2"/>
          </svg>
        ),
        title: 'Quién eres',
        text: 'Usás cannabis con un propósito claro: alivio del dolor, manejo del estrés o mejorar el sueño. Necesitás resultados reproducibles, no sorpresas.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
          </svg>
        ),
        title: 'Temperatura recomendada',
        text: '160–185 °C. Este rango activa el CBD y los terpenos sin degradar los compuestos activos. Vapor suave, efecto limpio y controlado.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2a7 7 0 017 7c0 4-7 13-7 13S5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        ),
        title: 'Tipo de carga',
        text: 'Flor seca de alta calidad, preferiblemente orgánica y con perfil de terpenos conocido. Evitá concentrados si estás comenzando.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        ),
        title: 'Qué buscás',
        text: 'Control de temperatura preciso, materiales médicos (acero, vidrio, cerámica), cero combustión, y discreción para uso en casa.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        ),
        title: 'Marca que te va',
        text: 'PAX (control preciso desde app), Storz & Bickel Mighty+ (estándar de la industria médica). Ambas tienen materiales certificados y temperatura exacta.',
      },
    ],
  },
  {
    id: 'sabores',
    label: 'El explorador de sabores',
    tagline: 'Te interesa la experiencia sensorial. Terpenos, aromas y matices de cada cepa.',
    blocks: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>
          </svg>
        ),
        title: 'Quién eres',
        text: 'Para vos, vapear es una experiencia. Notás la diferencia entre una cepa cítrica y una terrosa. El sabor importa tanto como el efecto.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
          </svg>
        ),
        title: 'Temperatura recomendada',
        text: '160–175 °C. La ventana dorada de los terpenos. A esta temperatura preservás los aromas volátiles antes de que se degraden con el calor.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2a7 7 0 017 7c0 4-7 13-7 13S5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        ),
        title: 'Tipo de carga',
        text: 'Flor fresca bien curada con terpenos intactos. Hachís de calidad también funciona perfectamente con convección.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          </svg>
        ),
        title: 'Qué buscás',
        text: 'Convección pura o híbrida, path de vidrio o acero inoxidable que no altere el sabor, y vapor frío para sesiones largas sin irritación.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        ),
        title: 'Marca que te va',
        text: 'Arizer (path de vidrio borosilicato puro, sabor sin igual), DynaVap (ritual térmico con llama, extracción artesanal de terpenos).',
      },
    ],
  },
  {
    id: 'onthego',
    label: 'El usuario on-the-go',
    tagline: 'Ritmo de vida activo. Rápido, discreto, que quepa en el bolsillo.',
    blocks: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>
          </svg>
        ),
        title: 'Quién eres',
        text: 'Tu vida no para. Buscás algo que se adapte a vos, no al revés. Discreción total, sin aromas fuertes ni rituales largos.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
          </svg>
        ),
        title: 'Temperatura recomendada',
        text: '185–200 °C. Sesiones cortas pero efectivas. Este rango entrega vapor denso en poco tiempo, ideal cuando no podés esperar.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2a7 7 0 017 7c0 4-7 13-7 13S5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        ),
        title: 'Tipo de carga',
        text: 'Flor molida fina para extracción rápida. Algunos modelos admiten cápsulas dosificadas que simplifican aún más la experiencia.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        ),
        title: 'Qué buscás',
        text: 'Carga USB-C rápida, batería que dure el día, calentamiento en menos de 30 segundos, y un diseño que no grite "vaporizador" en el bolsillo.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        ),
        title: 'Marca que te va',
        text: 'AirVape (ultradelgado, convección pura), PAX Mini (plug and play, tamaño mínimo), Boundless CF (potencia accesible, batería sólida).',
      },
    ],
  },
  {
    id: 'casa',
    label: 'El entusiasta de casa',
    tagline: 'Sesiones largas, sin apuros. Valorás el ritual tanto como el resultado.',
    blocks: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          </svg>
        ),
        title: 'Quién eres',
        text: 'En casa, el tiempo es tuyo. Preferís una sesión bien hecha a diez sesiones mediocres. El vapor abundante y el sabor puro son innegociables.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
          </svg>
        ),
        title: 'Temperatura recomendada',
        text: '195–210 °C. Vapor denso, efecto completo. A estas temperaturas activás todos los cannabinoides disponibles en el material.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2a7 7 0 017 7c0 4-7 13-7 13S5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        ),
        title: 'Tipo de carga',
        text: 'Flor, concentrados o wax según el modelo. Los desktop suelen tener cámaras grandes que permiten cargas generosas para sesiones grupales.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M2 12h20M12 2v20"/>
          </svg>
        ),
        title: 'Qué buscás',
        text: 'Vapor abundante y frío (con agua o ice catcher), potencia constante sin batería que se agote, y accesorios para personalizar la experiencia.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        ),
        title: 'Marca que te va',
        text: 'Storz & Bickel Volcano (el desktop icónico, incomparable), Arizer Extreme Q (desktop versátil con globo y látigo), ambos con años de confiabilidad probada.',
      },
    ],
  },
  {
    id: 'cigarro',
    label: 'El que viene del cigarro',
    tagline: 'Querés reducir el daño sin perder la sensación. Sin curva de aprendizaje.',
    blocks: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
          </svg>
        ),
        title: 'Quién eres',
        text: 'Venís del tabaco o de fumar cannabis. Ya conocés la sensación, pero querés algo más limpio, sin combustión, sin el daño que viene con el humo.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
          </svg>
        ),
        title: 'Temperatura recomendada',
        text: '185–200 °C. Familiar en sensación y densidad de vapor. Suficientemente cercano a lo que conocés para que la transición sea natural.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M12 2a7 7 0 017 7c0 4-7 13-7 13S5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        ),
        title: 'Tipo de carga',
        text: 'Flor seca. Simple, sin accesorios extra al principio. Una vez que dominás lo básico, podés explorar concentrados o cápsulas.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        ),
        title: 'Qué buscás',
        text: 'Algo intuitivo que no requiera manual. Un botón, una temperatura, listo. Sin calibraciones, sin aplicaciones, sin rituales complejos.',
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="18" height="18">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        ),
        title: 'Marca que te va',
        text: 'PAX (enciende y funciona, sin complicaciones), AirVape (liviano y familiar en la mano), Boundless CF (resultado inmediato, precio accesible).',
      },
    ],
  },
]

function ForWhomSection() {
  const [activeTab, setActiveTab] = useState(PROFILES[0].id)

  const profile = PROFILES.find((p) => p.id === activeTab)

  return (
    <section className="fw-root">
      <div className="fw-inner">
        <header className="fw-header">
          <div className="fw-kicker">
            <span className="fw-kicker-line" />
            <span className="fw-kicker-text">Guía de selección</span>
          </div>
          <h2 className="fw-title">¿Para quién es<br /><em>este vaporizador?</em></h2>
          <p className="fw-subtitle">Encontrá tu perfil. Conocé qué equipo, temperatura y técnica se adaptan a vos.</p>
        </header>

        {/* Tab bar */}
        <div className="fw-tabs" role="tablist">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activeTab === p.id}
              className={`fw-tab${activeTab === p.id ? ' fw-tab-active' : ''}`}
              onClick={() => setActiveTab(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="fw-panel" key={activeTab}>
          <p className="fw-panel-tagline">{profile.tagline}</p>
          <div className="fw-blocks">
            {profile.blocks.map((b) => (
              <div key={b.title} className="fw-block">
                <div className="fw-block-icon">{b.icon}</div>
                <div className="fw-block-content">
                  <h4 className="fw-block-title">{b.title}</h4>
                  <p className="fw-block-text">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
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
    detail: 'Tecnología de convección que preserva los terpenos y entrega vapor limpio, sin combustión.',
    img: '/heroes/airvape-banner.jpg',
    wide: true,
  },
  {
    name: 'PAX',
    tag: 'Gama premium',
    desc: 'El referente mundial del vaporizador portátil.',
    detail: 'Diseño minimalista de alta precisión con conectividad inteligente y control total desde tu teléfono.',
    img: '/heroes/pax-banner.jpg',
    wide: false,
  },
  {
    name: 'Arizer',
    tag: 'Desktop & Portátil',
    desc: 'Ingeniería canadiense, calidad sin concesiones.',
    detail: 'Reconocidos por su durabilidad y pureza de sabor. Favoritos de los conocedores más exigentes.',
    img: '/heroes/arizer-banner.jpg',
    wide: false,
  },
  {
    name: 'Storz & Bickel',
    tag: 'El estándar de oro',
    desc: 'Volcano, Mighty, Crafty+ — la cima de la tecnología.',
    detail: 'La marca alemana que definió la industria. Precisión clínica, materiales médicos, experiencia inigualable.',
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
          <span className="br-kicker-text">Marcas disponibles</span>
        </div>
        <p className="br-header-desc">Las marcas más reconocidas del mundo, disponibles en Colombia.</p>
      </div>

      <div className="br-grid">
        {BRANDS.map((b, i) => (
          <div
            key={b.name}
            className={`br-card${b.wide ? ' br-card-wide' : ''}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="br-card-bg" style={{ backgroundImage: `url(${b.img})` }} />
            <div className="br-card-overlay" />
            <div className="br-card-body">
              <div className="br-card-top">
                <span className="br-card-tag">{b.tag}</span>
              </div>
              <div className="br-card-bottom">
                <h3 className="br-card-name">{b.name}</h3>
                <p className="br-card-desc">{b.desc}</p>
                <p className="br-card-detail">{b.detail}</p>
              </div>
            </div>
          </div>
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
  },
  {
    img: '/heroes/dynavap.webp',
    brand: 'DynaVap',
    title: 'Sin batería',
    sub: 'Ritual térmico. Control total con solo una llama.',
  },
  {
    img: '/heroes/boundless.webp',
    brand: 'Boundless',
    title: 'Sin límites',
    sub: 'Potencia accesible. Vapor denso en cada sesión.',
  },
]

function HeroCarousel() {
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

function CatalogView({ catLabel, productos, slug, loading, onHome }) {
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
            <a href="#" className="cv-back" onClick={(e) => { e.preventDefault(); onHome() }} aria-label="Volver a la tienda">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tienda
            </a>
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
export default function ExclusiveStore({ slug: slugProp, tenantSlug }) {
  const {
    slug, productosFiltrados, tenantNombre, loading,
    colorPrimario, colorSecundario, colorTexto,
    busqueda, setBusqueda, searchOpen, setSearchOpen, mobileInputRef,
    productos,
    categorias, setCategoriaActiva,
  } = useStoreData(slugProp, tenantSlug)

  const location = useLocation()
  const navigate = useRRNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const searchBarRef = useRef(null)

  // URL is the single source of truth for view/category
  const urlParams = new URLSearchParams(location.search)
  const urlCat = urlParams.get('cat') || ''
  const urlQ = urlParams.get('q') || ''
  const view = (urlCat || urlQ) ? 'catalog' : 'landing'
  const activeCatLabel = urlCat

  // Sync filter state from URL
  useEffect(() => {
    if (urlCat) setCategoriaActiva(urlCat)
    else if (urlQ) { setBusqueda(urlQ); setSearchOpen(true); setCategoriaActiva('') }
    else { setCategoriaActiva('') }
  }, [location.search]) // eslint-disable-line react-hooks/exhaustive-deps

  const storeBase = buildStoreBase(slug)

  const handleNavCat = (label) => {
    navigate(`${storeBase}?cat=${encodeURIComponent(label)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToLanding = () => {
    setBusqueda('')
    setSearchOpen(false)
    navigate(storeBase)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Al borrar la búsqueda → volver al landing
  useEffect(() => {
    if (!busqueda.trim() && urlQ) {
      navigate(storeBase)
    }
  }, [busqueda]) // eslint-disable-line react-hooks/exhaustive-deps

  // Confirmar búsqueda: cerrar dropdown y abrir catálogo completo
  const handleSearchConfirm = useCallback(() => {
    if (!busqueda.trim()) return
    setDropdownVisible(false)
    setCategoriaActiva('')
    navigate(`${storeBase}?q=${encodeURIComponent(busqueda.trim())}`)
  }, [busqueda, storeBase, navigate, setCategoriaActiva]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cerrar buscador con la X: si hay texto confirma búsqueda, si no cierra limpio
  const handleSearchClose = useCallback(() => {
    if (busqueda.trim()) {
      handleSearchConfirm()
    }
    setSearchOpen(false)
    setDropdownVisible(false)
  }, [busqueda, handleSearchConfirm, setSearchOpen])

  // Sugerencias para el dropdown de búsqueda (max 6, solo cuando hay texto)
  const sugerencias = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q || q.length < 1) return []
    return productos
      .filter((p) => p.tipo === 'producto' && (
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q) ||
        (p.categoria || '').toLowerCase().includes(q) ||
        (p.subcategoria || '').toLowerCase().includes(q) ||
        (Array.isArray(p.caracteristicas) && p.caracteristicas.some((c) => c.toLowerCase().includes(q))) ||
        (Array.isArray(p.especificaciones) && p.especificaciones.some((e) => e.toLowerCase().includes(q)))
      ))
      .slice(0, 6)
  }, [productos, busqueda])

  // Cerrar dropdown al hacer click fuera del search bar
  useEffect(() => {
    if (!dropdownVisible) return
    const handler = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setDropdownVisible(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownVisible])

  // Mostrar dropdown cuando hay texto y el buscador está abierto
  useEffect(() => {
    setDropdownVisible(searchOpen && busqueda.trim().length > 0)
  }, [busqueda, searchOpen])

  const handleSugerenciaClick = useCallback((producto) => {
    const base = buildProductUrl(producto.id, slug)
    setBusqueda('')
    setSearchOpen(false)
    setDropdownVisible(false)
    navigate(base)
  }, [slug, navigate, setBusqueda, setSearchOpen])


  const cssVars = {
    '--ex-sage':     colorPrimario   || '#3d4f3a',
    '--ex-sage-mid': colorPrimario   ? `${colorPrimario}cc` : '#5a7055',
    '--ex-bone':     colorSecundario || '#f7f5f0',
    '--ex-ink':      colorTexto      || '#2c3028',
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ex-root" style={cssVars}>

        {/* TOPBAR */}
        <Topbar />

        {/* NAV */}
        <nav className="ex-nav">
          <div className="ex-nav-inner">

            {/* Hamburger mobile */}
            <button type="button" className="ex-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
              <span /><span /><span />
            </button>

            {/* Logo — clickeable para volver al landing cuando se está en otra vista */}
            <button
              type="button"
              className={`ex-nav-logo${view !== 'landing' ? ' ex-nav-logo-btn' : ''}`}
              onClick={view !== 'landing' ? handleBackToLanding : undefined}
              aria-label={view !== 'landing' ? 'Volver a la tienda' : undefined}
            >
              <span className="ex-logo-name">{tenantNombre || 'STORE'}</span>
              <span className="ex-logo-tag">Tienda oficial</span>
            </button>

            {/* Divisor logo / links */}
            <div className="ex-nav-divider" aria-hidden="true" />

            {/* Category links */}
            <div className="ex-nav-center">
              {[
                { label: 'Pen' },
                { label: 'Portátiles' },
                { label: 'Escritorio' },
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
                onClick={() => {
                  if (searchOpen) {
                    handleSearchClose()
                  } else {
                    setSearchOpen(true)
                  }
                }}
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
          <div
            ref={searchBarRef}
            className={`ex-nav-search-bar${searchOpen ? ' ex-nav-search-bar-open' : ''}`}
          >
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
                onFocus={() => { if (busqueda.trim()) setDropdownVisible(true) }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchConfirm() }}
                autoComplete="off"
              />
              {busqueda ? (
                <button type="button" className="ex-nav-search-clear" onClick={() => { setBusqueda(''); setDropdownVisible(false) }} aria-label="Limpiar">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              ) : (
                <button type="button" className="ex-nav-search-clear" onClick={() => { setSearchOpen(false); setDropdownVisible(false) }} aria-label="Cerrar buscador">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Dropdown de sugerencias */}
            {dropdownVisible && (
              <div className="ex-search-dropdown" role="listbox" aria-label="Sugerencias de búsqueda">
                {sugerencias.length > 0 ? (
                  <>
                    <div className="ex-search-dropdown-header">
                      <span className="ex-search-dropdown-label">Productos</span>
                      <span className="ex-search-dropdown-count">{sugerencias.length} resultado{sugerencias.length !== 1 ? 's' : ''}</span>
                    </div>
                    {sugerencias.map((p) => {
                      const imgSrc = getProductoImagenSrc(p, 0)
                      const sinStock = p.tipo === 'producto' && p.stock != null && p.stock <= 0
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="option"
                          className="ex-search-item"
                          onClick={() => handleSugerenciaClick(p)}
                        >
                          <div className="ex-search-item-thumb">
                            {imgSrc
                              ? <img src={imgSrc} alt="" className="ex-search-item-img" />
                              : <span className="ex-search-item-initials">{getInitials(p.nombre)}</span>
                            }
                          </div>
                          <div className="ex-search-item-info">
                            <span className="ex-search-item-name">{p.nombre}</span>
                            {p.categoria && <span className="ex-search-item-cat">{p.categoria}</span>}
                          </div>
                          <div className="ex-search-item-right">
                            {p.precio != null && <span className="ex-search-item-price">{fmt(p.precio)}</span>}
                            {sinStock && <span className="ex-search-item-out">Agotado</span>}
                          </div>
                        </button>
                      )
                    })}
                  </>
                ) : (
                  <div className="ex-search-empty">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <span>Sin resultados para <em>"{busqueda}"</em></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu drawer */}
          {menuOpen && (
            <div className="ex-mob-menu">
              {[
                { label: 'Pen' },
                { label: 'Portátiles' },
                { label: 'Escritorio' },
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
            catLabel={activeCatLabel || (busqueda.trim() ? `"${busqueda.trim()}"` : '')}
            productos={productosFiltrados}
            slug={slug}
            loading={loading}
            onHome={handleBackToLanding}
          />
        )}

        {/* ── LANDING VIEW ── */}
        {view === 'landing' && (<>

        {/* HERO CAROUSEL */}
        <HeroCarousel />

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

        {/* OFERTAS */}
        {productos.filter((p) => p.tipo === 'producto' && p.descuento > 0 && p.stock > 0).length > 0 && (
          <section className="ex-offers-section">
            <div className="ex-offers-header">
              <div className="ex-offers-eyebrow">Descuentos especiales</div>
              <h2 className="ex-offers-title">Ofertas</h2>
              <button type="button" className="ex-offers-see-all" onClick={() => handleNavCat('Ofertas')}>
                Ver todas →
              </button>
            </div>
            <div className="ex-offers-grid">
              {productos
                .filter((p) => p.tipo === 'producto' && p.descuento > 0 && p.stock > 0)
                .slice(0, 4)
                .map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} slug={slug} cat="Ofertas" />
                ))}
            </div>
          </section>
        )}

        {/* PARA QUIÉN */}
        <ForWhomSection />

        {/* POR QUÉ NOSOTROS */}
        <WhyUsSection />

        </>)}

        {/* FOOTER */}
        <footer className="ex-footer">
          <div className="ex-footer-top">
            {/* Col 1 — Newsletter */}
            <div className="ex-footer-col ex-footer-col-news">
              <p className="ex-footer-eyebrow">Únete a la comunidad</p>
              <h3 className="ex-footer-news-title">Recibe novedades<br />y ofertas exclusivas</h3>
              <form className="ex-footer-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Tu correo electrónico" className="ex-footer-input" />
                <button type="submit" className="ex-footer-sub-btn">Suscribirse</button>
              </form>
            </div>

            {/* Col 2 — Categorías */}
            <div className="ex-footer-col">
              <p className="ex-footer-col-title">Categorías</p>
              <ul className="ex-footer-list">
                {['Portátiles', 'Desktop', 'Gama Premium', 'Accesorios'].map((item) => (
                  <li key={item}>
                    <button type="button" className="ex-footer-list-btn" onClick={() => handleNavCat(item)}>{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Servicio al cliente */}
            <div className="ex-footer-col">
              <p className="ex-footer-col-title">Servicio al cliente</p>
              <ul className="ex-footer-list">
                <li><Link to={`${storeBase}/blog`} className="ex-footer-list-item ex-footer-flink">Blog</Link></li>
                <li><Link to={`${storeBase}/politicas/garantia`} className="ex-footer-list-item ex-footer-flink">Garantía de satisfacción</Link></li>
                <li><Link to={`${storeBase}/politicas/reembolso`} className="ex-footer-list-item ex-footer-flink">Devoluciones</Link></li>
                <li><Link to={`${storeBase}/politicas/envio`} className="ex-footer-list-item ex-footer-flink">Envíos a Colombia</Link></li>
                <li><Link to={`${storeBase}/metodos-pago`} className="ex-footer-list-item ex-footer-flink">Métodos de pago</Link></li>
              </ul>
            </div>

            {/* Col 4 — Información / Contacto */}
            <div className="ex-footer-col">
              <p className="ex-footer-col-title">Contacto</p>
              <ul className="ex-footer-list">
                <li><span className="ex-footer-list-item">Lun – Vie: 9:00 am – 6:00 pm</span></li>
                <li><span className="ex-footer-list-item">Sáb: 9:00 am – 1:00 pm</span></li>
              </ul>
              <div className="ex-footer-social">
                {[
                  { label: 'Facebook', href: 'https://www.facebook.com/vaporizadoresba.col/', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'Instagram', href: 'https://www.instagram.com/vaporizadoresba.col/', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                  { label: 'TikTok', href: 'https://www.tiktok.com/@vaporizadoresba?_t=8ZjoHfUOmKk&_r=1', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z' },
                ].map(({ label, href, path }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="ex-footer-social-btn">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d={path} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ex-footer-bottom">
            <div className="ex-footer-bottom-inner">
              <div className="ex-footer-bottom-brand">
                <span className="ex-footer-logo-mark">◈</span>
                <span className="ex-footer-logo-name">{tenantNombre || 'VP LUXURY'}</span>
              </div>
              <p className="ex-footer-copy-line">© {new Date().getFullYear()} {tenantNombre || 'VP Luxury'} · Todos los derechos reservados</p>
              <div className="ex-footer-bottom-links">
                <span className="ex-footer-bottom-link">Privacidad</span>
                <span className="ex-footer-bottom-sep">·</span>
                <span className="ex-footer-bottom-link">Términos</span>
              </div>
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
  .ex-nav-logo { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 3px; flex-shrink: 0; cursor: default; padding-right: 0; background: none; border: none; text-align: left; }
  .ex-nav-logo-btn { cursor: pointer; transition: opacity 0.15s; }
  .ex-nav-logo-btn:hover { opacity: 0.65; }
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
  .ex-nav-search-bar { max-height: 0; opacity: 0; pointer-events: none; transition: max-height 0.28s ease, opacity 0.2s ease; background: var(--ex-white); position: relative; }
  .ex-nav-search-bar-open { pointer-events: auto; }
  .ex-nav-search-bar-open { max-height: 58px; opacity: 1; border-bottom: 1px solid var(--ex-bone-border); overflow: visible; }
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
  .br-card { position: relative; display: block; overflow: hidden; background: var(--ex-bone-mid); height: 240px; }
  .br-card-wide { grid-column: span 2; height: 300px; }

  /* Imagen fondo — sutil zoom al cargar, sin interacción */
  .br-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: saturate(0.8); }

  /* Overlay — más denso para que el texto editorial sea siempre legible */
  .br-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,24,18,0.82) 0%, rgba(20,24,18,0.35) 50%, rgba(20,24,18,0.08) 100%); }

  /* Contenido */
  .br-card-body { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 1.4rem 1.8rem; z-index: 2; }

  /* Tag arriba izquierda */
  .br-card-top {}
  .br-card-tag { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.1); border: 0.5px solid rgba(255,255,255,0.2); padding: 4px 10px; font-family: 'Inter', sans-serif; font-weight: 500; backdrop-filter: blur(4px); }

  /* Nombre + desc + detail — siempre visibles, sin hover */
  .br-card-bottom { display: flex; flex-direction: column; gap: 6px; }
  .br-card-name { font-family: 'Playfair Display', serif; font-size: clamp(20px, 2.6vw, 30px); font-weight: 400; color: #fff; line-height: 1.08; margin-bottom: 2px; }
  .br-card-desc { font-size: 12.5px; color: rgba(255,255,255,0.82); font-family: 'Inter', sans-serif; font-weight: 400; letter-spacing: 0.01em; line-height: 1.5; }
  .br-card-detail { font-size: 11px; color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: 0.02em; line-height: 1.6; display: none; }
  .br-card-wide .br-card-detail { display: block; }

  /* Sin imagen — fallback con color */
  .br-card-bg[style*="url(/heroes"] { background-color: var(--ex-sage); }

  /* Responsive */
  @media (max-width: 768px) {
    .br-root { padding: 2.5rem 0 3rem; }
    .br-header { padding: 0 1.5rem 1rem; margin-bottom: 0; }
    .br-header-desc { display: none; }
    .br-card-wide { grid-column: span 2; height: 220px; }
    .br-card { height: 180px; }
    .br-card-name { font-size: 20px; }
    .br-card-detail { display: none !important; }
  }
  @media (max-width: 480px) {
    .br-grid { grid-template-columns: 1fr; }
    .br-card-wide { grid-column: span 1; }
  }

  /* WHY US SECTION */
  .wu-root { background: var(--ex-sage); padding: 4rem 2.5rem; }
  .wu-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.8fr; gap: 3.5rem; align-items: center; }

  .wu-left { display: flex; flex-direction: column; }
  .wu-kicker { display: flex; align-items: center; gap: 10px; margin-bottom: 1.2rem; }
  .wu-kicker-line { display: block; width: 24px; height: 0.5px; background: var(--ex-gold); flex-shrink: 0; }
  .wu-kicker-text { font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ex-gold); font-weight: 500; font-family: 'Inter', sans-serif; }
  .wu-heading { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3.2vw, 42px); font-weight: 400; color: rgba(247,245,240,0.95); line-height: 1.18; margin: 0 0 1.6rem; }
  .wu-heading em { font-style: italic; color: var(--ex-gold); }

  .wu-stats { display: flex; align-items: center; gap: 1.4rem; margin-bottom: 1.6rem; }
  .wu-stat { display: flex; flex-direction: column; gap: 3px; }
  .wu-stat-num { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 400; color: var(--ex-gold); line-height: 1; }
  .wu-stat-label { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(247,245,240,0.45); font-weight: 500; }
  .wu-stat-divider { width: 0.5px; height: 32px; background: rgba(255,255,255,0.15); flex-shrink: 0; }

  .wu-cta { display: inline-flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,245,240,0.75); background: rgba(247,245,240,0.06); border: 0.5px solid rgba(247,245,240,0.15); border-radius: 2px; padding: 10px 16px; text-decoration: none; transition: background 0.2s, border-color 0.2s, color 0.2s; align-self: flex-start; }
  .wu-cta:hover { background: rgba(247,245,240,0.1); border-color: rgba(247,245,240,0.28); color: rgba(247,245,240,0.95); }

  .wu-right { display: flex; flex-direction: column; }

  .wu-item { position: relative; padding: 1.4rem 0 1.4rem 1.5rem; border-top: 0.5px solid rgba(255,255,255,0.12); display: grid; grid-template-columns: 2.8rem 1fr; gap: 1.4rem; align-items: start; cursor: default; }
  .wu-item:last-child { border-bottom: 0.5px solid rgba(255,255,255,0.12); }

  .wu-item-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 1.5px; background: var(--ex-gold); transform: scaleY(0); transform-origin: top; transition: transform 0.35s cubic-bezier(.25,.8,.25,1); }
  .wu-item-hov .wu-item-bar { transform: scaleY(1); }

  .wu-num { font-family: 'Playfair Display', serif; font-size: 12px; font-style: italic; color: var(--ex-gold); letter-spacing: 0.06em; line-height: 1; padding-top: 5px; user-select: none; opacity: 0.8; }

  .wu-item-body { display: flex; flex-direction: column; gap: 7px; }
  .wu-item-title { font-family: 'Playfair Display', serif; font-size: clamp(15px, 1.4vw, 18px); font-weight: 400; color: rgba(247,245,240,0.95); line-height: 1.3; margin: 0; transition: color 0.2s; }
  .wu-item-hov .wu-item-title { color: var(--ex-gold); }
  .wu-item-desc { font-size: 12.5px; color: rgba(247,245,240,0.6); line-height: 1.65; font-family: 'Inter', sans-serif; font-weight: 400; margin: 0; }

  @media (max-width: 900px) {
    .wu-inner { grid-template-columns: 1fr; gap: 2rem; max-width: 640px; }
    .wu-left { position: static; }
    .wu-heading { font-size: clamp(28px, 7vw, 40px); }
  }
  @media (max-width: 640px) {
    .wu-root { padding: 2.5rem 1.5rem; }
    .wu-item { grid-template-columns: 2.4rem 1fr; gap: 1rem; padding: 1.2rem 0 1.2rem 1.2rem; }
    .wu-stats { margin-bottom: 1.2rem; }
    .wu-cta { width: 100%; justify-content: center; min-height: 44px; }
  }

  /* FOR WHOM SECTION */
  .fw-root { background: var(--ex-bone); padding: 5rem 2.5rem 5.5rem; }
  .fw-inner { max-width: 1200px; margin: 0 auto; }

  .fw-header { text-align: center; margin-bottom: 3rem; }
  .fw-kicker { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 1.2rem; }
  .fw-kicker-line { display: block; width: 24px; height: 0.5px; background: var(--ex-sage-mid); }
  .fw-kicker-text { font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--ex-sage-mid); font-weight: 500; font-family: 'Inter', sans-serif; }
  .fw-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: var(--ex-ink); line-height: 1.2; margin: 0 0 0.9rem; }
  .fw-title em { font-style: italic; color: var(--ex-sage); }
  .fw-subtitle { font-size: 13px; color: var(--ex-ink-soft); letter-spacing: 0.04em; font-family: 'Inter', sans-serif; }

  /* Tab bar */
  .fw-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--ex-bone-border); margin-bottom: 0; overflow-x: auto; scrollbar-width: none; }
  .fw-tabs::-webkit-scrollbar { display: none; }
  .fw-tab { flex-shrink: 0; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em; color: var(--ex-ink-soft); padding: 0.85rem 1.4rem; transition: color 0.18s, border-color 0.18s; white-space: nowrap; margin-bottom: -1px; }
  .fw-tab:hover { color: var(--ex-ink); }
  .fw-tab-active { color: var(--ex-sage) !important; border-bottom-color: var(--ex-sage); font-weight: 600; }

  /* Panel */
  .fw-panel { background: var(--ex-white); border: 0.5px solid var(--ex-bone-border); border-top: none; padding: 2.4rem 2.8rem 2.8rem; animation: fwFadeIn 0.22s ease both; }
  @keyframes fwFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fw-panel-tagline { font-family: 'Playfair Display', serif; font-size: clamp(16px, 2vw, 20px); font-weight: 400; font-style: italic; color: var(--ex-ink-mid); margin: 0 0 2rem; line-height: 1.45; border-left: 2px solid var(--ex-sage); padding-left: 1.1rem; }

  /* Blocks grid */
  .fw-blocks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem; }
  .fw-block { display: flex; gap: 14px; align-items: flex-start; }
  .fw-block-icon { flex-shrink: 0; color: var(--ex-sage); margin-top: 2px; }
  .fw-block-content { display: flex; flex-direction: column; gap: 5px; }
  .fw-block-title { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; color: var(--ex-ink); margin: 0; }
  .fw-block-text { font-family: 'Inter', sans-serif; font-size: 12.5px; color: var(--ex-ink-soft); line-height: 1.65; margin: 0; }

  @media (max-width: 1024px) {
    .fw-blocks { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .fw-root { padding: 3.5rem 1.5rem 4rem; }
    .fw-tab { font-size: 10.5px; padding: 0.75rem 1rem; }
    .fw-panel { padding: 1.6rem 1.4rem 2rem; }
    .fw-blocks { grid-template-columns: 1fr; gap: 1.2rem; }
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
  .cv-back { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,245,240,0.85); background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; padding: 4px 8px 4px 0; min-height: 44px; white-space: nowrap; transition: color 0.15s, opacity 0.15s; flex-shrink: 0; text-decoration: none; }
  .cv-back:hover { color: #fff; opacity: 0.85; }
  .cv-header-sep { color: rgba(247,245,240,0.2); font-size: 12px; flex-shrink: 0; }
  .cv-header-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 400; font-style: italic; color: rgba(247,245,240,0.95); line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
  .cv-header-badge { display: inline-flex; align-items: center; font-size: 10px; font-weight: 600; color: rgba(184,154,90,0.8); font-family: 'Inter', sans-serif; background: rgba(184,154,90,0.12); border: 1px solid rgba(184,154,90,0.22); padding: 2px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.04em; }

  .cv-sort-wrap { position: relative; flex-shrink: 0; }
  .cv-sort-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 0.07em; color: rgba(247,245,240,0.9); background: rgba(247,245,240,0.12); border: 1px solid rgba(247,245,240,0.3); padding: 6px 12px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.15s, color 0.15s, border-color 0.15s; border-radius: 3px; min-height: 32px; }
  .cv-sort-btn:hover { background: rgba(247,245,240,0.2); color: #fff; border-color: rgba(247,245,240,0.5); }
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
  .ex-pc-badge-feat     { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: var(--ex-gold); color: var(--ex-white); border-radius: 20px; }
  .ex-pc-badge-low      { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: var(--ex-gold); color: var(--ex-white); border-radius: 20px; }
  .ex-pc-badge-out      { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: rgba(247,245,240,0.92); color: var(--ex-ink-soft); border-radius: 20px; }
  .ex-pc-badge-discount { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; background: #c0392b; color: #fff; border-radius: 20px; font-weight: 700; }
  .ex-pc-info { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; gap: 5px; }
  .ex-pc-name { font-size: 13.5px; font-weight: 500; color: var(--ex-ink); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-sub { font-size: 11px; color: var(--ex-ink-soft); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-pc-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .ex-pc-price-wrap { display: flex; flex-direction: column; gap: 2px; }
  .ex-pc-price { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--ex-ink); letter-spacing: 0.01em; line-height: 1; }
  .ex-pc-price-sale { color: #c0392b; }
  .ex-pc-price-old  { font-size: 12px; color: var(--ex-ink-soft); text-decoration: line-through; line-height: 1; }
  .ex-pc-price-na { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); }
  /* Sección Ofertas en landing */
  .ex-offers-section { padding: 4rem 2rem 3rem; max-width: 1200px; margin: 0 auto; }
  .ex-offers-header { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 2rem; }
  .ex-offers-eyebrow { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #c0392b; font-weight: 600; }
  .ex-offers-title { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--ex-ink); margin: 0; flex: 1; }
  .ex-offers-see-all { font-size: 12px; letter-spacing: 0.06em; color: var(--ex-gold); background: none; border: none; cursor: pointer; padding: 0; }
  .ex-offers-see-all:hover { text-decoration: underline; }
  .ex-offers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; }
  @media (max-width: 900px) { .ex-offers-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .ex-offers-grid { grid-template-columns: repeat(2, 1fr); gap: 0.8rem; } .ex-offers-section { padding: 2.5rem 1rem 2rem; } }
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
  .ex-footer { background: var(--ex-ink); overflow-x: hidden; }

  .ex-footer-top { max-width: 1280px; margin: 0 auto; padding: 3.5rem 2.5rem 3rem; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; border-bottom: 1px solid rgba(247,245,240,0.08); }

  .ex-footer-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-gold); margin-bottom: 10px; }
  .ex-footer-news-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: rgba(247,245,240,0.92); line-height: 1.3; margin-bottom: 1.4rem; }
  .ex-footer-form { display: flex; gap: 0; margin-bottom: 10px; border: 1px solid rgba(247,245,240,0.15); border-radius: 4px; overflow: hidden; }
  .ex-footer-input { flex: 1; background: rgba(247,245,240,0.06); border: none; padding: 10px 14px; font-size: 12px; color: rgba(247,245,240,0.85); font-family: 'Inter', sans-serif; outline: none; }
  .ex-footer-input::placeholder { color: rgba(247,245,240,0.35); }
  .ex-footer-sub-btn { background: var(--ex-gold); color: var(--ex-ink); border: none; padding: 10px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; transition: background 0.18s; }
  .ex-footer-sub-btn:hover { background: #c9aa6a; }
  .ex-footer-consent { font-size: 10px; color: rgba(247,245,240,0.3); line-height: 1.5; }
  .ex-footer-flink { color: rgba(247,245,240,0.5); text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
  .ex-footer-flink:hover { color: rgba(247,245,240,0.85); }

  .ex-footer-col-title { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(247,245,240,0.4); margin-bottom: 1.1rem; }
  .ex-footer-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .ex-footer-list-btn { background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(247,245,240,0.65); padding: 0; transition: color 0.15s; text-align: left; }
  .ex-footer-list-btn:hover { color: rgba(247,245,240,0.95); }
  .ex-footer-list-item { font-size: 13px; color: rgba(247,245,240,0.55); line-height: 1.5; }
  .ex-footer-wa-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(247,245,240,0.65); text-decoration: none; transition: color 0.15s; }
  .ex-footer-wa-link:hover { color: #25D366; }

  .ex-footer-social { display: flex; gap: 8px; margin-top: 1.4rem; }
  .ex-footer-social-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(247,245,240,0.14); display: flex; align-items: center; justify-content: center; color: rgba(247,245,240,0.5); transition: border-color 0.18s, color 0.18s, background 0.18s; }
  .ex-footer-social-btn:hover { border-color: var(--ex-gold); color: var(--ex-gold); background: rgba(184,154,90,0.08); }

  .ex-footer-bottom { border-top: 1px solid rgba(247,245,240,0.06); }
  .ex-footer-bottom-inner { max-width: 1280px; margin: 0 auto; padding: 1.3rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .ex-footer-bottom-brand { display: flex; align-items: center; gap: 8px; }
  .ex-footer-logo-mark { font-size: 15px; color: var(--ex-gold); opacity: 0.8; }
  .ex-footer-logo-name { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; color: rgba(247,245,240,0.7); text-transform: uppercase; }
  .ex-footer-copy-line { font-size: 10.5px; color: rgba(247,245,240,0.28); letter-spacing: 0.04em; }
  .ex-footer-bottom-links { display: flex; align-items: center; gap: 8px; }
  .ex-footer-bottom-link { font-size: 10.5px; color: rgba(247,245,240,0.35); cursor: default; }
  .ex-footer-bottom-sep { font-size: 10px; color: rgba(247,245,240,0.2); }

  /* Touch targets: add button must be 44×44 on mobile */
  @media (hover: none) {
    .ex-pc-add { width: 44px; height: 44px; }
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
    .ex-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2.5rem 1.5rem 2rem; }
    .ex-footer-bottom-inner { padding: 1.1rem 1.5rem; }
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

    /* WhyUs: texto ajustado */
    .wu-item-desc { font-size: 12.5px; }

    /* CatalogView header más compacto */
    .cv-header-title { font-size: 15px; }
    .cv-sort-btn { font-size: 10px; }

    /* Footer mobile */
    .ex-footer-top { grid-template-columns: 1fr; gap: 1.8rem; padding: 2rem 1.2rem 1.8rem; }
    .ex-footer-bottom-inner { flex-direction: column; align-items: flex-start; gap: 4px; padding: 1rem 1.2rem; }
    .ex-footer-bottom-links { display: none; }

    /* Catalog header legacy */
    .ex-catalog-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .hc-bg, .hc-slide, .br-card-bg, .wu-item-bar,
    .ex-pc-img, .ex-pc-overlay, .ex-pc-cta-wrap, .ex-nav-link::after { transition: none !important; animation: none !important; }
    .hc-progress-bar { animation: none !important; width: 100% !important; }
  }

  /* ── SEARCH DROPDOWN ── */
  .ex-search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--ex-white);
    border: 0.5px solid var(--ex-bone-border);
    border-top: none;
    box-shadow: 0 12px 32px rgba(44,48,40,0.10), 0 2px 8px rgba(44,48,40,0.06);
    z-index: 100;
    animation: exDropIn 0.18s ease both;
    overflow: hidden;
  }
  @keyframes exDropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ex-search-dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px 8px;
    border-bottom: 0.5px solid var(--ex-bone-border);
  }
  .ex-search-dropdown-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ex-ink-soft);
    font-family: 'Inter', sans-serif;
  }
  .ex-search-dropdown-count {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--ex-sage-mid);
    font-family: 'Inter', sans-serif;
  }

  .ex-search-item {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 10px 18px;
    background: none;
    border: none;
    border-bottom: 0.5px solid var(--ex-bone-border);
    cursor: pointer;
    text-align: left;
    transition: background 0.12s;
    min-height: 60px;
  }
  .ex-search-item:last-child { border-bottom: none; }
  .ex-search-item:hover { background: var(--ex-bone); }
  .ex-search-item:hover .ex-search-item-name { color: var(--ex-sage); }

  .ex-search-item-thumb {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    background: var(--ex-bone-mid);
    border: 0.5px solid var(--ex-bone-border);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ex-search-item-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
  }
  .ex-search-item-initials {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    color: var(--ex-sage-mist);
  }

  .ex-search-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .ex-search-item-name {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--ex-ink);
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.12s;
  }
  .ex-search-item-cat {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ex-ink-soft);
    font-family: 'Inter', sans-serif;
  }

  .ex-search-item-right {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
  }
  .ex-search-item-price {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    color: var(--ex-ink);
    line-height: 1;
    white-space: nowrap;
  }
  .ex-search-item-out {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ex-ink-soft);
    font-family: 'Inter', sans-serif;
  }

  .ex-search-empty {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 18px;
    font-size: 12.5px;
    color: var(--ex-ink-soft);
    font-family: 'Inter', sans-serif;
  }
  .ex-search-empty svg { flex-shrink: 0; color: var(--ex-sage-mist); }
  .ex-search-empty em { font-style: italic; color: var(--ex-ink-mid); font-family: 'Playfair Display', serif; }

  @media (max-width: 768px) {
    .ex-search-item { padding: 10px 14px; gap: 11px; }
    .ex-search-dropdown-header { padding: 8px 14px 7px; }
    .ex-search-empty { padding: 16px 14px; }
    .ex-search-item-name { font-size: 12.5px; }
    .ex-search-item-price { font-size: 13px; }
  }
`
