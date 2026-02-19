import { useState, useEffect, useCallback } from 'react'
import SectionCard from './SectionCard'
import { audiovisualApi } from '../utils/api'

const PLATAFORMAS = ['YouTube', 'TikTok', 'Meta', 'Shorts']
const RESOLUCIONES_VIDEO = ['9:16', '16:9', '1:1']
const FORMATOS_IMAGEN = [
  { value: 'image/jpeg', label: 'JPG / JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WEBP' },
  { value: 'image/gif', label: 'GIF' },
]

const RATIOS_VIDEO = { '9:16': 9 / 16, '16:9': 16 / 9, '1:1': 1 }
const TOLERANCIA_DURACION = 5

function getFormatoDesdeRatio(ratio) {
  if (!ratio || !Number.isFinite(ratio)) return null

  let mejorClave = null
  let mejorDiff = Infinity

  for (const [clave, valor] of Object.entries(RATIOS_VIDEO)) {
    const diff = Math.abs(ratio - valor)
    if (diff < mejorDiff) {
      mejorDiff = diff
      mejorClave = clave
    }
  }

  // Si está razonablemente cerca de alguno de los formatos conocidos, usamos ese nombre
  if (mejorDiff < 0.05) return mejorClave

  return null
}

function validarVideo(file, resolucion, duracionLimiteSegundos) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      const ratio = video.videoWidth / video.videoHeight
      const duracion = video.duration
      const ratioEsperado = RATIOS_VIDEO[resolucion]
      const duracionEsperada = Number(duracionLimiteSegundos) || 0
      const toleranciaRatio = 0.03
      const okRatio = ratioEsperado != null && Math.abs(ratio - ratioEsperado) < toleranciaRatio
      const okDuracion =
        duracionEsperada > 0 &&
        Math.abs(duracion - duracionEsperada) <= TOLERANCIA_DURACION

      const formatoArchivo = getFormatoDesdeRatio(ratio)
      resolve({
        ok: okRatio && okDuracion,
        width: video.videoWidth,
        height: video.videoHeight,
        duracion: Math.round(duracion),
        errores: [
          !okRatio &&
            `Formato debe ser ${resolucion}${
              formatoArchivo ? ` (archivo: ${formatoArchivo})` : ''
            }`,
          !okDuracion &&
            `Duracion debe ser ~${duracionEsperada}s (archivo: ~${Math.round(duracion)}s)`,
        ].filter(Boolean),
      })
    }
    video.onerror = () => reject(new Error('No se pudo leer el video'))
    video.src = URL.createObjectURL(file)
  })
}

function validarImagen(file, formatoEsperado) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve({
        ok: false,
        width: 0,
        height: 0,
        errores: ['No se recibió archivo de imagen'],
      })
      return
    }

    const tipoArchivo = file.type || ''
    const okFormato = formatoEsperado
      ? tipoArchivo === formatoEsperado
      : tipoArchivo.startsWith('image/')

    if (!okFormato) {
      const etiquetaEsperada =
        FORMATOS_IMAGEN.find((f) => f.value === formatoEsperado)?.label || 'imagen válida'
      resolve({
        ok: false,
        width: 0,
        height: 0,
        errores: [
          `Formato debe ser ${etiquetaEsperada} (archivo: ${
            tipoArchivo || 'desconocido'
          })`,
        ],
      })
      return
    }

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({
        ok: true,
        width: img.width,
        height: img.height,
        errores: [],
      })
    }
    img.onerror = () => reject(new Error('No se pudo leer la imagen'))
    img.src = URL.createObjectURL(file)
  })
}

function badgeEstado(estado) {
  const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium'
  if (estado === 'aprobada') return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300`
  if (estado === 'usada') return `${base} bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300`
  return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300`
}

const formInitial = {
  tipo: 'Video',
  plataforma: '',
  resolucion: '',
  duracion: 15, // segundos por defecto
  archivo: null,
}

export default function VistaAudiovisual() {
  const [piezas, setPiezas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(formInitial)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  const loadPiezas = useCallback(async () => {
    try {
      const data = await audiovisualApi.listar()
      setPiezas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar piezas:', err)
      setPiezas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPiezas()
  }, [loadPiezas])

  const handleSubir = () => setModalAbierto(true)

  const cerrarModal = () => {
    setModalAbierto(false)
    setForm(formInitial)
    setError(null)
  }

  const handleSubmitPieza = async (e) => {
    e.preventDefault()
    if (!form.archivo) {
      setError('Debe adjuntar un archivo (video o imagen)')
      return
    }
    if (form.tipo === 'Video' && !form.resolucion) {
      setError('Seleccione una resolucion de video')
      return
    }
    if (form.tipo === 'Imagen' && !form.resolucion) {
      setError('Seleccione un formato de imagen')
      return
    }
    if (form.tipo === 'Video' && !form.duracion) {
      setError('Seleccione una duracion')
      return
    }

    setSubiendo(true)
    setError(null)
    try {
      if (form.tipo === 'Video') {
        const resultado = await validarVideo(form.archivo, form.resolucion, form.duracion)
        if (!resultado.ok) {
          setError(resultado.errores.join('. '))
          setSubiendo(false)
          return
        }
      } else {
        const resultado = await validarImagen(form.archivo, form.resolucion)
        if (!resultado.ok) {
          setError(resultado.errores.join('. '))
          setSubiendo(false)
          return
        }
      }

      const formData = new FormData()
      formData.append('archivo', form.archivo)
      formData.append('tipo', form.tipo)
      formData.append('plataforma', form.plataforma)
      formData.append('resolucion', form.resolucion || '')
      formData.append('duracion', form.duracion || '')
      await audiovisualApi.crearConArchivo(formData)
      await loadPiezas()
      cerrarModal()
    } catch (err) {
      setError(err.message || 'Error al subir la pieza')
    } finally {
      setSubiendo(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setForm((f) => ({ ...f, archivo: file || null }))
  }

  const handleAsociar = (pieza) => {
    alert(`Asociar la pieza ${pieza.id} a una campaña.`)
  }

  const handleAprobar = async (pieza) => {
    try {
      await audiovisualApi.actualizarEstado(pieza.id, 'aprobada')
      await loadPiezas()
    } catch (err) {
      alert(err.message || 'Error al aprobar')
    }
  }

  const handleReutilizar = (pieza) => {
    alert(`Reutilizar la pieza ${pieza.id} en otras campañas.`)
  }

  const esImagen = (contentType) =>
    contentType && contentType.startsWith('image/')

  return (
    <div className="space-y-6">
      <SectionCard title="Piezas audiovisuales">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Centraliza todo tu material creativo y reutilízalo fácilmente en tus campañas. Se guarda en S3.
          </p>
          <button
            type="button"
            onClick={handleSubir}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Subir pieza audiovisual
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Cargando...</p>
        ) : piezas.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aun no hay piezas audiovisuales. Sube la primera.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Tipo</th>
                  <th className="pb-3 pr-4 font-medium">Plataforma</th>
                  <th className="pb-3 pr-4 font-medium">Formato</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 pr-4 font-medium">Ver</th>
                  <th className="pb-3 pr-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {piezas.map((pieza) => (
                  <tr key={pieza.id} className="border-b border-border">
                    <td className="whitespace-nowrap py-3 pr-4 text-card-foreground">
                      {pieza.id.slice(-6)}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                      {pieza.tipo}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                      {pieza.plataforma}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                      {pieza.formato || '—'}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      <span className={badgeEstado(pieza.estado)}>{pieza.estado}</span>
                    </td>
                    <td className="py-3 pr-4">
                      {pieza.url && (
                        <a
                          href={pieza.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {esImagen(pieza.contentType) ? 'Ver imagen' : 'Ver video'}
                        </a>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleAsociar(pieza)}
                          className="text-primary hover:underline"
                        >
                          Asociar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAprobar(pieza)}
                          className="text-primary hover:underline"
                        >
                          Aprobar
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
        )}
      </SectionCard>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">
              Subir pieza audiovisual
            </h2>
            {error && (
              <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
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
                      Duración (segundos)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={60}
                        value={Number(form.duracion) || 1}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, duracion: Number(e.target.value) }))
                        }
                        className="w-full"
                      />
                      <span className="w-12 text-right text-sm text-card-foreground">
                        {Number(form.duracion) || 1}s
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Formato de imagen
                  </label>
                  <select
                    value={form.resolucion}
                    onChange={(e) => setForm((f) => ({ ...f, resolucion: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {FORMATOS_IMAGEN.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
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
                  required
                />
                {form.archivo && (
                  <p className="mt-1 text-xs text-muted-foreground">{form.archivo.name}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={subiendo}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={subiendo}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {subiendo ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
