import { useState } from 'react'
import { Send } from 'lucide-react'
import SectionCard from './SectionCard'
import { useProductos } from '../context/ProductosContext.jsx'
import { iaApi } from '../utils/api'

export default function CampaignAIChat() {
  const { productos } = useProductos()
  const [productoId, setProductoId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [historial, setHistorial] = useState([]) // [{rol, contenido}]
  const [angulos, setAngulos] = useState([])
  const [anguloSeleccionado, setAnguloSeleccionado] = useState(null)
  const [copys, setCopys] = useState([])
  const [copySeleccionado, setCopySeleccionado] = useState(null)
  const [imagenLoading, setImagenLoading] = useState(false)
  const [imagenError, setImagenError] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [guionLoading, setGuionLoading] = useState(false)
  const [guionError, setGuionError] = useState(null)
  const [guionResultado, setGuionResultado] = useState(null)

  const productoSeleccionado =
    productos.find((p) => String(p.id) === String(productoId)) || null

  const construirProductoPayload = () => {
    if (!productoSeleccionado) return null

    const nombreProd = (productoSeleccionado.nombre || '').trim()
    const publico_objetivo =
      'Clientes ideales del negocio que comprarían este producto/servicio.'
    const beneficios_clave = [
      productoSeleccionado.descripcion ||
        'Beneficios principales del producto según la información disponible.',
    ]

    return {
      nombre: nombreProd,
      categoria: productoSeleccionado.tipo === 'servicio' ? 'Servicio' : 'Producto',
      publico_objetivo,
      beneficios_clave,
      objetivo:
        mensaje.trim() ||
        'Generar ángulos de venta y copys efectivos para este producto.',
    }
  }

  const handleGenerarGuionDesdeImagen = async () => {
    setGuionError(null)

    if (!productoSeleccionado) {
      setGuionError('Selecciona primero un producto.')
      return
    }

    if (anguloSeleccionado == null || !angulos[anguloSeleccionado]) {
      setGuionError('Selecciona primero un ángulo.')
      return
    }

    if (copySeleccionado == null || !copys[copySeleccionado]) {
      setGuionError('Selecciona primero un copy.')
      return
    }

    if (!imagenPreview) {
      setGuionError('Genera primero una imagen para este copy.')
      return
    }

    const productoPayload = construirProductoPayload()
    if (!productoPayload) return

    const angulo = angulos[anguloSeleccionado]
    const copy = copys[copySeleccionado]

    const payload = {
      producto: {
        nombre: productoPayload.nombre,
        categoria: productoPayload.categoria,
        descripcion: productoSeleccionado.descripcion || '',
      },
      angulo: {
        nombre: angulo.nombre,
        descripcion: angulo.descripcion,
      },
      copy_base: {
        etapa: copy.etapa,
        titulo: copy.copy?.titulo,
        cuerpo: copy.copy?.cuerpo,
        cta: copy.copy?.cta,
        idea_central: copy.idea_central,
      },
      imagen: {
        url: imagenPreview,
        descripcion_manual: '',
      },
      contexto_pieza: {
        tipo: 'video',
        plataforma: 'TikTok',
        duracion_objetivo_seg: 30,
      },
    }

    try {
      setGuionLoading(true)
      const data = await iaApi.generarGuionDesdeImagen(payload)
      setGuionResultado(data)
    } catch (err) {
      setGuionError(err.message || 'No se pudo generar el guion desde la imagen.')
    } finally {
      setGuionLoading(false)
    }
  }

  const handleGenerarAngulos = async (e) => {
    e.preventDefault()
    setError(null)

    if (!productoSeleccionado) {
      setError('Selecciona primero un producto.')
      return
    }

    const productoPayload = construirProductoPayload()
    if (!productoPayload) return

    setLoading(true)

    try {
      const mensajeUsuario =
        mensaje.trim() ||
        `Genera 5 ángulos de venta diferentes para ${productoPayload.nombre}.`

      const nuevoHistorial = [
        ...historial,
        {
          rol: 'user',
          contenido: mensajeUsuario,
        },
      ]

      const data = await iaApi.generarAngulos({
        producto: productoPayload,
        historial: nuevoHistorial,
      })

      setHistorial([
        ...nuevoHistorial,
        {
          rol: 'assistant',
          contenido: `He generado ángulos de venta para ${productoPayload.nombre}.`,
        },
      ])

      setAngulos(Array.isArray(data?.angulos) ? data.angulos : [])
      setAnguloSeleccionado(null)
      setCopys([])
      setCopySeleccionado(null)
      setMensaje('')
    } catch (err) {
      setError(err.message || 'No se pudieron generar los ángulos.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerarCopys = async () => {
    setError(null)

    if (!productoSeleccionado) {
      setError('Selecciona primero un producto.')
      return
    }

    if (anguloSeleccionado == null || !angulos[anguloSeleccionado]) {
      setError('Selecciona primero un ángulo.')
      return
    }

    const productoPayload = construirProductoPayload()
    if (!productoPayload) return

    const angulo = angulos[anguloSeleccionado]

    setLoading(true)

    try {
      const mensajeUsuario =
        mensaje.trim() ||
        `Genera 5 copys (2 TOF, 2 MOF, 1 BOF) para el ángulo "${angulo.nombre}" de ${productoPayload.nombre}.`

      const nuevoHistorial = [
        ...historial,
        {
          rol: 'user',
          contenido: mensajeUsuario,
        },
      ]

      const data = await iaApi.generarCopys({
        producto: productoPayload,
        angulo,
        historial: nuevoHistorial,
      })

      setHistorial([
        ...nuevoHistorial,
        {
          rol: 'assistant',
          contenido: `He generado copys para el ángulo "${angulo.nombre}".`,
        },
      ])

      setCopys(Array.isArray(data?.copys) ? data.copys : [])
      setCopySeleccionado(null)
    } catch (err) {
      setError(err.message || 'No se pudieron generar los copys.')
    } finally {
      setLoading(false)
    }
  }

  const handleAbrirResumen = async () => {
    if (!productoSeleccionado || anguloSeleccionado == null || !angulos[anguloSeleccionado] || copys.length === 0) {
      setError('Primero selecciona un ángulo y genera los copys.')
      return
    }

    const payload = {
      producto: {
        nombre: productoSeleccionado.nombre,
        descripcion: productoSeleccionado.descripcion || '',
        tipo: productoSeleccionado.tipo,
      },
      angulo: angulos[anguloSeleccionado],
      copys,
    }

    try {
      localStorage.setItem('miracle_ia_resumen', JSON.stringify(payload))
      await iaApi.guardarResumen({ ...payload, imagenPorCopy: {} }).catch(() => {})
      window.open('/ia-resumen', '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError('No se pudo abrir el resumen. Intenta de nuevo.')
      console.error('[CampaignAIChat] Error al guardar resumen IA:', err)
    }
  }

  const handleGenerarImagenCopy = async () => {
    setImagenError(null)

    if (!productoSeleccionado) {
      setImagenError('Selecciona primero un producto.')
      return
    }

    if (anguloSeleccionado == null || !angulos[anguloSeleccionado]) {
      setImagenError('Selecciona primero un ángulo.')
      return
    }

    if (copySeleccionado == null || !copys[copySeleccionado]) {
      setImagenError('Selecciona primero un copy.')
      return
    }

    const productoPayload = construirProductoPayload()
    if (!productoPayload) return

    const angulo = angulos[anguloSeleccionado]
    const copy = copys[copySeleccionado]

    const payloadImagen = {
      producto: {
        nombre: productoPayload.nombre,
        categoria: productoPayload.categoria,
        publico_objetivo: productoPayload.publico_objetivo,
      },
      angulo: {
        nombre: angulo.nombre,
        descripcion: angulo.descripcion,
      },
      copy: {
        etapa: copy.etapa,
        titulo: copy.copy?.titulo,
        cuerpo: copy.copy?.cuerpo,
        cta: copy.copy?.cta,
        idea_central: copy.idea_central,
      },
    }

    try {
      setImagenLoading(true)
      console.log('[CampaignAIChat] Payload para generar imagen:', payloadImagen)

      // Simulación de generación de imagen; luego aquí iría la llamada real a la API.
      setTimeout(() => {
        setImagenPreview(
          'https://via.placeholder.com/1080x1080.png?text=Preview+imagen+copy',
        )
        setImagenLoading(false)
      }, 800)
    } catch (err) {
      setImagenError('No se pudo generar la imagen (simulación).')
      setImagenLoading(false)
      console.error('[CampaignAIChat] Error al simular imagen:', err)
    }
  }

  return (
    <SectionCard title="Asistente IA para campañas">
      <div className="flex flex-col gap-4">
        {/* Selector de producto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Producto para generar ángulos y copys
          </label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
          >
            <option value="">Selecciona un producto…</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Área de conversación + resultados (más grande) */}
        <div className="h-[640px] w-full rounded-lg border border-border bg-background/40 p-3 text-sm flex flex-col gap-3">
          {/* Historial tipo chat */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {historial.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Usa este asistente para generar primero 5 ángulos de venta y luego,
                para el ángulo que elijas, 5 copys (2 TOF, 2 MOF, 1 BOF) para tus
                campañas.
              </p>
            ) : (
              historial.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] rounded-lg px-2 py-1 text-sm ${
                    m.rol === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-background/80 text-card-foreground border border-border/60'
                  }`}
                >
                  {m.contenido}
                </div>
              ))
            )}
          </div>

          <div className="h-px w-full bg-border/60" />

          {/* Zona de resultados: ángulos + copys */}
          <div className="flex-[2] overflow-y-auto space-y-4">
            {angulos.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Aún no hay ángulos generados. Selecciona un producto, añade contexto si
                quieres y haz clic en &quot;Generar ángulos&quot;.
              </p>
            ) : (
              <div className="space-y-3">
                {angulos.map((angulo, idxAngulo) => (
                  <div
                    key={idxAngulo}
                    onClick={() => {
                      setAnguloSeleccionado(idxAngulo)
                      setCopys([])
                      setCopySeleccionado(null)
                    }}
                    className={`cursor-pointer rounded-md p-2 transition ${
                      anguloSeleccionado === idxAngulo
                        ? 'ring-2 ring-primary bg-background'
                        : 'border border-border/50 bg-background/60'
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      Ángulo {idxAngulo + 1}: {angulo.nombre}
                    </p>
                    {angulo.descripcion && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {angulo.descripcion}
                      </p>
                    )}

                    {/* Copys del ángulo seleccionado */}
                    {copys.length > 0 && anguloSeleccionado === idxAngulo && (
                      <ul className="mt-3 space-y-2">
                        {copys.map((c, idxCopy) => (
                          <li
                            key={idxCopy}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCopySeleccionado(idxCopy)
                            }}
                            className={`rounded bg-background p-2 cursor-pointer transition ${
                              copySeleccionado === idxCopy ? 'ring-2 ring-primary' : ''
                            }`}
                          >
                            {c.etapa && (
                              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                                {c.etapa === 'TOF' && 'TOF · Top of Funnel'}
                                {c.etapa === 'MOF' && 'MOF · Middle of Funnel'}
                                {c.etapa === 'BOF' && 'BOF · Bottom of Funnel'}
                              </p>
                            )}
                            {c.idea_central && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Idea central: {c.idea_central}
                              </p>
                            )}
                            <p className="mt-1 text-sm font-semibold">
                              {c.copy?.titulo}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {c.copy?.cuerpo}
                            </p>
                            {c.copy?.cta && (
                              <p className="mt-1 text-xs font-medium text-primary">
                                CTA: {c.copy.cta}
                              </p>
                            )}
                            {c.sugerencia_formato && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Formato sugerido: {c.sugerencia_formato}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input + botones */}
        <form onSubmit={handleGenerarAngulos} className="flex flex-col gap-2">
          <textarea
            rows={2}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Opcional: agrega contexto extra (público, canal, tono)…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}
            <div className="ml-auto flex items-center gap-2">
              {anguloSeleccionado != null && copys.length > 0 && (
                <button
                  type="button"
                  onClick={handleAbrirResumen}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg border border-primary/40 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-60"
                >
                  Seleccionar ángulo y copys
                </button>
              )}
              {anguloSeleccionado != null && (
                <button
                  type="button"
                  onClick={handleGenerarCopys}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-60"
                >
                  Generar 5 copys para este ángulo
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                <Send className="mr-1 h-4 w-4" />
                {loading ? 'Generando…' : 'Generar ángulos'}
              </button>
            </div>
          </div>
        </form>

        {/* Resumen del copy seleccionado */}
        {copySeleccionado != null && copys[copySeleccionado] && (
          <div className="mt-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Copy seleccionado
            </p>
            {copys[copySeleccionado].etapa && (
              <p className="mt-1 text-[11px] font-semibold uppercase">
                Etapa: {copys[copySeleccionado].etapa}
              </p>
            )}
            {copys[copySeleccionado].idea_central && (
              <p className="mt-1 text-[11px]">
                Idea central: {copys[copySeleccionado].idea_central}
              </p>
            )}
            <p className="mt-1 text-sm font-semibold">
              {copys[copySeleccionado].copy?.titulo}
            </p>
            <p className="mt-1 text-sm">
              {copys[copySeleccionado].copy?.cuerpo}
            </p>
            {copys[copySeleccionado].copy?.cta && (
              <p className="mt-1 text-xs font-medium text-primary">
                CTA: {copys[copySeleccionado].copy.cta}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {imagenError && (
                <p className="text-[11px] text-red-500">
                  {imagenError}
                </p>
              )}
              <button
                type="button"
                onClick={handleGenerarImagenCopy}
                disabled={imagenLoading}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {imagenLoading ? 'Generando imagen…' : 'Generar imagen para este copy'}
              </button>
            </div>

            {imagenPreview && (
              <div className="mt-2">
                <p className="mb-1 text-[11px] text-muted-foreground">
                  Preview simulada de la imagen (luego vendrá de la API de imágenes):
                </p>
                <img
                  src={imagenPreview}
                  alt="Preview imagen generada"
                  className="max-h-64 w-auto rounded-md border border-border object-contain"
                />
              </div>
            )}
            {guionError && (
              <p className="mt-2 text-[11px] text-red-500">
                {guionError}
              </p>
            )}
            {imagenPreview && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerarGuionDesdeImagen}
                  disabled={guionLoading}
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60"
                >
                  {guionLoading ? 'Generando guion…' : 'Generar copy audiovisual desde imagen'}
                </button>
              </div>
            )}
            {guionResultado && (
              <div className="mt-3 rounded-lg border border-border bg-background px-3 py-2">
                <p className="mb-1 text-[11px] font-semibold uppercase text-muted-foreground">
                  Guion / pieza audiovisual sugerida
                </p>
                <p className="text-sm font-semibold">
                  {guionResultado.copy_plataforma?.titulo}
                </p>
                {guionResultado.copy_plataforma?.descripcion && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {guionResultado.copy_plataforma.descripcion}
                  </p>
                )}
                {Array.isArray(guionResultado.copy_plataforma?.hashtags) &&
                  guionResultado.copy_plataforma.hashtags.length > 0 && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Hashtags:{' '}
                      {guionResultado.copy_plataforma.hashtags.join(' ')}
                    </p>
                  )}
                {guionResultado.idea_creativa && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Idea creativa: </span>
                    {guionResultado.idea_creativa}
                  </p>
                )}
                {Array.isArray(guionResultado.guion?.estructura) &&
                  guionResultado.guion.estructura.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                        Estructura sugerida
                      </p>
                      {guionResultado.guion.estructura.map((b, idx) => (
                        <p key={idx} className="text-[11px] text-muted-foreground">
                          <span className="font-semibold">
                            {b.segundos}:
                          </span>{' '}
                          {b.descripcion}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}

