import { useEffect, useState, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { swalError, swalSuccess } from '../utils/swal'
import SectionCard from './SectionCard'
import { authApi } from '../utils/api'
import { useTiendaEstilo, ESTILOS } from '../context/TiendaEstiloContext.jsx'

function PreviewClasico() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0e0f0d] ring-1 ring-[#1c1e18]">
      <div className="flex h-full flex-col p-2.5">
        {/* Header: logo + nombre + categoría */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#1e2a1a] border border-[#3a4a35]" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-20 rounded bg-[#3a4a35]" />
            <div className="h-1.5 w-16 rounded-full bg-[#151910]" />
          </div>
        </div>

        {/* Título editorial */}
        <div className="mb-3 space-y-1.5">
          <div className="h-3 w-32 rounded bg-[#1e2018]" />
          <div className="h-3 w-20 rounded bg-[#1e2018]" />
        </div>

        {/* Grid de tarjetas al estilo clásico */}
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded bg-[#111210] border border-[#1c1e18]"
            >
              <div className="h-10 bg-[#141612]" />
              <div className="flex-1 space-y-1.5 p-1.5">
                <div className="h-1.5 w-4/5 rounded bg-[#3a3a2a]" />
                <div className="h-1.5 w-1/2 rounded bg-[#8aad7a]" />
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
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0a0a0a] ring-1 ring-white/10">
      <div className="flex h-full flex-col p-2.5">
        {/* Eyebrow */}
        <div className="mb-2 flex items-center gap-1 text-[9px] font-semibold tracking-[0.18em] uppercase text-amber-400/80">
          <span className="h-px w-5 rounded-full bg-amber-400" />
          <span>Tienda oficial</span>
        </div>

        {/* Hero top: logo + título */}
        <div className="mb-3 flex items-end gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/15 border border-amber-500/40" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-white/20" />
            <div className="h-2 w-20 rounded bg-amber-400/80" />
          </div>
        </div>

        {/* Descripción + categoría */}
        <div className="mb-3 space-y-1.5">
          <div className="h-2 w-44 rounded bg-white/12" />
          <div className="h-2 w-40 rounded bg-white/8" />
          <div className="mt-1 h-2 w-28 rounded-full bg-white/10" />
        </div>

        {/* Lista de productos al estilo moderno */}
        <div className="flex flex-1 flex-col gap-1.5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-2 rounded-lg bg-[#141418] p-2 ring-1 ring-white/[0.06]"
            >
              <div className="h-10 w-10 shrink-0 rounded bg-white/8" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-32 rounded bg-white/14" />
                <div className="h-2 w-16 rounded bg-amber-400/80" />
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

const FORM_EMPTY = { nombreEmpresa: '', logoUrl: '', descripcion: '', eslogan: '', categoria: '' }

function VistaTienda() {
  const { setEstilo } = useTiendaEstilo()
  const [form, setForm] = useState(FORM_EMPTY)
  const [savedForm, setSavedForm] = useState(FORM_EMPTY)
  const [guardando, setGuardando] = useState(false)

  const cargarPerfil = useCallback(async () => {
    try {
      const data = await authApi.obtenerPerfil()
      const tenant = data?.tenant || {}
      const loaded = {
        nombreEmpresa: tenant.nombre || '',
        logoUrl: tenant.logoUrl || '',
        descripcion: tenant.descripcion || '',
        eslogan: tenant.eslogan || '',
        categoria: tenant.categoria || '',
      }
      setForm(loaded)
      setSavedForm(loaded)
    } catch {
      // si falla, dejamos el formulario vacío sin romper la vista
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    cargarPerfil().catch(() => { if (!cancelled) {} })
    return () => { cancelled = true }
  }, [cargarPerfil])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const categoria = (form.categoria || '').trim()
      const productosPrincipales = categoria ? [categoria] : []
      await authApi.actualizarTenant({
        nombre: form.nombreEmpresa,
        logoUrl: form.logoUrl,
        descripcion: form.descripcion,
        eslogan: form.eslogan,
        categoria,
        productosPrincipales,
      })
      setSavedForm(form)
      swalSuccess('Información de la tienda guardada correctamente.')
    } catch (err) {
      swalError(err.message || 'No se pudo guardar la información de la tienda.')
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelar = () => setForm(savedForm)

  const handleSeleccionar = (id) => {
    setEstilo(id)
    window.open(`${window.location.origin}/tienda?estilo=${id}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Configuración de tu tienda" description="Nombre, logo, descripción y categoría de tu negocio.">
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
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  const { uploadUrl, publicUrl } = await authApi.obtenerPresignedLogo({
                    filename: file.name,
                    contentType: file.type || 'image/png',
                  })
                  const res = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': file.type || 'image/png',
                    },
                    body: file,
                  })
                  if (!res.ok) {
                    throw new Error('No se pudo subir el logo')
                  }
                  setForm((f) => ({ ...f, logoUrl: publicUrl }))
                  swalSuccess('Logo subido. No olvides guardar los cambios.')
                } catch (err) {
                  console.error(err)
                  swalError(err.message || 'No se pudo subir el logo.')
                } finally {
                  e.target.value = ''
                }
              }}
            />
            {form.logoUrl && (
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={form.logoUrl}
                    alt="Logo actual"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    Logo actual
                  </span>
                  <a
                    href={form.logoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Ver en nueva pestaña
                  </a>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Descripción corta
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Describe tu tienda en 2–3 frases que llamen la atención..."
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Eslogan principal
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              placeholder="Ej. Tu negocio, tu tienda y tus campañas en una sola plataforma."
              value={form.eslogan}
              onChange={(e) =>
                setForm((f) => ({ ...f, eslogan: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Categoría del negocio
            </label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              value={form.categoria}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  categoria: e.target.value,
                }))
              }
            >
              <option value="">Selecciona una categoría</option>
              <option value="Marketing digital">Marketing digital</option>
              <option value="Restaurantes y comida">Restaurantes y comida</option>
              <option value="Moda y accesorios">Moda y accesorios</option>
              <option value="Salud y bienestar">Salud y bienestar</option>
              <option value="Belleza y estética">Belleza y estética</option>
              <option value="Educación y cursos">Educación y cursos</option>
              <option value="Tecnología y software">Tecnología y software</option>
              <option value="Inmobiliarias">Inmobiliarias</option>
              <option value="Servicios profesionales">Servicios profesionales</option>
              <option value="Ecommerce general">Ecommerce general</option>
              <option value="Fitness y deporte">Fitness y deporte</option>
              <option value="Turismo y hoteles">Turismo y hoteles</option>
              <option value="Automotriz">Automotriz</option>
              <option value="Finanzas y seguros">Finanzas y seguros</option>
              <option value="Eventos y entretenimiento">Eventos y entretenimiento</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelar}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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

      <SectionCard
        title="Elige el estilo de tu tienda"
        description="Al hacer clic se abrirá la tienda en una nueva pestaña con el diseño seleccionado."
      >
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
