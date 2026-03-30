import { useEffect, useRef, useState } from 'react'
import { iaApi } from '../utils/api'

export default function IACopyResumenPage() {
  const [data, setData] = useState(null)
  const [copySeleccionadoParaImagen, setCopySeleccionadoParaImagen] = useState(null)
  const [imagenPorCopy, setImagenPorCopy] = useState({})
  const [generandoImagenIdx, setGenerandoImagenIdx] = useState(null)
  const [errorImagen, setErrorImagen] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [ultimoCopyVideo, setUltimoCopyVideo] = useState(null)
  const [ultimoRunwayPrompt, setUltimoRunwayPrompt] = useState(null)
  const [ultimaImagenVideo, setUltimaImagenVideo] = useState(null)
  const [indiceCopyParaVideo, setIndiceCopyParaVideo] = useState(null)
  const [ultimoRequestIdVideo, setUltimoRequestIdVideo] = useState(null)
  const [generandoVideo, setGenerandoVideo] = useState(false)
  const [consultandoVideo, setConsultandoVideo] = useState(false)
  const [estadoVideo, setEstadoVideo] = useState(null)
  const [urlVideo, setUrlVideo] = useState(null)
  const [errorVideo, setErrorVideo] = useState(null)
  const [ultimoGuionVoz, setUltimoGuionVoz] = useState(null)
  const [taskIdVoz, setTaskIdVoz] = useState(null)
  const [generandoVoz, setGenerandoVoz] = useState(false)
  const [urlVoz, setUrlVoz] = useState(null)
  const [cargandoResumen, setCargandoResumen] = useState(true)
  const [limpiando, setLimpiando] = useState(false)
  const [generandoCopyDesdeImagen, setGenerandoCopyDesdeImagen] = useState(false)
  const [editandoIdx, setEditandoIdx] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [editandoCopyVideo, setEditandoCopyVideo] = useState(false)
  const [editCopyVideoValue, setEditCopyVideoValue] = useState('')
  const seccionVideoRef = useRef(null)
  const generandoCopyRef = useRef(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function cargar() {
      try {
        const resumen = await iaApi.obtenerResumen()
        if (cancelled) return
        if (resumen && (resumen.producto || resumen.angulo || (resumen.copys && resumen.copys.length))) {
          setData({
            producto: resumen.producto ?? null,
            angulo: resumen.angulo ?? null,
            copys: Array.isArray(resumen.copys) ? resumen.copys : [],
          })
          setImagenPorCopy(
            resumen.imagenPorCopy && typeof resumen.imagenPorCopy === 'object'
              ? resumen.imagenPorCopy
              : {}
          )
          const mensajesRestaurados = Array.isArray(resumen.mensajes) ? resumen.mensajes : []
          setMensajes(mensajesRestaurados)
          // Restaurar el último copy e imagen para que el botón de video funcione tras refrescar
          const ultimoAssistant = [...mensajesRestaurados].reverse().find((m) => m.rol === 'assistant' && !m.imagenUrl)
          if (ultimoAssistant?.contenido) setUltimoCopyVideo(ultimoAssistant.contenido)
          const imagenesCargadas = resumen.imagenPorCopy && typeof resumen.imagenPorCopy === 'object'
            ? resumen.imagenPorCopy
            : {}
          const ultimaImagen = [...mensajesRestaurados].reverse().find((m) => m.imagenUrl)?.imagenUrl
            || Object.values(imagenesCargadas).filter(Boolean).pop()
            || null
          if (ultimaImagen) setUltimaImagenVideo(ultimaImagen)
          if (!cancelled) setCargandoResumen(false)
          return
        }
      } catch (_) {
        // 404 o error de red: usar localStorage como respaldo
      }
      if (cancelled) return
      try {
        const raw = localStorage.getItem('miracle_ia_resumen')
        if (raw) {
          const parsed = JSON.parse(raw)
          setData(parsed)
          setImagenPorCopy({})
          iaApi.guardarResumen({ ...parsed, imagenPorCopy: {} }).catch(() => {})
        }
      } catch (_) {}
      if (!cancelled) setCargandoResumen(false)
    }
    cargar()
    return () => { cancelled = true }
  }, [])

  const handleLimpiar = async () => {
    if (limpiando) return
    setLimpiando(true)
    try {
      await iaApi.limpiarResumen()
      try {
        localStorage.removeItem('miracle_ia_resumen')
      } catch (_) {}
      setData(null)
      setImagenPorCopy({})
      setMensajes([])
    } catch (_) {
      // si falla la API, limpiar solo local
      try {
        localStorage.removeItem('miracle_ia_resumen')
      } catch (_) {}
      setData(null)
      setImagenPorCopy({})
      setMensajes([])
    } finally {
      setLimpiando(false)
    }
  }

  if (cargandoResumen && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Cargando resumen...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
            <svg className="h-6 w-6 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">Sin resumen guardado</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vuelve al asistente IA, selecciona un ángulo, genera los copys y usá el botón{' '}
            <span className="font-medium text-foreground">"Seleccionar ángulo y copys"</span>{' '}
            para abrir esta vista.
          </p>
        </div>
      </div>
    )
  }

  const { producto, angulo, copys } = data

  const construirPromptParaCopy = (c) => {
    const nombreProducto = producto?.nombre || 'producto'
    const titulo = c.copy?.titulo || ''
    const cuerpo = c.copy?.cuerpo || ''
    const cta = c.copy?.cta || ''
    const ideaCentral = c.idea_central || ''

    // Construir descripción visual directa desde el copy
    const partes = []
    if (titulo) partes.push(titulo)
    if (cuerpo) partes.push(cuerpo)
    if (cta) partes.push(cta)
    const descripcionVisual = partes.join('. ')

    return `
INSTRUCCIÓN PRINCIPAL: Las imágenes de referencia muestran el producto real "${nombreProducto}". Debes reproducir ese producto EXACTAMENTE como aparece — mismos colores, mismo diseño, mismos patrones, misma forma. NO inventes ni cambies el producto.

Escena publicitaria a crear:
"${descripcionVisual}"

${ideaCentral ? `Concepto del anuncio: ${ideaCentral}` : ''}

Reglas estrictas:
- El producto en la imagen debe ser IDÉNTICO al de las fotos de referencia
- Fotografía publicitaria realista, alta calidad
- Composición profesional para anuncio en redes sociales (formato cuadrado 1:1)
- Iluminación cuidada que destaque el producto real
- Sin texto ni letras sobreimprestos en la imagen
- Transmitir sensación de calidad, deseo y confianza
`.trim()
  }

  const handleGenerarImagen = async (idx) => {
    const c = copys[idx]
    if (!c) return
    setCopySeleccionadoParaImagen(idx)
    setErrorImagen(null)
    setGenerandoImagenIdx(idx)
    const prompt = construirPromptParaCopy(c)
    try {
      const res = await iaApi.generarImagen({
        prompt,
        aspectRatio: '1:1',
        imagenesProducto: producto?.imagenes || [],
      })
      const b64 = res?.imageBase64
      if (b64) {
        const nuevaImagen = `data:image/png;base64,${b64}`
        setImagenPorCopy((prev) => ({
          ...prev,
          [idx]: nuevaImagen,
        }))
        const nuevoImagenPorCopy = { ...imagenPorCopy, [idx]: nuevaImagen }
        iaApi
          .guardarResumen({
            producto,
            angulo,
            copys,
            imagenPorCopy: nuevoImagenPorCopy,
          })
          .catch(() => {})
      }
    } catch (err) {
      setErrorImagen(err.message || 'No se pudo generar la imagen.')
    } finally {
      setGenerandoImagenIdx(null)
    }
  }

  const handleEditarCopy = (idx) => {
    const c = copys[idx]
    setEditValues({
      titulo: c.copy?.titulo || '',
      cuerpo: c.copy?.cuerpo || '',
      cta: c.copy?.cta || '',
      idea_central: c.idea_central || '',
    })
    setEditandoIdx(idx)
  }

  const handleGuardarEdicion = async (idx) => {
    const nuevosCopys = copys.map((c, i) => {
      if (i !== idx) return c
      return {
        ...c,
        idea_central: editValues.idea_central,
        copy: {
          ...c.copy,
          titulo: editValues.titulo,
          cuerpo: editValues.cuerpo,
          cta: editValues.cta,
        },
      }
    })
    setData((prev) => ({ ...prev, copys: nuevosCopys }))
    setEditandoIdx(null)
    iaApi
      .guardarResumen({ producto, angulo, copys: nuevosCopys, imagenPorCopy })
      .catch(() => {})
  }

  const handleUsarImagenParaVideo = (idx) => {
    const dataUrl = imagenPorCopy[idx]
    if (!dataUrl) return
    setUltimaImagenVideo(dataUrl)
    setIndiceCopyParaVideo(idx)
    setTimeout(() => {
      seccionVideoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background text-card-foreground px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* ── Header ── */}
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
                Resumen de campaña IA
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                {producto?.nombre || 'Producto'}
              </h1>
              {producto?.descripcion && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {producto.descripcion}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLimpiar}
              disabled={limpiando}
              className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
            >
              {limpiando ? 'Limpiando...' : 'Limpiar todo'}
            </button>
          </div>

          {/* Ángulo card */}
          <div className="relative rounded-xl border border-border bg-card px-4 py-3.5 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70 mb-1">
              Ángulo seleccionado
            </p>
            <p className="text-sm font-semibold text-foreground">
              {angulo?.nombre || 'Sin nombre'}
            </p>
            {angulo?.descripcion && (
              <p className="mt-0.5 text-[13px] text-muted-foreground leading-relaxed">
                {angulo.descripcion}
              </p>
            )}
          </div>
        </header>

        <main className="space-y-5">
          {Array.isArray(copys) && copys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {copys.map((c, idx) => {
                const etapaConfig = {
                  TOF: { label: 'TOF · Top of Funnel', pill: 'bg-violet-500/10 text-violet-600 border-violet-500/20', line: 'via-violet-500/50' },
                  MOF: { label: 'MOF · Middle of Funnel', pill: 'bg-amber-500/10 text-amber-600 border-amber-500/20', line: 'via-amber-500/50' },
                  BOF: { label: 'BOF · Bottom of Funnel', pill: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', line: 'via-emerald-500/50' },
                }[c.etapa] || { label: c.etapa, pill: 'bg-muted text-muted-foreground border-border', line: 'via-primary/30' }

                return (
                <article
                  key={idx}
                  className={`relative rounded-xl border bg-card p-5 space-y-3 overflow-hidden transition-all ${
                    copySeleccionadoParaImagen === idx
                      ? 'border-primary/50 ring-1 ring-primary/20 shadow-md shadow-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  {/* Línea de acento superior */}
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${etapaConfig.line} to-transparent`} />

                  <div className="flex items-start justify-between gap-2">
                    {c.etapa && (
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${etapaConfig.pill}`}>
                        {etapaConfig.label}
                      </span>
                    )}
                    {editandoIdx !== idx && (
                      <button
                        type="button"
                        onClick={() => handleEditarCopy(idx)}
                        className="shrink-0 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {editandoIdx === idx ? (
                    <div className="space-y-3">
                      {[
                        { key: 'idea_central', label: 'Idea central', tag: 'input', type: 'text' },
                        { key: 'titulo', label: 'Título', tag: 'input', type: 'text' },
                        { key: 'cuerpo', label: 'Cuerpo', tag: 'textarea' },
                        { key: 'cta', label: 'CTA', tag: 'input', type: 'text' },
                      ].map(({ key, label, tag, type }) => (
                        <div key={key}>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{label}</label>
                          {tag === 'textarea' ? (
                            <textarea
                              rows={3}
                              value={editValues[key]}
                              onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-colors"
                            />
                          ) : (
                            <input
                              type={type}
                              value={editValues[key]}
                              onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                            />
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleGuardarEdicion(idx)}
                          className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditandoIdx(null)}
                          className="rounded-lg border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {c.idea_central && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          <span className="font-medium text-foreground/60">Idea:</span> {c.idea_central}
                        </p>
                      )}
                      <p className="text-[15px] font-bold text-foreground leading-snug">
                        {c.copy?.titulo}
                      </p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {c.copy?.cuerpo}
                      </p>
                      {c.copy?.cta && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/8 border border-primary/15 px-2.5 py-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">CTA</span>
                          <span className="text-xs font-semibold text-primary">{c.copy.cta}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Imagen section */}
                  <div className="mt-1 pt-3 border-t border-border/60">
                    {!imagenPorCopy[idx] ? (
                      <button
                        type="button"
                        disabled={generandoImagenIdx !== null}
                        onClick={() => handleGenerarImagen(idx)}
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
                      >
                        {generandoImagenIdx === idx ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Generando imagen...
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                            </svg>
                            Generar imagen para este copy
                          </>
                        )}
                      </button>
                    ) : null}
                    {errorImagen && generandoImagenIdx === null && copySeleccionadoParaImagen === idx && (
                      <p className="mt-1.5 text-xs text-destructive">{errorImagen}</p>
                    )}
                    {imagenPorCopy[idx] && (
                      <div className="space-y-2.5">
                        <img
                          src={imagenPorCopy[idx]}
                          alt="Imagen generada"
                          onClick={() => window.open(imagenPorCopy[idx], '_blank', 'noopener,noreferrer')}
                          className="rounded-lg border border-border max-h-80 object-contain w-full bg-black/5 cursor-zoom-in hover:opacity-95 transition-opacity"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={generandoImagenIdx !== null}
                            onClick={() => handleGenerarImagen(idx)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors"
                          >
                            {generandoImagenIdx === idx ? 'Generando...' : 'Nueva imagen'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUsarImagenParaVideo(idx)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              ultimaImagenVideo === imagenPorCopy[idx]
                                ? 'bg-primary/15 text-primary border border-primary/30'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                            }`}
                          >
                            {ultimaImagenVideo === imagenPorCopy[idx] ? '✓ Seleccionada para video' : 'Usar para copy de video'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se encontraron copys en la selección guardada.
            </p>
          )}

          <section ref={seccionVideoRef} className="relative rounded-xl border border-border bg-card p-5 space-y-4 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-500/10 border border-pink-500/20">
                <svg className="h-3.5 w-3.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-foreground">Copy de video</h2>
            </div>

            {!ultimaImagenVideo ? (
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Generá una imagen en alguno de los copys de arriba y pulsá{' '}
                <span className="font-semibold text-foreground">«Usar para copy de video»</span>{' '}
                para continuar aquí.
              </p>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <img
                  src={ultimaImagenVideo}
                  alt="Imagen seleccionada"
                  className="h-16 w-16 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Imagen seleccionada para generar el copy de video</p>
                </div>
                <button
                  type="button"
                  disabled={generandoCopyDesdeImagen}
                  onClick={async () => {
                    if (!ultimaImagenVideo) return
                    if (generandoCopyRef.current) return
                    generandoCopyRef.current = true
                    setGenerandoCopyDesdeImagen(true)
                    const actualImagen = ultimaImagenVideo
                    // Reemplazar el último par user+assistant de copy de video en lugar de acumular
                    const mensajesSinUltimoCopy = (() => {
                      const msgs = [...mensajes]
                      if (msgs.length > 0 && msgs[msgs.length - 1].rol === 'assistant' && !msgs[msgs.length - 1].imagenUrl) msgs.pop()
                      if (msgs.length > 0 && msgs[msgs.length - 1].rol === 'user' && msgs[msgs.length - 1].imagenUrl) msgs.pop()
                      return msgs
                    })()
                    const mensajesConUser = [
                      ...mensajesSinUltimoCopy,
                      { rol: 'user', contenido: 'Generar copy de video para esta imagen', imagenUrl: actualImagen },
                    ]
                    setMensajes(mensajesConUser)
                    try {
                      const imagenesProductoUrls = (data?.producto?.imagenes || [])
                        .map(img => img?.url || img)
                        .filter(Boolean)
                      const copyBase = indiceCopyParaVideo !== null ? data?.copys?.[indiceCopyParaVideo] : null
                      const respuesta = await iaApi.generarCopyDesdeImagen({
                        imagenDataUrl: actualImagen,
                        imagenesProducto: imagenesProductoUrls,
                        contextoProducto: {
                          nombre: data?.producto?.nombre || '',
                          descripcion: data?.producto?.descripcion || '',
                          tipo: data?.producto?.tipo || '',
                          usos: data?.producto?.usos || [],
                          caracteristicas: data?.producto?.caracteristicas || [],
                          angulo: data?.angulo?.nombre || '',
                          anguloDescripcion: data?.angulo?.descripcion || '',
                        },
                        copyBase: copyBase ? {
                          etapa: copyBase.etapa || '',
                          titulo: copyBase.copy?.titulo || '',
                          cuerpo: copyBase.copy?.cuerpo || '',
                          cta: copyBase.copy?.cta || '',
                          idea_central: copyBase.idea_central || '',
                        } : null,
                      })
                      const runwayPrompt = respuesta?.runway_prompt || ''
                      const guionVoz = Array.isArray(respuesta?.guion_voz) ? respuesta.guion_voz : []
                      const copyPost = respuesta?.copy_post || {}
                      const partes = []
                      if (runwayPrompt) partes.push(`PROMPT DE VIDEO:\n${runwayPrompt}`)
                      if (guionVoz.length > 0) {
                        partes.push('\nVOZ DEL GUION:', ...guionVoz.map((f, i) => `${i + 1}. ${f}`))
                      }
                      if (copyPost.titulo || copyPost.cuerpo || copyPost.cta) {
                        partes.push('\nCOPY DEL POST:')
                        if (copyPost.titulo) partes.push(`Título: ${copyPost.titulo}`)
                        if (copyPost.cuerpo) partes.push(`Cuerpo: ${copyPost.cuerpo}`)
                        if (copyPost.cta) partes.push(`CTA: ${copyPost.cta}`)
                      }
                      const contenidoFinal = partes.length > 0 ? partes.join('\n') : 'No se pudo generar el prompt de video.'
                      // El ultimoCopyVideo es el runway_prompt directamente — se envía así a Runway
                      setUltimoCopyVideo(runwayPrompt || contenidoFinal)
                      if (runwayPrompt) setUltimoRunwayPrompt(runwayPrompt)
                      if (guionVoz.length > 0) setUltimoGuionVoz(guionVoz.join(' '))
                      const nuevosMensajes = [...mensajesConUser, { rol: 'assistant', contenido: contenidoFinal }]
                      setMensajes(nuevosMensajes)
                      if (data) {
                        iaApi.guardarResumen({ producto: data.producto, angulo: data.angulo, copys: data.copys, imagenPorCopy, mensajes: nuevosMensajes }).catch(() => {})
                      }
                    } catch {
                      const mensajesError = [...mensajesConUser, { rol: 'assistant', contenido: 'No se pudo generar el copy desde la imagen. Verifica tu conexión o la configuración de la IA.' }]
                      setMensajes(mensajesError)
                      if (data) {
                        iaApi.guardarResumen({ producto: data.producto, angulo: data.angulo, copys: data.copys, imagenPorCopy, mensajes: mensajesError }).catch(() => {})
                      }
                    } finally {
                      generandoCopyRef.current = false
                      setGenerandoCopyDesdeImagen(false)
                    }
                  }}
                  className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {generandoCopyDesdeImagen ? 'Generando...' : 'Generar copy'}
                </button>
              </div>
            )}

            <div className="space-y-3 max-h-72 overflow-y-auto min-h-[4rem] pr-1">
              {mensajes.length === 0 && ultimaImagenVideo && (
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Pulsá <span className="font-semibold text-foreground">«Generar copy»</span> para crear el guion, hook e ideas visuales para el video.
                </p>
              )}
              {mensajes.map((m, i) => {
                const esUltimoAssistant = m.rol === 'assistant' && i === mensajes.map(x => x.rol).lastIndexOf('assistant')

                // Modo edición: panel full-width fuera de la burbuja
                if (esUltimoAssistant && editandoCopyVideo) {
                  return (
                    <div key={i} className="rounded-xl border border-primary/30 bg-background p-4 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Editando copy de video</p>
                      <textarea
                        rows={14}
                        value={editCopyVideoValue}
                        onChange={(e) => setEditCopyVideoValue(e.target.value)}
                        className="w-full rounded border border-border bg-muted/30 text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const nuevosMensajes = mensajes.map((msg, j) =>
                              j === i ? { ...msg, contenido: editCopyVideoValue } : msg
                            )
                            setMensajes(nuevosMensajes)
                            setUltimoCopyVideo(editCopyVideoValue)
                            setEditandoCopyVideo(false)
                            if (data) {
                              iaApi.guardarResumen({ producto: data.producto, angulo: data.angulo, copys: data.copys, imagenPorCopy, mensajes: nuevosMensajes }).catch(() => {})
                            }
                          }}
                          className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditandoCopyVideo(false)}
                          className="rounded-md border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={i} className={`flex ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] rounded-lg px-3 py-2 text-sm space-y-2 ${m.rol === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {m.imagenUrl && (
                        <img src={m.imagenUrl} alt="Imagen" className="rounded border border-border/50 max-h-24 object-cover" />
                      )}
                      <div className="whitespace-pre-wrap">{m.contenido}</div>
                      {esUltimoAssistant && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditCopyVideoValue(m.contenido)
                            setEditandoCopyVideo(true)
                          }}
                          className="text-[11px] text-muted-foreground/70 hover:text-foreground underline"
                        >
                          Editar copy
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-2 border-t border-border/60 pt-4 space-y-3">
              {!urlVideo && (
                <button
                  type="button"
                  disabled={!ultimoCopyVideo || !ultimaImagenVideo || generandoVideo || consultandoVideo}
                  onClick={async () => {
                    if (!ultimoCopyVideo || !ultimaImagenVideo) return
                    setErrorVideo(null)
                    setGenerandoVideo(true)
                    setUltimoRequestIdVideo(null)
                    setEstadoVideo(null)
                    setUrlVideo(null)
                    try {
                      const res = await iaApi.generarVideoRunway({
                        copyTexto: ultimoCopyVideo,
                        imageUrl: ultimaImagenVideo,
                      })
                      const taskId = res?.id || null
                      if (taskId) {
                        setUltimoRequestIdVideo(taskId)
                        setGenerandoVideo(false)
                        setConsultandoVideo(true)
                        // Polling automático cada 10 segundos hasta obtener URL
                        const poll = async () => {
                          try {
                            const estado = await iaApi.obtenerEstadoVideoRunway(taskId)
                            const status = estado?.status || null
                            setEstadoVideo(status)
                            if (estado?.url) {
                              setUrlVideo(estado.url)
                              setConsultandoVideo(false)
                              // Generar voz automáticamente cuando el video termina
                              if (ultimoGuionVoz) {
                                setGenerandoVoz(true)
                                setUrlVoz(null)
                                try {
                                  const vozRes = await iaApi.generarVozRunway({ texto: ultimoGuionVoz })
                                  const vozTaskId = vozRes?.id
                                  if (vozTaskId) {
                                    setTaskIdVoz(vozTaskId)
                                    const pollVoz = setInterval(async () => {
                                      try {
                                        const vozEstado = await iaApi.obtenerEstadoVozRunway(vozTaskId)
                                        if (vozEstado?.url) { setUrlVoz(vozEstado.url); setGenerandoVoz(false); clearInterval(pollVoz) }
                                        else if (vozEstado?.status === 'FAILED') { setGenerandoVoz(false); clearInterval(pollVoz) }
                                      } catch { setGenerandoVoz(false); clearInterval(pollVoz) }
                                    }, 5000)
                                  }
                                } catch { setGenerandoVoz(false) }
                              }
                            } else if (status === 'FAILED') {
                              setErrorVideo(estado?.error || 'La generación del video falló en Runway.')
                              setConsultandoVideo(false)
                            } else {
                              setTimeout(poll, 10000)
                            }
                          } catch (err) {
                            setErrorVideo(err.message || 'Error al consultar el estado del video.')
                            setConsultandoVideo(false)
                          }
                        }
                        setTimeout(poll, 10000)
                      } else {
                        setGenerandoVideo(false)
                      }
                    } catch (err) {
                      setErrorVideo(err.message || 'No se pudo iniciar la generación del video.')
                      setGenerandoVideo(false)
                    }
                  }}
                  className="self-start rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Crear video con este copy
                </button>
              )}

              {(generandoVideo || consultandoVideo) && !urlVideo && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <svg className="h-4 w-4 animate-spin text-primary shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {generandoVideo ? 'Enviando a Runway...' : 'Generando video'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {generandoVideo ? 'Iniciando la solicitud de video' : `Esto puede tardar unos minutos${estadoVideo ? ` · ${estadoVideo}` : ''}`}
                    </p>
                  </div>
                </div>
              )}

              {urlVideo && (
                <div className="space-y-3">
                  {/* Video con audio sincronizado */}
                  <div className="relative w-full max-w-xs">
                    <video
                      ref={videoRef}
                      src={urlVideo}
                      controls
                      className="w-full rounded-lg border border-border"
                      onPlay={() => audioRef.current?.play()}
                      onPause={() => audioRef.current?.pause()}
                      onSeeked={() => { if (audioRef.current) audioRef.current.currentTime = videoRef.current.currentTime }}
                      onVolumeChange={() => { if (audioRef.current) audioRef.current.muted = videoRef.current.muted }}
                    />
                    {urlVoz && (
                      <audio
                        ref={audioRef}
                        src={urlVoz}
                        preload="auto"
                      />
                    )}
                  </div>
                  {generandoVoz && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg className="h-3.5 w-3.5 animate-spin text-primary shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Generando voz del guion...
                    </div>
                  )}
                  <div className="flex gap-2">
                    <a
                      href={urlVideo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Abrir video
                    </a>
                    <button
                      type="button"
                      onClick={() => { setUrlVideo(null); setUrlVoz(null); setUltimoRequestIdVideo(null); setEstadoVideo(null) }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Crear otro
                    </button>
                  </div>
                </div>
              )}

              {errorVideo && (
                <p className="text-xs text-destructive">{errorVideo}</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

