import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { articulosApi, isCustomDomain } from '../../utils/api'
import { buildStoreBase } from '../../templates/templateUtils'

function formatFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function BlogArticulo() {
  const { slug, articuloId } = useParams()
  const navigate = useNavigate()
  const [articulo, setArticulo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const storeBase = buildStoreBase(slug)
  const blogUrl = isCustomDomain() ? '/blog' : `${storeBase}/blog`

  useEffect(() => {
    articulosApi.obtener(articuloId)
      .then(setArticulo)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [articuloId])

  return (
    <>
      <style>{CSS}</style>
      <div className="ba-wrapper">

        <nav className="ba-nav">
          <button className="ba-back" onClick={() => navigate(blogUrl)}>← Volver al blog</button>
        </nav>

        {loading ? (
          <div className="ba-loading">Cargando artículo...</div>
        ) : error ? (
          <div className="ba-loading">{error}</div>
        ) : !articulo ? null : (
          <>
            {/* HERO con imagen o band sage */}
            {articulo.imagenUrl ? (
              <div className="ba-hero-img">
                <img src={articulo.imagenUrl} alt={articulo.titulo} />
                <div className="ba-hero-img-overlay" />
                <div className="ba-hero-img-content">
                  {articulo.categoria && <p className="ba-eyebrow">{articulo.categoria}</p>}
                  <h1 className="ba-title-over">{articulo.titulo}</h1>
                  <p className="ba-fecha-over">{formatFecha(articulo.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div className="ba-hero">
                <div className="ba-hero-inner">
                  {articulo.categoria && <p className="ba-eyebrow">{articulo.categoria}</p>}
                  <h1 className="ba-title">{articulo.titulo}</h1>
                  <p className="ba-fecha">{formatFecha(articulo.createdAt)}</p>
                </div>
              </div>
            )}

            <div className="ba-content">
              <div className="ba-container">

                {articulo.extracto && (
                  <p className="ba-extracto">{articulo.extracto}</p>
                )}

                {articulo.contenido && (
                  <div
                    className="ba-body"
                    dangerouslySetInnerHTML={{ __html: articulo.contenido.replace(/\n/g, '<br />') }}
                  />
                )}

                {Array.isArray(articulo.etiquetas) && articulo.etiquetas.length > 0 && (
                  <div className="ba-tags">
                    {articulo.etiquetas.map((t) => (
                      <span key={t} className="ba-tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="ba-cta">
                  <p className="ba-cta-text">¿Te resultó útil este artículo?</p>
                  <button className="ba-cta-btn" onClick={() => navigate(storeBase || '/')}>
                    Ver productos de la tienda
                  </button>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600&display=swap');
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

  .ba-wrapper { min-height: 100vh; background: var(--ex-bone); color: var(--ex-ink); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  .ba-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid var(--ex-bone-border); padding: 0 2rem; height: 52px; display: flex; align-items: center; }
  .ba-back { background: none; border: none; color: var(--ex-ink-mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.15s; }
  .ba-back:hover { color: var(--ex-ink); }

  .ba-loading { padding: 6rem 2rem; text-align: center; color: var(--ex-ink-soft); font-size: 0.9rem; }

  /* Hero con imagen */
  .ba-hero-img { position: relative; width: 100%; height: clamp(280px, 45vw, 480px); overflow: hidden; }
  .ba-hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .ba-hero-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,26,18,0.85) 0%, rgba(20,26,18,0.3) 60%, transparent 100%); }
  .ba-hero-img-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem 3rem; }
  .ba-title-over { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 400; color: #fff; line-height: 1.15; margin-bottom: 0.5rem; }
  .ba-fecha-over { font-size: 0.8rem; color: rgba(200,213,194,0.8); letter-spacing: 0.06em; }

  /* Hero sin imagen */
  .ba-hero { background: var(--ex-sage); padding: 3.5rem 2rem 3rem; position: relative; overflow: hidden; }
  .ba-hero::before { content: ''; position: absolute; top: -60px; right: -80px; width: 320px; height: 320px; border-radius: 50%; background: rgba(200,213,194,0.12); pointer-events: none; }
  .ba-hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
  .ba-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 400; color: #fff; line-height: 1.1; margin-bottom: 0.6rem; }
  .ba-fecha { font-size: 0.82rem; color: rgba(200,213,194,0.8); letter-spacing: 0.06em; }

  .ba-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-sage-mist); margin-bottom: 0.75rem; }

  /* Contenido */
  .ba-content { padding: 3.5rem 1.5rem 6rem; }
  .ba-container { max-width: 680px; margin: 0 auto; }

  .ba-extracto { font-size: 1.05rem; line-height: 1.75; color: var(--ex-ink-mid); font-weight: 300; font-style: italic; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--ex-bone-border); }

  .ba-body { font-size: 0.95rem; line-height: 1.9; color: var(--ex-ink-mid); font-weight: 300; }
  .ba-body p, .ba-body br { margin-bottom: 1rem; }
  .ba-body strong { color: var(--ex-ink); font-weight: 600; }
  .ba-body h2, .ba-body h3 { font-family: 'Playfair Display', serif; font-weight: 400; color: var(--ex-ink); margin: 2rem 0 0.8rem; }
  .ba-body h2 { font-size: 1.4rem; }
  .ba-body h3 { font-size: 1.1rem; }
  .ba-body ul, .ba-body ol { padding-left: 1.5rem; margin-bottom: 1rem; }
  .ba-body li { margin-bottom: 0.4rem; }

  .ba-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--ex-bone-border); }
  .ba-tag { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); border: 1px solid var(--ex-bone-border); background: var(--ex-white); padding: 3px 10px; }

  .ba-cta { margin-top: 3.5rem; padding: 2rem; background: var(--ex-sage); text-align: center; }
  .ba-cta-text { font-size: 0.88rem; color: var(--ex-sage-mist); margin-bottom: 1rem; }
  .ba-cta-btn { background: #fff; color: var(--ex-sage); border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.85rem 2rem; cursor: pointer; transition: opacity 0.18s; }
  .ba-cta-btn:hover { opacity: 0.85; }

  @media (max-width: 640px) {
    .ba-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .ba-content { padding: 2rem 1.2rem 5rem; }
    .ba-hero-img-content { padding: 1.5rem; }
  }
`
