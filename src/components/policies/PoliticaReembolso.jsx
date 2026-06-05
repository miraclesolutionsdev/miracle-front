import { useParams, useNavigate, Link } from 'react-router-dom'
import { isCustomDomain } from '../../utils/api'

export default function PoliticaReembolso() {
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
      <div className="pr-wrapper">

        <nav className="pr-nav">
          <button className="pr-back" onClick={handleBack}>← Volver a la tienda</button>
        </nav>

        {/* HERO */}
        <div className="pr-hero">
          <div className="pr-hero-inner">
            <p className="pr-eyebrow">Políticas de la tienda</p>
            <h1 className="pr-title">Política de <em>Reembolso</em></h1>
            <p className="pr-subtitle">Conoce nuestras condiciones antes de realizar tu compra.</p>
          </div>
        </div>

        <div className="pr-content">
          <div className="pr-container">

            <div className="pr-callout">
              <p>
                Antes de realizar una compra te recomendamos investigar o preguntar sobre el producto.
                <strong> Contáctanos</strong> para más información — estaremos dispuestos a ayudarte a
                encontrar el mejor vaporizador de acuerdo a tus necesidades.
              </p>
            </div>

            {/* ── CONDICIONES ── */}
            <h2 className="pr-section-title">Condiciones para devolución o cambio</h2>
            <p className="pr-section-sub">Garantía de Satisfacción</p>

            <div className="pr-conditions">

              <div className="pr-condition-card">
                <div className="pr-condition-badge">Nuevo · sellado</div>
                <p className="pr-condition-body">
                  Deben estar en condiciones originales, sin usar, sellados y nuevos para recibir un
                  reembolso del <strong>100%</strong>. Válido por <strong>30 días</strong>.
                </p>
              </div>

              <div className="pr-condition-card">
                <div className="pr-condition-badge pr-condition-badge--mid">Abierto · sin usar</div>
                <p className="pr-condition-body">
                  Caja abierta o sellos de garantía rotos, sin haber sido usado. Deben incluir todas
                  sus cajas, accesorios y manuales. Sujeto a tarifa de reposición del <strong>5%</strong>.
                  Se pueden imponer cargos adicionales del <strong>10%</strong> si faltan accesorios.
                  Válido por <strong>15 días</strong>.
                </p>
              </div>

              <div className="pr-condition-card">
                <div className="pr-condition-badge pr-condition-badge--used">Usado</div>
                <p className="pr-condition-body">
                  Abierto, sellado roto y utilizado con cualquier material. Deben estar en perfectas
                  condiciones, limpios, sin golpes ni rayones, con todas sus cajas, accesorios y manuales.
                  Sujeto a tarifa de reposición de hasta <strong>10%</strong>, con cargos adicionales del
                  <strong> 10%</strong> si faltan accesorios. Válido por <strong>15 días</strong>.
                </p>
              </div>

            </div>

            {/* ── GARANTÍA DEFECTUOSOS ── */}
            <h2 className="pr-section-title">Garantía por productos defectuosos</h2>
            <p className="pr-body">
              Sé lo más detallado posible sobre los motivos de tu devolución. Esta información nos ayudará
              a brindar mejores consejos a futuros clientes.
            </p>

            <div className="pr-timeline">

              <div className="pr-timeline-item">
                <div className="pr-timeline-marker">
                  <span className="pr-timeline-year">Año 1</span>
                </div>
                <div className="pr-timeline-body">
                  <p className="pr-body">
                    Vaporizadores BA asumirá <strong>todos los costos</strong> de envío internacional y
                    nacional con el fabricante. La garantía se gestiona directamente con el fabricante
                    o marca (aproximadamente 8 días). Reemplazaremos la unidad defectuosa de nuestro
                    inventario para reducir tiempos de entrega. En caso de no tener existencia, el plazo
                    máximo es de <strong>30 días calendario</strong>. Si no se puede cumplir el plazo,
                    podrás optar por otro equipo del catálogo o crédito a favor.
                  </p>
                </div>
              </div>

              <div className="pr-timeline-item">
                <div className="pr-timeline-marker pr-timeline-marker--after">
                  <span className="pr-timeline-year">Año 2+</span>
                </div>
                <div className="pr-timeline-body">
                  <p className="pr-body">
                    La garantía es directamente con el fabricante o marca; te acompañamos en el proceso.
                    El cliente asume los gastos de correo internacional y nacional, costos de reposición
                    e impuestos. Si no cuentas con casillero virtual, Vaporizadores BA ofrece su servicio
                    de transporte por <strong>U$50</strong>. El tiempo máximo de entrega es de{' '}
                    <strong>30 días calendario</strong> en caso de no tener stock.
                  </p>
                  <p className="pr-body">
                    Vaporizadores BA guardará tu garantía hasta por <strong>5 meses</strong>.
                  </p>
                </div>
              </div>

            </div>

            {/* ── ARTÍCULOS FALTANTES ── */}
            <h2 className="pr-section-title">Artículos faltantes o rotos al recibir tu pedido</h2>
            <p className="pr-body">
              Todos los artículos rotos y/o faltantes deben ser informados dentro de las{' '}
              <strong>48 horas</strong> posteriores a la entrega. Los componentes de vidrio no están
              cubiertos por garantía a menos que el producto llegue dañado. Contáctanos y te ayudaremos
              de inmediato.
            </p>

            {/* ── CÓMO DEVOLVER ── */}
            <h2 className="pr-section-title">Cómo devolver el producto</h2>
            <p className="pr-body">
              ¡No hay problema! Haz clic en el botón de abajo e ingresa tu solicitud con el asunto:{' '}
              <strong>Devoluciones y garantías</strong>.
            </p>
            <p className="pr-body">Necesitarás tener disponible:</p>

            <ul className="pr-list">
              <li>Número de pedido o fecha de compra del artículo que deseas devolver.</li>
              <li>Correo electrónico utilizado para realizar el pedido.</li>
              <li>Si es un vaporizador, el número de serie (te ayudamos a localizarlo si lo necesitas).</li>
              <li>Si la unidad está defectuosa, una imagen o video que muestre el problema.</li>
            </ul>

            <p className="pr-body">
              Nuestro equipo revisará la solicitud y se comunicará en menos de <strong>48 horas</strong>.
              Después, deberás enviarnos el equipo limpio con sus cajas completas y accesorios. Los costos
              de envío hasta nuestra locación están a cargo del comprador.
            </p>

            <div className="pr-note">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{flexShrink:0, marginTop:'2px'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p>
                Si se determina que la unidad devuelta está funcionando normalmente después de la revisión,
                se enviará la misma unidad. Las devoluciones no se procesarán si las condiciones de nuestra
                política no se cumplen por completo.
              </p>
            </div>

            <div className="pr-btn-row">
              <Link to={contactUrl} className="pr-btn pr-btn-primary">
                Devolver producto
              </Link>
            </div>

            {/* ── SOPORTE ── */}
            <div className="pr-support-card">
              <div className="pr-support-header">
                <div className="pr-support-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="pr-support-title">Soporte y Garantías</p>
                  <p className="pr-support-sub">También puedes contactarnos por WhatsApp</p>
                </div>
              </div>

              <div className="pr-hours">
                <div className="pr-hours-row">
                  <span className="pr-hours-day">Lunes a viernes</span>
                  <span className="pr-hours-time">10:00 am – 5:00 pm</span>
                </div>
              </div>

              <a
                href="https://wa.me/573152499795?text=Hola%2C%20necesito%20soporte%20y%20garant%C3%ADas"
                target="_blank"
                rel="noopener noreferrer"
                className="pr-btn pr-btn-secondary"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chatear con Soporte y Garantías
              </a>
            </div>

            <div className="pr-faq-note">
              <div className="pr-faq-dot" />
              <p>Podría interesarte consultar nuestras <strong>Preguntas frecuentes</strong>.</p>
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

  .pr-wrapper {
    min-height: 100vh;
    background: var(--ex-bone);
    color: var(--ex-ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* NAV */
  .pr-nav {
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
  .pr-back {
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
  .pr-back:hover { color: var(--ex-ink); }

  /* HERO */
  .pr-hero {
    background: var(--ex-sage);
    padding: 3.5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .pr-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(200,213,194,0.12);
    pointer-events: none;
  }
  .pr-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(184,154,90,0.1);
    pointer-events: none;
  }
  .pr-hero-inner {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .pr-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ex-sage-mist);
    margin-bottom: 0.9rem;
  }
  .pr-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.75rem;
    line-height: 1.1;
  }
  .pr-title em { font-style: italic; color: var(--ex-sage-mist); }
  .pr-subtitle {
    font-size: 0.88rem;
    color: rgba(200,213,194,0.85);
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  .pr-subtitle::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--ex-gold);
    flex-shrink: 0;
  }

  /* CONTENT */
  .pr-content { padding: 3.5rem 1.5rem 6rem; }
  .pr-container { max-width: 720px; margin: 0 auto; }

  /* CALLOUT */
  .pr-callout {
    background: var(--ex-sage);
    padding: 1.6rem 2rem 1.6rem 2.2rem;
    margin-bottom: 2.5rem;
    position: relative;
    overflow: hidden;
  }
  .pr-callout::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--ex-gold);
  }
  .pr-callout p {
    font-size: 0.9rem;
    line-height: 1.8;
    color: rgba(200,213,194,0.9);
    font-weight: 300;
  }
  .pr-callout strong { color: #fff; font-weight: 500; }

  /* SECTION TITLE */
  .pr-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--ex-ink);
    margin-top: 3rem;
    margin-bottom: 0.4rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid var(--ex-bone-border);
  }
  .pr-section-sub {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ex-sage-mid);
    margin-bottom: 1.5rem;
  }

  /* BODY */
  .pr-body {
    font-size: 0.915rem;
    line-height: 1.88;
    color: var(--ex-ink-mid);
    margin-bottom: 1.2rem;
    font-weight: 300;
  }
  .pr-body strong { color: var(--ex-ink); font-weight: 600; }

  /* CONDITIONS CARDS */
  .pr-conditions {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 0.5rem;
    border: 1px solid var(--ex-bone-border);
  }
  .pr-condition-card {
    padding: 1.3rem 1.5rem;
    border-bottom: 1px solid var(--ex-bone-border);
    background: var(--ex-white);
  }
  .pr-condition-card:last-child { border-bottom: none; }
  .pr-condition-badge {
    display: inline-block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ex-sage);
    border: 1px solid var(--ex-sage-mist);
    background: rgba(200,213,194,0.25);
    padding: 3px 10px;
    margin-bottom: 0.75rem;
  }
  .pr-condition-badge--mid {
    color: var(--ex-gold);
    border-color: rgba(184,154,90,0.4);
    background: rgba(184,154,90,0.08);
  }
  .pr-condition-badge--used {
    color: var(--ex-ink-mid);
    border-color: var(--ex-bone-border);
    background: var(--ex-bone-mid);
  }
  .pr-condition-body {
    font-size: 0.88rem;
    line-height: 1.75;
    color: var(--ex-ink-mid);
    font-weight: 300;
  }
  .pr-condition-body strong { color: var(--ex-ink); font-weight: 600; }

  /* TIMELINE */
  .pr-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 1.5rem 0 0.5rem;
    border-left: 2px solid var(--ex-sage-mist);
    padding-left: 0;
  }
  .pr-timeline-item {
    display: flex;
    gap: 0;
    padding-bottom: 2rem;
  }
  .pr-timeline-item:last-child { padding-bottom: 0; }
  .pr-timeline-marker {
    flex-shrink: 0;
    width: 72px;
    padding-left: 0;
    margin-left: -1px;
    padding-right: 1.2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .pr-timeline-marker::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ex-sage);
    border: 2px solid var(--ex-bone);
  }
  .pr-timeline-marker--after::before {
    background: var(--ex-gold);
  }
  .pr-timeline-year {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ex-sage);
    white-space: nowrap;
  }
  .pr-timeline-marker--after .pr-timeline-year { color: var(--ex-gold); }
  .pr-timeline-body { flex: 1; }

  /* LIST */
  .pr-list {
    list-style: none;
    margin: 0.5rem 0 1.5rem;
    border: 1px solid var(--ex-bone-border);
    background: var(--ex-white);
  }
  .pr-list li {
    font-size: 0.88rem;
    line-height: 1.75;
    color: var(--ex-ink-mid);
    padding: 0.8rem 1.2rem 0.8rem 3rem;
    position: relative;
    border-bottom: 1px solid var(--ex-bone-border);
    font-weight: 300;
  }
  .pr-list li:last-child { border-bottom: none; }
  .pr-list li::before {
    content: '';
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--ex-gold);
  }

  /* NOTE */
  .pr-note {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    background: var(--ex-bone-mid);
    border: 1px solid var(--ex-bone-border);
    padding: 1.1rem 1.3rem;
    margin-bottom: 2rem;
    color: var(--ex-ink-soft);
  }
  .pr-note p {
    font-size: 0.84rem;
    line-height: 1.7;
    font-weight: 300;
  }

  /* BUTTONS */
  .pr-btn-row { margin: 0 0 3rem; }
  .pr-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
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
  .pr-btn-primary {
    background: var(--ex-sage);
    color: #fff;
    border: 1px solid var(--ex-sage);
  }
  .pr-btn-primary:hover { background: var(--ex-ink); border-color: var(--ex-ink); }
  .pr-btn-secondary {
    background: transparent;
    color: var(--ex-sage);
    border: 1px solid var(--ex-sage);
  }
  .pr-btn-secondary:hover { background: var(--ex-sage); color: #fff; }

  /* SUPPORT CARD */
  .pr-support-card {
    background: var(--ex-white);
    border: 1px solid var(--ex-bone-border);
    padding: 2rem;
    position: relative;
    margin-bottom: 2.5rem;
  }
  .pr-support-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--ex-sage);
  }
  .pr-support-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .pr-support-icon {
    width: 44px; height: 44px;
    background: var(--ex-sage);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pr-support-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--ex-ink);
  }
  .pr-support-sub {
    font-size: 0.78rem;
    color: var(--ex-ink-soft);
    letter-spacing: 0.03em;
    margin-top: 0.2rem;
  }

  /* HOURS */
  .pr-hours {
    border: 1px solid var(--ex-bone-border);
    margin-bottom: 1.5rem;
  }
  .pr-hours-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.1rem;
  }
  .pr-hours-day { font-size: 0.84rem; color: var(--ex-ink-mid); font-weight: 400; }
  .pr-hours-time { font-size: 0.84rem; color: var(--ex-ink); font-weight: 500; }

  /* FAQ NOTE */
  .pr-faq-note {
    padding: 1.6rem 1.8rem;
    background: var(--ex-bone-mid);
    border: 1px solid var(--ex-bone-border);
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .pr-faq-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--ex-gold);
    flex-shrink: 0;
  }
  .pr-faq-note p { font-size: 0.87rem; color: var(--ex-ink-mid); font-weight: 300; }
  .pr-faq-note strong { color: var(--ex-ink); font-weight: 600; }

  @media (max-width: 640px) {
    .pr-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .pr-content { padding: 2.5rem 1.2rem 5rem; }
    .pr-btn { width: 100%; justify-content: center; }
    .pr-timeline { padding-left: 0; }
    .pr-timeline-marker { width: 56px; }
  }
`
