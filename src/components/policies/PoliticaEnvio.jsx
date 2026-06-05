import { useParams, useNavigate, Link } from 'react-router-dom'
import { isCustomDomain } from '../../utils/api'

export default function PoliticaEnvio() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const contactUrl = isCustomDomain() ? '/contactanos' : `/${slug}/tienda/contactanos`

  function handleBack() {
    if (isCustomDomain()) {
      navigate('/')
    } else {
      navigate(`/${slug}/tienda`)
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="pe-wrapper">

        <nav className="pe-nav">
          <button className="pe-back" onClick={handleBack}>← Volver a la tienda</button>
        </nav>

        {/* HERO */}
        <div className="pe-hero">
          <div className="pe-hero-inner">
            <p className="pe-eyebrow">Políticas de la tienda</p>
            <h1 className="pe-title">Política de <em>Envío</em></h1>
            <p className="pe-subtitle">Despachos desde Cali a todo Colombia.</p>
          </div>
        </div>

        <div className="pe-content">
          <div className="pe-container">

            {/* HIGHLIGHTS */}
            <div className="pe-highlights">
              <div className="pe-highlight">
                <div className="pe-highlight-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <p className="pe-highlight-label">Envío gratis</p>
                <p className="pe-highlight-val">desde $200.000</p>
              </div>
              <div className="pe-highlight">
                <div className="pe-highlight-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <p className="pe-highlight-label">Mismo día</p>
                <p className="pe-highlight-val">pedidos antes 3pm</p>
              </div>
              <div className="pe-highlight">
                <div className="pe-highlight-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <p className="pe-highlight-label">1–4 días hábiles</p>
                <p className="pe-highlight-val">Servientrega / Interrapidísimo</p>
              </div>
              <div className="pe-highlight">
                <div className="pe-highlight-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <p className="pe-highlight-label">Empaque discreto</p>
                <p className="pe-highlight-val">sin etiquetas de producto</p>
              </div>
            </div>

            {/* ENVÍO GRATIS */}
            <h2 className="pe-section-title">Envío gratis</h2>
            <p className="pe-body">
              Ofrecemos envío gratuito en todos los pedidos iguales o superiores a{' '}
              <strong>$200.000</strong> dentro de Colombia a través de{' '}
              <strong>Servientrega</strong> o <strong>Interrapidísimo</strong>.
            </p>

            {/* TIEMPO DE ENVÍO */}
            <h2 className="pe-section-title">Tiempo de envío</h2>

            <div className="pe-time-grid">
              <div className="pe-time-card pe-time-card--green">
                <p className="pe-time-badge">Mismo día</p>
                <p className="pe-time-desc">Pedidos realizados antes de las <strong>3:00 pm</strong> de lunes a viernes.</p>
              </div>
              <div className="pe-time-card">
                <p className="pe-time-badge pe-time-badge--gold">Siguiente hábil</p>
                <p className="pe-time-desc">Pedidos realizados después de las <strong>3:00 pm</strong> o fines de semana.</p>
              </div>
            </div>

            <p className="pe-body">
              Los usuarios podrán ver la disponibilidad de los artículos antes de la compra. Nos
              comunicaremos contigo si por alguna razón surge un retraso.
            </p>
            <p className="pe-body">
              En caso de no tener disponibilidad inmediata, el producto será despachado en un máximo de{' '}
              <strong>20 días hábiles</strong>. Procuraremos hacer el envío en el menor tiempo posible.
            </p>

            {/* RETIRO EN OFICINA */}
            <h2 className="pe-section-title">Retiro en oficina · Cali</h2>
            <div className="pe-callout">
              <p>
                Puedes retirar tu compra en nuestra oficina en Cali previo acuerdo de horario.{' '}
                <strong>Lunes a viernes: 2:00 pm – 6:00 pm.</strong>
              </p>
            </div>

            {/* ENVÍO DISCRETO */}
            <h2 className="pe-section-title">Envío discreto</h2>
            <p className="pe-body">
              Para garantizar tu privacidad, enviamos todos los paquetes en una caja o bolsa simple
              sin absolutamente ninguna etiqueta de producto. Los artículos vienen forrados con papel
              reciclado, cartón o papel burbuja.
            </p>

            {/* FAQ */}
            <h2 className="pe-section-title">Preguntas frecuentes</h2>

            <div className="pe-faq-list">

              <details className="pe-faq-item">
                <summary className="pe-faq-q">
                  ¿Se puede entregar o retirar en una sucursal de correos?
                  <span className="pe-faq-icon">+</span>
                </summary>
                <p className="pe-faq-a">
                  Sí, no hay problema. Siempre y cuando la sucursal donde quieras retirar preste el
                  servicio de retiro o entrega de paquetes. Debes colocar los datos de la sucursal en
                  la dirección de envío.
                </p>
              </details>

              <details className="pe-faq-item">
                <summary className="pe-faq-q">
                  ¿Cuánto tardará en llegar mi paquete?
                  <span className="pe-faq-icon">+</span>
                </summary>
                <p className="pe-faq-a">
                  El tiempo de envío de todos nuestros artículos una vez despachados desde nuestra
                  bodega en Cali es de <strong>1 a 4 días hábiles</strong> (envío premium). Los envíos
                  generalmente llegan dentro de este plazo, pero no somos responsables de los retrasos
                  de la transportadora. Acompañaremos el proceso de inicio a fin y recibirás un correo
                  o WhatsApp con el número de guía para hacer seguimiento en tiempo real.
                  <br /><br />
                  Ten en cuenta que los números de seguimiento no estarán activos hasta que la empresa
                  de transporte escanee el paquete, lo cual puede tomar hasta <strong>12 horas</strong>.
                </p>
              </details>

              <details className="pe-faq-item">
                <summary className="pe-faq-q">
                  ¿Entregan los sábados?
                  <span className="pe-faq-icon">+</span>
                </summary>
                <p className="pe-faq-a">
                  Algunas transportadoras realizan entregas los sábados hasta las 5:00 pm, todo depende
                  de la disponibilidad y rutas del transportista. Si tienes alguna pregunta,{' '}
                  <Link to={contactUrl} className="pe-faq-link">comunícate con nosotros</Link> para
                  obtener ayuda para realizar tu pedido.
                </p>
              </details>

            </div>

            <div className="pe-faq-note">
              <div className="pe-faq-dot" />
              <p>¿Tienes otra pregunta? <Link to={contactUrl} className="pe-inline-link">Contáctanos</Link> y te respondemos en menos de 24 horas.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

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

  .pe-wrapper {
    min-height: 100vh;
    background: var(--ex-bone);
    color: var(--ex-ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* NAV */
  .pe-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--ex-bone-border);
    padding: 0 2rem; height: 52px;
    display: flex; align-items: center;
  }
  .pe-back {
    background: none; border: none;
    color: var(--ex-ink-mid);
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; padding: 0;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: color 0.15s;
  }
  .pe-back:hover { color: var(--ex-ink); }

  /* HERO */
  .pe-hero {
    background: var(--ex-sage);
    padding: 3.5rem 2rem 3rem;
    position: relative; overflow: hidden;
  }
  .pe-hero::before {
    content: ''; position: absolute;
    top: -60px; right: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: rgba(200,213,194,0.12); pointer-events: none;
  }
  .pe-hero::after {
    content: ''; position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(184,154,90,0.1); pointer-events: none;
  }
  .pe-hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
  .pe-eyebrow {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ex-sage-mist); margin-bottom: 0.9rem;
  }
  .pe-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 400; color: #fff;
    margin-bottom: 0.75rem; line-height: 1.1;
  }
  .pe-title em { font-style: italic; color: var(--ex-sage-mist); }
  .pe-subtitle {
    font-size: 0.88rem; color: rgba(200,213,194,0.85);
    letter-spacing: 0.04em;
    display: inline-flex; align-items: center; gap: 0.6rem;
  }
  .pe-subtitle::before {
    content: ''; display: inline-block;
    width: 28px; height: 1px;
    background: var(--ex-gold); flex-shrink: 0;
  }

  /* CONTENT */
  .pe-content { padding: 3.5rem 1.5rem 6rem; }
  .pe-container { max-width: 720px; margin: 0 auto; }

  /* HIGHLIGHTS */
  .pe-highlights {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid var(--ex-bone-border);
    margin-bottom: 3rem;
    background: var(--ex-white);
  }
  .pe-highlight {
    padding: 1.5rem 1.2rem;
    border-right: 1px solid var(--ex-bone-border);
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  }
  .pe-highlight:last-child { border-right: none; }
  .pe-highlight-icon {
    width: 40px; height: 40px;
    background: rgba(61,79,58,0.08);
    color: var(--ex-sage);
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    margin-bottom: 0.2rem;
  }
  .pe-highlight-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ex-ink);
  }
  .pe-highlight-val {
    font-size: 10px; color: var(--ex-ink-soft);
    font-weight: 300; text-align: center;
    line-height: 1.4;
  }

  /* SECTION TITLE */
  .pe-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 400;
    color: var(--ex-ink);
    margin-top: 3rem; margin-bottom: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--ex-bone-border);
  }

  /* BODY */
  .pe-body {
    font-size: 0.915rem; line-height: 1.88;
    color: var(--ex-ink-mid); margin-bottom: 1.2rem; font-weight: 300;
  }
  .pe-body strong { color: var(--ex-ink); font-weight: 600; }

  /* TIME GRID */
  .pe-time-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; margin-bottom: 1.5rem;
    border: 1px solid var(--ex-bone-border);
  }
  .pe-time-card {
    padding: 1.4rem 1.5rem;
    border-right: 1px solid var(--ex-bone-border);
    background: var(--ex-white);
  }
  .pe-time-card:last-child { border-right: none; }
  .pe-time-badge {
    display: inline-block;
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ex-sage);
    border: 1px solid var(--ex-sage-mist);
    background: rgba(200,213,194,0.25);
    padding: 3px 10px; margin-bottom: 0.7rem;
  }
  .pe-time-badge--gold {
    color: var(--ex-gold);
    border-color: rgba(184,154,90,0.4);
    background: rgba(184,154,90,0.08);
  }
  .pe-time-desc {
    font-size: 0.87rem; line-height: 1.65;
    color: var(--ex-ink-mid); font-weight: 300;
  }
  .pe-time-desc strong { color: var(--ex-ink); font-weight: 600; }

  /* CALLOUT */
  .pe-callout {
    background: var(--ex-sage);
    padding: 1.5rem 2rem 1.5rem 2.2rem;
    margin: 1rem 0 1.5rem;
    position: relative; overflow: hidden;
  }
  .pe-callout::before {
    content: ''; position: absolute;
    top: 0; left: 0; width: 3px; height: 100%;
    background: var(--ex-gold);
  }
  .pe-callout p {
    font-size: 0.9rem; line-height: 1.8;
    color: rgba(200,213,194,0.9); font-weight: 300;
  }
  .pe-callout strong { color: #fff; font-weight: 500; }

  /* FAQ */
  .pe-faq-list {
    border: 1px solid var(--ex-bone-border);
    background: var(--ex-white);
    margin-bottom: 2rem;
  }
  .pe-faq-item {
    border-bottom: 1px solid var(--ex-bone-border);
  }
  .pe-faq-item:last-child { border-bottom: none; }
  .pe-faq-q {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.4rem;
    font-size: 0.9rem; font-weight: 500;
    color: var(--ex-ink); cursor: pointer;
    list-style: none; gap: 1rem;
    transition: background 0.15s;
  }
  .pe-faq-q::-webkit-details-marker { display: none; }
  .pe-faq-q:hover { background: var(--ex-bone); }
  .pe-faq-icon {
    font-size: 1.2rem; font-weight: 300;
    color: var(--ex-sage); flex-shrink: 0;
    transition: transform 0.2s;
  }
  details[open] .pe-faq-icon { transform: rotate(45deg); }
  .pe-faq-a {
    padding: 0 1.4rem 1.2rem;
    font-size: 0.88rem; line-height: 1.8;
    color: var(--ex-ink-mid); font-weight: 300;
  }
  .pe-faq-a strong { color: var(--ex-ink); font-weight: 600; }
  .pe-faq-link {
    color: var(--ex-sage); text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* BOTTOM NOTE */
  .pe-faq-note {
    padding: 1.6rem 1.8rem;
    background: var(--ex-bone-mid);
    border: 1px solid var(--ex-bone-border);
    display: flex; align-items: center; gap: 1rem;
  }
  .pe-faq-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--ex-gold); flex-shrink: 0;
  }
  .pe-faq-note p { font-size: 0.87rem; color: var(--ex-ink-mid); font-weight: 300; }
  .pe-inline-link {
    color: var(--ex-sage); font-weight: 500;
    text-decoration: underline; text-underline-offset: 2px;
  }

  @media (max-width: 640px) {
    .pe-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .pe-content { padding: 2.5rem 1.2rem 5rem; }
    .pe-highlights { grid-template-columns: repeat(2, 1fr); }
    .pe-highlight:nth-child(2) { border-right: none; }
    .pe-highlight:nth-child(1),
    .pe-highlight:nth-child(2) { border-bottom: 1px solid var(--ex-bone-border); }
    .pe-time-grid { grid-template-columns: 1fr; }
    .pe-time-card { border-right: none; border-bottom: 1px solid var(--ex-bone-border); }
    .pe-time-card:last-child { border-bottom: none; }
  }
`
