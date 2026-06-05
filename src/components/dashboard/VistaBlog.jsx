import { useState, useEffect, useCallback } from 'react'
import { articulosApi } from '../../utils/api'
import SectionCard from '../layout/SectionCard'

const ESTADO_STYLES = {
  publicado: 'bg-primary/10 text-primary',
  borrador: 'bg-muted text-muted-foreground',
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const FORM_VACIO = {
  titulo: '',
  extracto: '',
  contenido: '',
  categoria: '',
  etiquetas: '',
  estado: 'borrador',
  imagen: null,
}

export default function VistaBlog() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [formAbierto, setFormAbierto] = useState(null) // null | 'crear' | articulo
  const [form, setForm] = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [formError, setFormError] = useState('')
  const [preview, setPreview] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setLoading(true)
      const data = await articulosApi.listar({ estado: filtroEstado === 'todos' ? '' : filtroEstado })
      setArticulos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  const articulosFiltrados = articulos.filter((a) => {
    const q = busqueda.trim().toLowerCase()
    return !q || a.titulo?.toLowerCase().includes(q) || a.categoria?.toLowerCase().includes(q)
  })

  function abrirCrear() {
    setForm(FORM_VACIO)
    setPreview(null)
    setFormError('')
    setFormAbierto('crear')
  }

  function abrirEditar(a) {
    setForm({
      titulo: a.titulo ?? '',
      extracto: a.extracto ?? '',
      contenido: a.contenido ?? '',
      categoria: a.categoria ?? '',
      etiquetas: Array.isArray(a.etiquetas) ? a.etiquetas.join(', ') : '',
      estado: a.estado ?? 'borrador',
      imagen: null,
    })
    setPreview(a.imagenUrl || null)
    setFormError('')
    setFormAbierto(a)
  }

  function cerrarForm() {
    setFormAbierto(null)
    setForm(FORM_VACIO)
    setPreview(null)
    setFormError('')
  }

  function handleImagenChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, imagen: file }))
    setPreview(URL.createObjectURL(file))
  }

  async function handleGuardar(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setFormError('El título es obligatorio'); return }
    setGuardando(true)
    setFormError('')
    try {
      const fd = new FormData()
      fd.append('titulo', form.titulo.trim())
      fd.append('extracto', form.extracto.trim())
      fd.append('contenido', form.contenido)
      fd.append('categoria', form.categoria.trim())
      fd.append('etiquetas', form.etiquetas)
      fd.append('estado', form.estado)
      if (form.imagen) fd.append('imagen', form.imagen)

      if (formAbierto === 'crear') {
        await articulosApi.crear(fd)
      } else {
        await articulosApi.actualizar(formAbierto.id, fd)
      }
      await cargar()
      cerrarForm()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm('¿Eliminar este artículo?')) return
    try {
      await articulosApi.eliminar(id)
      setArticulos((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  async function handleToggleEstado(a) {
    const nuevoEstado = a.estado === 'publicado' ? 'borrador' : 'publicado'
    try {
      const fd = new FormData()
      fd.append('estado', nuevoEstado)
      const actualizado = await articulosApi.actualizar(a.id, fd)
      setArticulos((prev) => prev.map((x) => x.id === a.id ? actualizado : x))
    } catch (e) {
      alert(e.message)
    }
  }

  // ── FORMULARIO ──────────────────────────────────────────────
  if (formAbierto !== null) {
    return (
      <SectionCard title={formAbierto === 'crear' ? 'Nuevo artículo' : 'Editar artículo'}>
        <form onSubmit={handleGuardar} className="flex flex-col gap-5 max-w-2xl">

          {/* Título */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Título *</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              placeholder="Ej. Guía de vaporizadores portátiles 2025"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Extracto */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Extracto</label>
            <textarea
              value={form.extracto}
              onChange={(e) => setForm((f) => ({ ...f, extracto: e.target.value }))}
              placeholder="Resumen corto que aparece en la card del blog..."
              rows={2}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          {/* Categoría y etiquetas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Categoría</label>
              <input
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                placeholder="Ej. Guías, Reviews, Noticias"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Etiquetas</label>
              <input
                value={form.etiquetas}
                onChange={(e) => setForm((f) => ({ ...f, etiquetas: e.target.value }))}
                placeholder="vaporización, portátil (separadas por coma)"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Contenido</label>
            <textarea
              value={form.contenido}
              onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
              placeholder="Escribe el contenido del artículo aquí..."
              rows={12}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y font-mono"
            />
          </div>

          {/* Imagen */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Imagen destacada</label>
            {preview && (
              <img src={preview} alt="preview" className="h-40 w-full object-cover rounded-lg border border-border" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="text-sm text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground cursor-pointer"
            />
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={cerrarForm}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      </SectionCard>
    )
  }

  // ── LISTA ────────────────────────────────────────────────────
  return (
    <SectionCard title="Artículos del Blog">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título o categoría..."
          className="flex-1 min-w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="todos">Todos</option>
          <option value="publicado">Publicados</option>
          <option value="borrador">Borradores</option>
        </select>
        <button
          type="button"
          onClick={abrirCrear}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Nuevo artículo
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Cargando...</p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      ) : articulosFiltrados.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {busqueda ? 'Sin resultados.' : 'Aún no hay artículos. Crea el primero.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {['Imagen', 'Título', 'Categoría', 'Estado', 'Fecha', 'Acciones'].map((c) => (
                  <th key={c} className="pb-3 pr-4 font-medium">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articulosFiltrados.map((a) => (
                <tr key={a.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    {a.imagenUrl
                      ? <img src={a.imagenUrl} alt="" className="h-10 w-16 rounded object-cover border border-border" />
                      : <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">Sin img</div>
                    }
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground max-w-xs">
                    <p className="truncate">{a.titulo}</p>
                    {a.extracto && <p className="text-xs text-muted-foreground truncate mt-0.5">{a.extracto}</p>}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{a.categoria || '—'}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_STYLES[a.estado] ?? 'bg-muted text-muted-foreground'}`}>
                      {a.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{formatFecha(a.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3 text-sm">
                      <button type="button" onClick={() => abrirEditar(a)} className="text-primary hover:underline">
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleEstado(a)}
                        className="text-muted-foreground hover:underline"
                      >
                        {a.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button type="button" onClick={() => handleEliminar(a.id)} className="text-destructive hover:underline">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}
