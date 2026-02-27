import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import SectionCard from './SectionCard'
import { authApi } from '../utils/api'
import { useTiendaEstilo, ESTILOS } from '../context/TiendaEstiloContext.jsx'

function PreviewClasico() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-950 ring-1 ring-white/10">
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 h-6 w-24 rounded bg-neutral-800" />
        <div className="grid flex-1 grid-cols-2 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded bg-neutral-900/80">
              <div className="h-12 bg-neutral-800" />
              <div className="flex-1 space-y-1 p-1.5">
                <div className="h-1.5 w-3/4 rounded bg-neutral-700" />
                <div className="h-1 w-1/2 rounded bg-pink-500/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PreviewModerno() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0d0d10] ring-1 ring-white/10">
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 h-6 w-20 rounded bg-white/5" />
        <div className="flex flex-1 flex-col gap-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2 rounded-lg bg-[#141418] p-2 ring-1 ring-white/[0.06]">
              <div className="h-14 w-14 shrink-0 rounded bg-white/5" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-full rounded bg-white/10" />
                <div className="h-1.5 w-1/3 rounded bg-amber-400/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ESTILOS_CONFIG = [
  {
    id: ESTILOS.CLASICO,
    titulo: 'Clásico',
    descripcion: 'Grid de tarjetas con acentos rosados. Ideal para catálogos visuales.',
    Preview: PreviewClasico,
  },
  {
    id: ESTILOS.MODERNO,
    titulo: 'Moderno',
    descripcion: 'Vista limpia con acentos ámbar. Diseño minimalista y elegante.',
    Preview: PreviewModerno,
  },
]

function VistaTienda() {
  const { setEstilo } = useTiendaEstilo()
  const [form, setForm] = useState({
    nombreEmpresa: '',
    logoUrl: '',
    descripcion: '',
    eslogan: '',
    productosPrincipalesTexto: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    authApi
      .obtenerPerfil()
      .then((data) => {
        if (cancelled) return
        const tenant = data?.tenant || {}
        const productosPrincipales = Array.isArray(tenant.productosPrincipales)
          ? tenant.productosPrincipales.join('\n')
          : ''
        setForm({
          nombreEmpresa: tenant.nombre || '',
          logoUrl: tenant.logoUrl || '',
          descripcion: tenant.descripcion || '',
          eslogan: tenant.eslogan || '',
          productosPrincipalesTexto: productosPrincipales,
        })
      })
      .catch(() => {
        // si falla, dejamos el formulario vacío sin romper la vista
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    setError(null)
    try {
      const productosPrincipales = form.productosPrincipalesTexto
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
      await authApi.actualizarTenant({
        nombre: form.nombreEmpresa,
        logoUrl: form.logoUrl,
        descripcion: form.descripcion,
        eslogan: form.eslogan,
        productosPrincipales,
      })
      setMensaje('Información de la tienda guardada correctamente.')
    } catch (err) {
      setError(err.message || 'No se pudo guardar la información de la tienda.')
    } finally {
      setGuardando(false)
    }
  }

  const handleSeleccionar = (id) => {
    setEstilo(id)
    window.open(`${window.location.origin}/tienda?estilo=${id}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Configuración de tu tienda">
        {error && (
          <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
            {mensaje}
          </p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Nombre de la empresa
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Ej. Miracle Solutions SAS"
              value={form.nombreEmpresa}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombreEmpresa: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Logo de la empresa
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
            />
            {form.logoUrl && (
              <p className="mt-2 text-xs text-muted-foreground">
                Logo actual:&nbsp;
                <a
                  href={form.logoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  ver imagen
                </a>
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              (Por ahora, pega la URL de tu logo en el campo siguiente. La subida directa de archivos se
              configurará más adelante.)
            </p>
            <input
              type="url"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-card-foreground"
              placeholder="URL del logo (https://...)"
              value={form.logoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, logoUrl: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Descripción de la empresa
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Cuenta brevemente a qué se dedica tu empresa..."
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Eslogan
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Ej. Hacemos que tu marca brille"
              value={form.eslogan}
              onChange={(e) =>
                setForm((f) => ({ ...f, eslogan: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Productos o servicios principales
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Lista tus productos o servicios clave, uno por línea..."
              value={form.productosPrincipalesTexto}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  productosPrincipalesTexto: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Elige el estilo de tu tienda">
        <p className="mb-6 text-sm text-muted-foreground">
          Elige el estilo de tu tienda. Al hacer clic se abrirá la tienda en una nueva pestaña con el
          diseño seleccionado.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ESTILOS_CONFIG.map(({ id, titulo, descripcion, Preview }) => (
            <div
              key={id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-muted/30 p-4">
                <Preview />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {descripcion}
                </p>
                <button
                  type="button"
                  onClick={() => handleSeleccionar(id)}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Usar este estilo y abrir tienda
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default VistaTienda
