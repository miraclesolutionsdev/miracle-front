import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { articulosApi } from '../../utils/api'
import { isCustomDomain } from '../../utils/api'
import { buildStoreBase } from '../../templates/templateUtils'

function formatFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState('')

  const storeBase = buildStoreBase(slug)

  useEffect(() => {
    articulosApi.listar({ estado: 'publicado', limit: 100 })
      .then(setArticulos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categorias = [...new Set(articulos.map((a) => a.categoria).filter(Boolean))]

  const articulosFiltrados = filtroCategoria
    ? articulos.filter((a) => a.categoria === filtroCategoria)
    : articulos

  function urlArticulo(id) {
    return isCustomDomain() ? `/blog/${id}` : `${storeBase}/blog/${id}`
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="bl-wrapper">

        <nav className="bl-nav">
          <button className="bl-back" onClick={() => navigate(storeBase || '/')}>← Volver a la tienda</button>
        </nav>

        {/* HERO */}
        <div className="bl-hero">
          <div className="bl-hero-inner">
            <p className="bl-eyebrow">Contenido</p>
            <h1 className="bl-title">Nuestro <em>Blog</em></h1>
            <p className="bl-subtitle">Guías, novedades y consejos sobre vaporización.</p>
          </div>
        </div>

        <div className="bl-content">
          <div className="bl-container">

            {/* Filtros categoría */}
            {categorias.length > 0 && (
              <div className="bl-cats">
                <button
                  className={`bl-cat${filtroCategoria === '' ? ' bl-cat--active' : ''}`}
                  onClick={() => setFiltroCategoria('')}
                >
                  Todos
                </button>
                {categorias.map((c) => (
                  <button
                    key={c}
                    className={`bl-cat${filtroCategoria === c ? ' bl-cat--active' : ''}`}
                    onClick={() => setFiltroCategoria(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="bl-empty">Cargando artículos...</div>
            ) : articulosFiltrados.length === 0 ? (
              <div className="bl-empty">No hay artículos publicados aún.</div>
            ) : (
              <div className="bl-grid">
                {articulosFiltrados.map((a) => (
                  <Link key={a.id} to={urlArticulo(a.id)} className="bl-card">
                    <div className="bl-card-img">
                      {a.imagenUrl
                        ? <img src={a.imagenUrl} alt={a.titulo} />
                        : <div className="bl-card-img-placeholder">◈</div>
                      }
                    </div>
                    <div className="bl-card-body">
                      {a.categoria && <span className="bl-card-cat">{a.categoria}</span>}
                      <h2 className="bl-card-title">{a.titulo}</h2>
                      {a.extracto && <p className="bl-card-extracto">{a.extracto}</p>}
                      <div className="bl-card-footer">
                        <span className="bl-card-fecha">{formatFecha(a.createdAt)}</span>
                        <span className="bl-card-cta">Leer más →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>
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

  .bl-wrapper { min-height: 100vh; background: var(--ex-bone); color: var(--ex-ink); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  .bl-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid var(--ex-bone-border); padding: 0 2rem; height: 52px; display: flex; align-items: center; }
  .bl-back { background: none; border: none; color: var(--ex-ink-mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.15s; }
  .bl-back:hover { color: var(--ex-ink); }

  .bl-hero { background: var(--ex-sage); padding: 3.5rem 2rem 3rem; position: relative; overflow: hidden; }
  .bl-hero::before { content: ''; position: absolute; top: -60px; right: -80px; width: 320px; height: 320px; border-radius: 50%; background: rgba(200,213,194,0.12); pointer-events: none; }
  .bl-hero::after { content: ''; position: absolute; bottom: -40px; left: 30%; width: 180px; height: 180px; border-radius: 50%; background: rgba(184,154,90,0.1); pointer-events: none; }
  .bl-hero-inner { max-width: 960px; margin: 0 auto; position: relative; z-index: 1; }
  .bl-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ex-sage-mist); margin-bottom: 0.9rem; }
  .bl-title { font-family: 'Playfair Display', serif; font-size: clamp(2.4rem, 6vw, 3.6rem); font-weight: 400; color: #fff; margin-bottom: 0.75rem; line-height: 1.1; }
  .bl-title em { font-style: italic; color: var(--ex-sage-mist); }
  .bl-subtitle { font-size: 0.88rem; color: rgba(200,213,194,0.85); letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 0.6rem; }
  .bl-subtitle::before { content: ''; display: inline-block; width: 28px; height: 1px; background: var(--ex-gold); flex-shrink: 0; }

  .bl-content { padding: 3rem 1.5rem 6rem; }
  .bl-container { max-width: 960px; margin: 0 auto; }

  .bl-cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }
  .bl-cat { background: var(--ex-white); border: 1px solid var(--ex-bone-border); color: var(--ex-ink-mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.45rem 1.1rem; cursor: pointer; transition: all 0.18s; }
  .bl-cat:hover { border-color: var(--ex-sage); color: var(--ex-sage); }
  .bl-cat--active { background: var(--ex-sage); border-color: var(--ex-sage); color: #fff; }

  .bl-empty { text-align: center; padding: 5rem 2rem; color: var(--ex-ink-soft); font-size: 0.9rem; }

  .bl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid var(--ex-bone-border); }
  .bl-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; border-right: 1px solid var(--ex-bone-border); border-bottom: 1px solid var(--ex-bone-border); background: var(--ex-white); transition: background 0.18s; }
  .bl-card:nth-child(3n) { border-right: none; }
  .bl-card:hover { background: var(--ex-bone); }

  .bl-card-img { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--ex-bone-mid); }
  .bl-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .bl-card:hover .bl-card-img img { transform: scale(1.03); }
  .bl-card-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--ex-bone-border); }

  .bl-card-body { padding: 1.4rem 1.4rem 1.2rem; display: flex; flex-direction: column; flex: 1; gap: 0.5rem; }
  .bl-card-cat { font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ex-sage); }
  .bl-card-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 400; color: var(--ex-ink); line-height: 1.3; }
  .bl-card-extracto { font-size: 0.84rem; line-height: 1.65; color: var(--ex-ink-soft); font-weight: 300; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .bl-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid var(--ex-bone-border); }
  .bl-card-fecha { font-size: 10px; color: var(--ex-ink-soft); letter-spacing: 0.04em; }
  .bl-card-cta { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-sage); }

  @media (max-width: 768px) {
    .bl-grid { grid-template-columns: repeat(2, 1fr); }
    .bl-card:nth-child(3n) { border-right: 1px solid var(--ex-bone-border); }
    .bl-card:nth-child(2n) { border-right: none; }
  }
  @media (max-width: 480px) {
    .bl-hero { padding: 2.5rem 1.2rem 2.2rem; }
    .bl-content { padding: 2rem 1rem 5rem; }
    .bl-grid { grid-template-columns: 1fr; }
    .bl-card { border-right: none; }
    .bl-card:nth-child(2n) { border-right: none; }
  }
`
