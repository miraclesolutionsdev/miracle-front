import { useParams, useNavigate, Link } from 'react-router-dom'
import { isCustomDomain } from '../../utils/api'

export default function MetodosPago() {
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
      <div className="mp-wrapper">

        <nav className="mp-nav">
          <button className="mp-back" onClick={handleBack}>← Volver a la tienda</button>
        </nav>

        {/* HERO */}
        <div className="mp-hero">
          <div className="mp-hero-inner">
            <p className="mp-eyebrow">Políticas de la tienda</p>
            <h1 className="mp-title">Formas de <em>Pago</em></h1>
            <p className="mp-subtitle">Compra segura y sin fricciones.</p>
          </div>
        </div>

        <div className="mp-content">
          <div className="mp-container">

            <p className="mp-lead">
              Entendemos que cada cliente tiene sus preferencias a la hora de pagar. Por eso
              procesamos todos nuestros pagos a través de <strong>MercadoPago</strong>, la
              infraestructura de pagos más robusta de Latinoamérica, para que realices tu
              compra de la manera más cómoda y segura.
            </p>

            {/* CARD MERCADOPAGO */}
            <div className="mp-card">
              <div className="mp-card-header">
                <div className="mp-card-logo">
                  <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#009EE3"/>
                    <path d="M10 24c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="24" cy="24" r="4" fill="#fff"/>
                  </svg>
                </div>
                <div>
                  <p className="mp-card-title">MercadoPago</p>
                  <p className="mp-card-sub">Plataforma oficial · Pagos encriptados</p>
                </div>
                <div className="mp-card-badge">Único método</div>
              </div>

              <p className="mp-body">
                Utilizamos la infraestructura de seguridad de una de las plataformas de pago
                más robustas de Latinoamérica. Un sistema blindado para asegurar tu inversión.
              </p>

              {/* MÉTODOS QUE INCLUYE MP */}
              <p className="mp-methods-label">A través de MercadoPago puedes pagar con:</p>
              <div className="mp-methods-grid">

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">Tarjetas débito y crédito</p>
                    <p className="mp-method-desc">Visa, Mastercard, American Express</p>
                  </div>
                </div>

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">PSE</p>
                    <p className="mp-method-desc">Pagos seguros desde tu banca en línea</p>
                  </div>
                </div>

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">Nequi</p>
                    <p className="mp-method-desc">Pagos móviles instantáneos</p>
                  </div>
                </div>

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">Efectivo</p>
                    <p className="mp-method-desc">Puntos Baloto, Efecty y más</p>
                  </div>
                </div>

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">Cuotas sin interés</p>
                    <p className="mp-method-desc">Con tarjetas participantes</p>
                  </div>
                </div>

                <div className="mp-method">
                  <div className="mp-method-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="mp-method-name">Pago seguro garantizado</p>
                    <p className="mp-method-desc">Protección al comprador incluida</p>
                  </div>
                </div>

              </div>
            </div>

            {/* CALLOUT SEGURIDAD */}
            <div className="mp-callout">
              <p>
                Todos tus datos de pago son procesados directamente por MercadoPago.{' '}
                <strong>Nosotros nunca vemos ni almacenamos tu información financiera.</strong>{' '}
                Las transacciones están cifradas con el mismo estándar que usan los bancos.
              </p>
            </div>

            <div className="mp-faq-note">
              <div className="mp-faq-dot" />
              <p>
                ¿Tienes dudas sobre tu pago?{' '}
                <Link to={contactUrl} className="mp-inline-link">Contáctanos</Link>{' '}
                y te ayudamos de inmediato.
              </p>
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

  .mp-wrapper {
    min-height: 100vh;
    background: var(--ex-bone);
    color: var(--ex-ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* NAV */
  .mp-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--ex-bone-border);
    padding: 0 2rem; height: 52px;
    display: flex; align-items: center;
  }
  .mp-back {
    background: none; border: none;
    color: var(--ex-ink-mid);
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; padding: 0;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: color 0.15s;
  }
  .mp-back:hover { color: var(--ex-ink); }

  /* HERO */
  .mp-hero {
    background: var(--ex-sage);
    padding: 3.5rem 2rem 3rem;
    position: relative; overflow: hidden;
  }
  .mp-hero::before {
    content: ''; position: absolute;
    top: -60px; right: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: rgba(200,213,194,0.12); pointer-events: none;
  }
  .mp-hero::after {
    content: ''; position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(184,154,90,0.1); pointer-events: none;
  }
  .mp-hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
  .mp-eyebrow {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ex-sage-mist); margin-bottom: 0.9rem;
  }
  .mp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 400; color: #fff;
    margin-bottom: 0.75rem; line-height: 1.1;
  }
  .mp-title em { font-style: italic; color: var(--ex-sage-mist); }
  .mp-subtitle {
    font-size: 0.88rem; color: rgba(200,213,194,0.85);
    letter-spacing: 0.04em;
    display: inline-flex; align-items: center; gap: 0.6rem;
  }
  .mp-subtitle::before {
    content: ''; display: inline-block;
    width: 28px; height: 1px;
    background: var(--ex-gold); flex-shrink: 0;
  }

  /* CONTENT */
  .mp-content { padding: 3.5rem 1.5rem 6rem; }
  .mp-container { max-width: 720px; margin: 0 auto; }

  .mp-lead {
    font-size: 0.95rem; line-height: 1.85;
    color: var(--ex-ink-mid); font-weight: 300;
    margin-bottom: 2.5rem;
  }
  .mp-lead strong { color: var(--ex-ink); font-weight: 600; }

  /* MAIN CARD */
  .mp-card {
    background: var(--ex-white);
    border: 1px solid var(--ex-bone-border);
    padding: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }
  .mp-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; width: 3px; height: 100%;
    background: #009EE3;
  }

  .mp-card-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
  }
  .mp-card-logo {
    width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    background: #f0f8fd; border-radius: 50%; flex-shrink: 0;
  }
  .mp-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 400; color: var(--ex-ink);
  }
  .mp-card-sub {
    font-size: 0.78rem; color: var(--ex-ink-soft);
    letter-spacing: 0.03em; margin-top: 0.2rem;
  }
  .mp-card-badge {
    margin-left: auto;
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ex-sage);
    border: 1px solid var(--ex-sage-mist);
    background: rgba(200,213,194,0.25);
    padding: 4px 12px;
    white-space: nowrap;
  }

  .mp-body {
    font-size: 0.915rem; line-height: 1.88;
    color: var(--ex-ink-mid); margin-bottom: 1.5rem; font-weight: 300;
  }

  .mp-methods-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--ex-sage-mid); margin-bottom: 1rem;
  }

  .mp-methods-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; border: 1px solid var(--ex-bone-border);
  }
  .mp-method {
    display: flex; align-items: flex-start; gap: 0.85rem;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid var(--ex-bone-border);
    border-right: 1px solid var(--ex-bone-border);
    background: var(--ex-bone);
  }
  .mp-method:nth-child(even) { border-right: none; }
  .mp-method:nth-last-child(-n+2) { border-bottom: none; }
  .mp-method-icon {
    width: 36px; height: 36px;
    background: var(--ex-white);
    border: 1px solid var(--ex-bone-border);
    color: var(--ex-sage);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mp-method-name {
    font-size: 0.84rem; font-weight: 500;
    color: var(--ex-ink); margin-bottom: 0.2rem;
  }
  .mp-method-desc {
    font-size: 0.78rem; color: var(--ex-ink-soft);
    font-weight: 300; line-height: 1.4;
  }

  /* CALLOUT */
  .mp-callout {
    background: var(--ex-sage);
    padding: 1.5rem 2rem 1.5rem 2.2rem;
    margin-bottom: 2rem;
    position: relative; overflow: hidden;
  }
  .mp-callout::before {
    content: ''; position: absolute;
    top: 0; left: 0; width: 3px; height: 100%;
    background: var(--ex-gold);
  }
  .mp-callout p {
    font-size: 0.9rem; line-height: 1.8;
    color: rgba(200,213,194,0.9); font-weight: 300;
  }
  .mp-callout strong { color: #fff; font-weight: 500; }

  /* BOTTOM NOTE */
  .mp-faq-note {
    padding: 1.6rem 1.8rem;
    background: var(--ex-bone-mid);
    border: 1px solid var(--ex-bone-border);
    display: flex; align-items: center; gap: 1rem;
  }
  .mp-faq-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--ex-gold); flex-shrink: 0;
  }
  .mp-faq-note p { font-size: 0.87rem; color: var(--ex-ink-mid); font-weight: 300; }
  .mp-inline-link {
    color: var(--ex-sage); font-weight: 500;
    text-decoration: underline; text-underline-offset: 2px;
  }

  @media (max-width: 640px) {
    .mp-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .mp-content { padding: 2.5rem 1.2rem 5rem; }
    .mp-methods-grid { grid-template-columns: 1fr; }
    .mp-method { border-right: none; }
    .mp-method:nth-last-child(-n+2) { border-bottom: 1px solid var(--ex-bone-border); }
    .mp-method:last-child { border-bottom: none; }
    .mp-card-badge { margin-left: 0; }
  }
`
