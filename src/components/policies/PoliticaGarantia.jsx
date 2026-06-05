import { useParams, useNavigate, Link } from 'react-router-dom'
import { isCustomDomain } from '../../utils/api'

export default function PoliticaGarantia() {
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
      <div className="pg-wrapper">

        <nav className="pg-nav">
          <button className="pg-back" onClick={handleBack}>← Volver a la tienda</button>
        </nav>

        {/* HERO — sage green band */}
        <div className="pg-hero">
          <div className="pg-hero-inner">
            <p className="pg-eyebrow">Políticas de la tienda</p>
            <h1 className="pg-title">Garantía de <em>Satisfacción</em></h1>
            <p className="pg-subtitle">15 días devolución gratuita para clientes en Colombia.</p>
          </div>
        </div>

        <div className="pg-content">
          <div className="pg-container">

            <p className="pg-body">
              Queremos que estés más que feliz con tu compra, ¡queremos que estés encantado! Si por alguna razón
              no estás 100% satisfecho, puedes devolver tu vaporizador comprado, incluso usado, e intercambiarlo
              por otro modelo, o devolverlo para obtener un reembolso o crédito de la tienda, siempre y cuando
              te comuniques con nosotros dentro de los 15 días posteriores a la entrega.
            </p>

            <h2 className="pg-section-title">¿Por qué tenemos esta política?</h2>
            <p className="pg-body">
              Creemos que no hay un mejor vaporizador para todos. En cambio, creemos que hay un vaporizador
              perfecto para cada persona, y queremos ayudarte a encontrar el tuyo. Queremos brindarte los mejores
              recursos para apoyarte mientras realizas la transición a la vaporización.
            </p>
            <p className="pg-body">
              Incluso con todos estos recursos, sabemos que no hay nada como probar un vaporizador tú mismo.
              Es por eso que se nos ocurrió esta política, que te brinda tranquilidad en caso de que encuentres
              que tu nuevo vaporizador no es exactamente lo que esperabas.
            </p>

            <h2 className="pg-section-title">¿Cómo funciona?</h2>
            <p className="pg-body">
              Si crees que compraste un vaporizador que no cumple completamente con tus expectativas, queremos
              saberlo y ofrecerte la opción de conectarte con uno de nuestros expertos en vaporización para
              hacerlo bien. Respetaremos nuestra Garantía de Satisfacción de 15 días siempre que te comuniques
              dentro de ese plazo.
            </p>

            <h2 className="pg-section-title">¡Simple como eso!</h2>
            <p className="pg-body">
              No hay trucos aquí. Recuperaremos cualquier vaporizador que funcione, incluso si se ha utilizado,
              y lo cambiaremos por un modelo diferente o un reembolso. Si se trata de un intercambio o crédito
              de la tienda, el envío de devolución es gratuito; para los reembolsos, el envío estará a cargo
              del cliente.
            </p>

            <div className="pg-callout">
              <p>
                Ya sea que estés buscando asesoramiento sobre tu compra, solución de problemas o simplemente
                tengas una pregunta, <strong>estamos aquí para ayudarte</strong>. Conéctate con uno de nuestros
                expertos antes de iniciar cualquier devolución.
              </p>
            </div>

            <div className="pg-btn-row">
              <Link to={contactUrl} className="pg-btn pg-btn-primary">
                Quiero hablar con un experto
              </Link>
            </div>

            <div className="pg-divider" />

            <h2 className="pg-section-title">¿Quieres comenzar tu devolución?</h2>
            <p className="pg-body">
              ¡No hay problema! Haz clic en el botón de abajo e ingresa tu solicitud con el asunto:
              <strong> Devoluciones y garantías</strong>.
            </p>
            <p className="pg-body">Necesitarás tener disponible:</p>
            <ul className="pg-list">
              <li>El número de pedido del vaporizador que deseas devolver.</li>
              <li>La dirección de correo electrónico utilizada para realizar el pedido.</li>
              <li>El número de serie de tu vaporizador (te ayudamos a localizarlo si lo necesitas).</li>
              <li>Si tu unidad está defectuosa, una imagen que muestre el problema.</li>
            </ul>
            <p className="pg-body">
              Sé lo más detallado posible. Nuestro equipo revisará tu solicitud en menos de 24 horas.
            </p>

            <div className="pg-btn-row">
              <Link to={contactUrl} className="pg-btn pg-btn-secondary">
                Devolver producto
              </Link>
            </div>

            <div className="pg-faq-note">
              <div className="pg-faq-dot" />
              <p>Te recomendamos consultar nuestras <strong>Preguntas frecuentes</strong> antes de iniciar una devolución.</p>
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

  .pg-wrapper {
    min-height: 100vh;
    background: var(--ex-bone);
    color: var(--ex-ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .pg-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--ex-bone-border);
    padding: 0 2rem;
    height: 52px;
    display: flex;
    align-items: center;
  }

  .pg-back {
    background: none;
    border: none;
    color: var(--ex-ink-mid);
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.15s;
  }
  .pg-back:hover { color: var(--ex-ink); }

  /* ── HERO BAND ── */
  .pg-hero {
    background: var(--ex-sage);
    padding: 3.5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .pg-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(200,213,194,0.12);
    pointer-events: none;
  }
  .pg-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(184,154,90,0.1);
    pointer-events: none;
  }

  .pg-hero-inner {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .pg-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ex-sage-mist);
    margin-bottom: 0.9rem;
  }

  .pg-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.75rem;
    line-height: 1.1;
  }
  .pg-title em {
    font-style: italic;
    color: var(--ex-sage-mist);
  }

  .pg-subtitle {
    font-size: 0.88rem;
    color: rgba(200,213,194,0.85);
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  .pg-subtitle::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--ex-gold);
    flex-shrink: 0;
  }

  /* ── CONTENT ── */
  .pg-content {
    padding: 3.5rem 1.5rem 6rem;
  }

  .pg-container {
    max-width: 720px;
    margin: 0 auto;
  }

  .pg-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--ex-ink);
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--ex-bone-border);
  }

  .pg-body {
    font-size: 0.915rem;
    line-height: 1.88;
    color: var(--ex-ink-mid);
    margin-bottom: 1.2rem;
    font-weight: 300;
  }

  /* ── LIST ── */
  .pg-list {
    list-style: none;
    margin: 0.5rem 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--ex-bone-border);
    background: var(--ex-white);
  }
  .pg-list li {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--ex-ink-mid);
    padding: 0.85rem 1.2rem 0.85rem 3rem;
    position: relative;
    border-bottom: 1px solid var(--ex-bone-border);
    font-weight: 300;
  }
  .pg-list li:last-child { border-bottom: none; }
  .pg-list li::before {
    content: '';
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ex-gold);
  }

  /* ── CALL-OUT BOX ── */
  .pg-callout {
    background: var(--ex-sage);
    padding: 2rem 2rem 2rem 2.2rem;
    margin: 2.5rem 0;
    position: relative;
    overflow: hidden;
  }
  .pg-callout::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
    background: var(--ex-gold);
  }
  .pg-callout p {
    font-size: 0.9rem;
    line-height: 1.8;
    color: rgba(200,213,194,0.9);
    font-weight: 300;
  }
  .pg-callout strong {
    color: #fff;
    font-weight: 500;
  }

  /* ── BUTTONS ── */
  .pg-btn-row {
    margin: 2rem 0;
  }

  .pg-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 2.2rem;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.22s;
    cursor: pointer;
    border: none;
  }
  .pg-btn-primary {
    background: var(--ex-sage);
    color: #fff;
    border: 1px solid var(--ex-sage);
  }
  .pg-btn-primary:hover {
    background: var(--ex-ink);
    border-color: var(--ex-ink);
  }
  .pg-btn-secondary {
    background: transparent;
    color: var(--ex-sage);
    border: 1px solid var(--ex-sage);
  }
  .pg-btn-secondary:hover {
    background: var(--ex-sage);
    color: #fff;
  }

  /* ── FAQ NOTE ── */
  .pg-faq-note {
    margin-top: 4rem;
    padding: 1.8rem 2rem;
    background: var(--ex-bone-mid);
    border: 1px solid var(--ex-bone-border);
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .pg-faq-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ex-gold);
    flex-shrink: 0;
  }
  .pg-faq-note p {
    font-size: 0.88rem;
    color: var(--ex-ink-mid);
    letter-spacing: 0.02em;
    font-weight: 300;
  }
  .pg-faq-note strong {
    color: var(--ex-ink);
    font-weight: 600;
  }

  /* ── DIVIDER ── */
  .pg-divider {
    width: 40px;
    height: 1px;
    background: var(--ex-gold);
    margin: 2rem 0;
  }

  @media (max-width: 640px) {
    .pg-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .pg-content { padding: 2.5rem 1.2rem 5rem; }
    .pg-btn { width: 100%; justify-content: center; }
  }
`
