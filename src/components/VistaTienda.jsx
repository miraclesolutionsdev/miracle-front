import { useEffect, useState } from 'react'
import SectionCard from './SectionCard'
import { authApi } from '../utils/api'

function VistaTienda() {
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
    </div>
  )
}

export default VistaTienda
