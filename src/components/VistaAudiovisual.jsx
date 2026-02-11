import { useState } from 'react'
import SectionCard from './SectionCard'

const PLATAFORMAS = ['YouTube', 'TikTok', 'Meta', 'Shorts']
const RESOLUCIONES_VIDEO = ['9:16', '16:9', '1:1']
const DURACIONES = ['15s', '30s', '60s', '90s']
const RESOLUCIONES_IMAGEN = ['1080x1080', '1200x628', '1080x1920', '1200x1200']

const PIEZAS_INICIALES = [
  {
    id: 'AV-001',
    tipo: 'Video',
    plataforma: 'TikTok',
    formato: '9:16 · 15s',
    estado: 'pendiente',
    campañaAsociada: 'Lanzamiento Q2',
  },
  {
    id: 'AV-002',
    tipo: 'Imagen',
    plataforma: 'Meta',
    formato: '1080x1080',
    estado: 'aprobada',
    campañaAsociada: 'Promo fin de mes',
  },
  {
    id: 'AV-003',
    tipo: 'Video',
    plataforma: 'YouTube',
    formato: '16:9 · 30s',
    estado: 'usada',
    campañaAsociada: 'Brand Awareness',
  },
]

function badgeEstado(estado) {
  const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium'
  if (estado === 'aprobada') return `${base} bg-emerald-100 text-emerald-700`
  if (estado === 'usada') return `${base} bg-sky-100 text-sky-700`
  return `${base} bg-amber-100 text-amber-700`
}

function generarId(piezas) {
  const nums = piezas
    .map((p) => parseInt(p.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `AV-${String(next).padStart(3, '0')}`
}

const formInitial = {
  tipo: 'Video',
  plataforma: '',
  resolucion: '',
  duracion: '',
  campañaAsociada: '',
  archivo: null,
}

export default function VistaAudiovisual() {
  const [piezas, setPiezas] = useState(PIEZAS_INICIALES)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(formInitial)

  const handleSubir = () => setModalAbierto(true)

  const cerrarModal = () => {
    setModalAbierto(false)
    setForm(formInitial)
  }

  const handleSubmitPieza = (e) => {
    e.preventDefault()
    const formato =
      form.tipo === 'Video'
        ? `${form.resolucion} · ${form.duracion}`
        : form.resolucion
    const nuevaPieza = {
      id: generarId(piezas),
      tipo: form.tipo,
      plataforma: form.plataforma,
      formato,
      estado: 'pendiente',
      campañaAsociada: form.campañaAsociada || undefined,
    }
    setPiezas((prev) => [...prev, nuevaPieza])
    cerrarModal()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setForm((f) => ({ ...f, archivo: file || null }))
  }

  const handleAsociar = (pieza) => {
    // eslint-disable-next-line no-alert
    alert(`Asociar la pieza ${pieza.id} a una campaña.`)
  }

  const handleAprobar = (pieza) => {
    setPiezas((prev) =>
      prev.map((p) => (p.id === pieza.id ? { ...p, estado: 'aprobada' } : p))
    )
  }

  const handleReutilizar = (pieza) => {
    // eslint-disable-next-line no-alert
    alert(`Reutilizar la pieza ${pieza.id} en otras campañas.`)
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Piezas audiovisuales">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Centraliza todo tu material creativo y reutilízalo fácilmente en tus campañas.
          </p>
          <button
            type="button"
            onClick={handleSubir}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Subir pieza audiovisual
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Tipo</th>
                <th className="pb-3 pr-4 font-medium">Plataforma destino</th>
                <th className="pb-3 pr-4 font-medium">Formato / duración</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 pr-4 font-medium">Campaña asociada</th>
                <th className="pb-3 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {piezas.map((pieza) => (
                <tr key={pieza.id} className="border-b border-border">
                  <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">
                    {pieza.id}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.tipo}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.plataforma}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.formato}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={badgeEstado(pieza.estado)}>{pieza.estado}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.campañaAsociada || '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAsociar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Asociar a campaña
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAprobar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Marcar como aprobada
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReutilizar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Reutilizar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">
              Subir pieza audiovisual
            </h2>
            <form onSubmit={handleSubmitPieza} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tipo: e.target.value,
                      resolucion: '',
                      duracion: '',
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                >
                  <option value="Video">Video</option>
                  <option value="Imagen">Imagen</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Plataforma destino
                </label>
                <select
                  value={form.plataforma}
                  onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {PLATAFORMAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {form.tipo === 'Video' ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Resolución
                    </label>
                    <select
                      value={form.resolucion}
                      onChange={(e) => setForm((f) => ({ ...f, resolucion: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {RESOLUCIONES_VIDEO.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Duración
                    </label>
                    <select
                      value={form.duracion}
                      onChange={(e) => setForm((f) => ({ ...f, duracion: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {DURACIONES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Resolución
                  </label>
                  <select
                    value={form.resolucion}
                    onChange={(e) => setForm((f) => ({ ...f, resolucion: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {RESOLUCIONES_IMAGEN.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Archivo ({form.tipo === 'Video' ? 'video' : 'imagen'})
                </label>
                <input
                  type="file"
                  accept={form.tipo === 'Video' ? 'video/*' : 'image/*'}
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
                />
                {form.archivo && (
                  <p className="mt-1 text-xs text-muted-foreground">{form.archivo.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Campaña asociada (opcional)
                </label>
                <input
                  type="text"
                  value={form.campañaAsociada}
                  onChange={(e) => setForm((f) => ({ ...f, campañaAsociada: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                  placeholder="Ej. Lanzamiento Q2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Subir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
