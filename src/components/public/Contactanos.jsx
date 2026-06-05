import { useParams, useNavigate } from 'react-router-dom'
import { isCustomDomain } from '../../utils/api'

export default function Contactanos() {
  const { slug } = useParams()
  const navigate = useNavigate()

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
      <div className="ct-wrapper">

        <nav className="ct-nav">
          <button className="ct-back" onClick={handleBack}>← Volver a la tienda</button>
        </nav>

        {/* HERO */}
        <div className="ct-hero">
          <div className="ct-hero-inner">
            <p className="ct-eyebrow">Soporte</p>
            <h1 className="ct-title">Contáct<em>anos</em></h1>
            <p className="ct-subtitle">Estamos aquí para ayudarte en el menor tiempo posible.</p>
          </div>
        </div>

        <div className="ct-content">
          <div className="ct-container">

            <p className="ct-lead">
              ¿Necesitas hablar con alguien? Estamos dispuestos a ayudarte en el menor tiempo posible.
              Nuestra experiencia y conocimiento sobre vaporizadores te brindarán el mayor respaldo.
            </p>

            {/* Card principal */}
            <div className="ct-card">
              <div className="ct-card-header">
                <div className="ct-card-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="ct-card-title">Atención al Cliente y Garantías</p>
                  <p className="ct-card-sub">Respuesta en menos de 24 horas</p>
                </div>
              </div>

              <div className="ct-hours">
                <div className="ct-hours-row">
                  <span className="ct-hours-day">Lunes a viernes</span>
                  <span className="ct-hours-time">9:00 am – 6:00 pm</span>
                </div>
                <div className="ct-hours-row">
                  <span className="ct-hours-day">Sábados</span>
                  <span className="ct-hours-time">10:00 am – 2:00 pm</span>
                </div>
              </div>

              <a
                href="https://wa.me/573136274691?text=Hola%2C%20necesito%20atenci%C3%B3n%20al%20cliente"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-btn"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chatear con atención al cliente
              </a>
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

  .ct-wrapper {
    min-height: 100vh;
    background: var(--ex-bone);
    color: var(--ex-ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* NAV */
  .ct-nav {
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

  .ct-back {
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
  .ct-back:hover { color: var(--ex-ink); }

  /* HERO */
  .ct-hero {
    background: var(--ex-sage);
    padding: 3.5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .ct-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(200,213,194,0.12);
    pointer-events: none;
  }
  .ct-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(184,154,90,0.1);
    pointer-events: none;
  }

  .ct-hero-inner {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .ct-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ex-sage-mist);
    margin-bottom: 0.9rem;
  }

  .ct-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.75rem;
    line-height: 1.1;
  }
  .ct-title em {
    font-style: italic;
    color: var(--ex-sage-mist);
  }

  .ct-subtitle {
    font-size: 0.88rem;
    color: rgba(200,213,194,0.85);
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  .ct-subtitle::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--ex-gold);
    flex-shrink: 0;
  }

  /* CONTENT */
  .ct-content {
    padding: 3.5rem 1.5rem 6rem;
  }

  .ct-container {
    max-width: 720px;
    margin: 0 auto;
  }

  .ct-lead {
    font-size: 0.95rem;
    line-height: 1.85;
    color: var(--ex-ink-mid);
    font-weight: 300;
    margin-bottom: 2.5rem;
    max-width: 580px;
  }

  /* CARD */
  .ct-card {
    background: var(--ex-white);
    border: 1px solid var(--ex-bone-border);
    padding: 2rem 2rem 2rem;
    position: relative;
    overflow: hidden;
  }
  .ct-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
    background: var(--ex-sage);
  }

  .ct-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.8rem;
  }

  .ct-card-icon {
    width: 46px;
    height: 46px;
    background: var(--ex-sage);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ct-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--ex-ink);
    line-height: 1.3;
  }

  .ct-card-sub {
    font-size: 0.78rem;
    color: var(--ex-ink-soft);
    letter-spacing: 0.04em;
    margin-top: 0.25rem;
  }

  /* HOURS */
  .ct-hours {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 2rem;
    border: 1px solid var(--ex-bone-border);
  }

  .ct-hours-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.2rem;
    border-bottom: 1px solid var(--ex-bone-border);
  }
  .ct-hours-row:last-child { border-bottom: none; }

  .ct-hours-day {
    font-size: 0.85rem;
    color: var(--ex-ink-mid);
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  .ct-hours-time {
    font-size: 0.85rem;
    color: var(--ex-ink);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  /* BUTTON */
  .ct-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.9rem 2rem;
    background: var(--ex-sage);
    color: #fff;
    border: 1px solid var(--ex-sage);
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.22s;
    cursor: pointer;
  }
  .ct-btn:hover {
    background: var(--ex-ink);
    border-color: var(--ex-ink);
  }

  @media (max-width: 640px) {
    .ct-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .ct-content { padding: 2.5rem 1.2rem 5rem; }
    .ct-btn { width: 100%; justify-content: center; }
    .ct-card { padding: 1.5rem; }
  }
`
