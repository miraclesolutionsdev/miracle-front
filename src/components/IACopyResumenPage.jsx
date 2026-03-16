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
  const [ultimaImagenVideo, setUltimaImagenVideo] = useState(null)
  const [ultimoRequestIdVideo, setUltimoRequestIdVideo] = useState(null)
  const [generandoVideo, setGenerandoVideo] = useState(false)
  const [consultandoVideo, setConsultandoVideo] = useState(false)
  const [estadoVideo, setEstadoVideo] = useState(null)
  const [urlVideo, setUrlVideo] = useState(null)
  const [errorVideo, setErrorVideo] = useState(null)
  const [cargandoResumen, setCargandoResumen] = useState(true)
  const [limpiando, setLimpiando] = useState(false)
  const [generandoCopyDesdeImagen, setGenerandoCopyDesdeImagen] = useState(false)
  const [editandoIdx, setEditandoIdx] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [editandoCopyVideo, setEditandoCopyVideo] = useState(false)
  const [editCopyVideoValue, setEditCopyVideoValue] = useState('')
  const seccionVideoRef = useRef(null)
  const generandoCopyRef = useRef(false)

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
          // Restaurar el último copy generado para que el botón de video funcione
          const ultimoAssistant = [...mensajesRestaurados].reverse().find((m) => m.rol === 'assistant' && !m.imagenUrl)
          if (ultimoAssistant?.contenido) setUltimoCopyVideo(ultimoAssistant.contenido)
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
      <div className="min-h-screen bg-background text-card-foreground flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Cargando resumen...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-card-foreground flex items-center justify-center px-4">
        <p className="max-w-md text-center text-sm text-muted-foreground">
          No hay una selección de ángulo y copys guardada. Vuelve al asistente IA,
          selecciona un ángulo, genera los copys y usa el botón
          &nbsp;
          <span className="font-medium">“Seleccionar ángulo y copys”</span>
          &nbsp;
          para abrir esta vista.
        </p>
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
    setTimeout(() => {
      seccionVideoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background text-card-foreground px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Resumen de campaña IA
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                {producto?.nombre || 'Producto'}
              </h1>
            </div>
            <button
              type="button"
              onClick={handleLimpiar}
              disabled={limpiando}
              className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {limpiando ? 'Limpiando...' : 'Limpiar todo'}
            </button>
          </div>
          {producto?.descripcion && (
            <p className="text-sm text-muted-foreground">
              {producto.descripcion}
            </p>
          )}
          <div className="mt-2 rounded-lg border border-border bg-card px-4 py-3 space-y-1">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              Ángulo seleccionado
            </p>
            <p className="text-sm font-semibold">
              {angulo?.nombre || 'Sin nombre'}
            </p>
            {angulo?.descripcion && (
              <p className="text-sm text-muted-foreground">
                {angulo.descripcion}
              </p>
            )}
          </div>
        </header>

        <main className="space-y-4">
          {Array.isArray(copys) && copys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {copys.map((c, idx) => (
                <article
                  key={idx}
                  className={`rounded-lg border bg-card p-4 space-y-2 ${
                    copySeleccionadoParaImagen === idx
                      ? 'border-primary ring-1 ring-primary/30'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {c.etapa && (
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                        {c.etapa === 'TOF' && 'TOF · Top of Funnel'}
                        {c.etapa === 'MOF' && 'MOF · Middle of Funnel'}
                        {c.etapa === 'BOF' && 'BOF · Bottom of Funnel'}
                      </p>
                    )}
                    {editandoIdx !== idx && (
                      <button
                        type="button"
                        onClick={() => handleEditarCopy(idx)}
                        className="shrink-0 text-[11px] text-muted-foreground hover:text-foreground underline"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {editandoIdx === idx ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">Idea central</label>
                        <input
                          type="text"
                          value={editValues.idea_central}
                          onChange={(e) => setEditValues((v) => ({ ...v, idea_central: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">Título</label>
                        <input
                          type="text"
                          value={editValues.titulo}
                          onChange={(e) => setEditValues((v) => ({ ...v, titulo: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cuerpo</label>
                        <textarea
                          rows={3}
                          value={editValues.cuerpo}
                          onChange={(e) => setEditValues((v) => ({ ...v, cuerpo: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">CTA</label>
                        <input
                          type="text"
                          value={editValues.cta}
                          onChange={(e) => setEditValues((v) => ({ ...v, cta: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleGuardarEdicion(idx)}
                          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditandoIdx(null)}
                          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {c.idea_central && (
                        <p className="text-xs text-muted-foreground">
                          Idea central: {c.idea_central}
                        </p>
                      )}
                      <p className="text-sm font-semibold">
                        {c.copy?.titulo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {c.copy?.cuerpo}
                      </p>
                      {c.copy?.cta && (
                        <p className="text-xs font-medium text-primary">
                          CTA: {c.copy.cta}
                        </p>
                      )}
                    </>
                  )}
                  <div className="mt-3 pt-2 border-t border-border">
                    {!imagenPorCopy[idx] ? (
                      <button
                        type="button"
                        disabled={generandoImagenIdx !== null}
                        onClick={() => handleGenerarImagen(idx)}
                        className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                      >
                        {generandoImagenIdx === idx
                          ? 'Generando imagen...'
                          : 'Generar imagen para este copy'}
                      </button>
                    ) : null}
                    {errorImagen && generandoImagenIdx === null && copySeleccionadoParaImagen === idx && (
                      <p className="mt-1 text-xs text-destructive">{errorImagen}</p>
                    )}
                    {imagenPorCopy[idx] && (
                      <>
                        <img
                          src={imagenPorCopy[idx]}
                          alt="Imagen generada"
                          onClick={() =>
                            window.open(imagenPorCopy[idx], '_blank', 'noopener,noreferrer')
                          }
                          className="mt-2 rounded border border-border max-h-80 object-contain w-full bg-black cursor-pointer"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={generandoImagenIdx !== null}
                            onClick={() => handleGenerarImagen(idx)}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                          >
                            {generandoImagenIdx === idx
                              ? 'Generando...'
                              : 'Nueva imagen'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUsarImagenParaVideo(idx)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                              ultimaImagenVideo === imagenPorCopy[idx]
                                ? 'bg-primary/20 text-primary border border-primary/40'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                            }`}
                          >
                            {ultimaImagenVideo === imagenPorCopy[idx]
                              ? 'Seleccionada para video'
                              : 'Usar para copy de video'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se encontraron copys en la selección guardada.
            </p>
          )}

          <section ref={seccionVideoRef} className="mt-8 rounded-lg border border-border bg-card p-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Copy de video
            </h2>

            {!ultimaImagenVideo ? (
              <p className="text-sm text-muted-foreground italic">
                Genera una imagen en alguno de los copys de arriba y pulsa <span className="font-medium text-foreground">«Usar para copy de video»</span> para continuar aquí.
              </p>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-2">
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
                    const mensajesConUser = [
                      ...mensajes,
                      { rol: 'user', contenido: 'Generar copy de video para esta imagen', imagenUrl: actualImagen },
                    ]
                    setMensajes(mensajesConUser)
                    try {
                      const imagenesProductoUrls = (data?.producto?.imagenes || [])
                        .map(img => img?.url || img)
                        .filter(Boolean)
                      const respuesta = await iaApi.generarCopyDesdeImagen({
                        imagenDataUrl: actualImagen,
                        imagenesProducto: imagenesProductoUrls,
                        contextoProducto: {
                          nombre: data?.producto?.nombre || '',
                          descripcion: data?.producto?.descripcion || '',
                          angulo: data?.angulo?.nombre || '',
                        },
                      })
                      const hook = respuesta?.hook
                      const guionVoz = Array.isArray(respuesta?.guion_voz) ? respuesta.guion_voz : []
                      const ideasVisuales = Array.isArray(respuesta?.ideas_visuales) ? respuesta.ideas_visuales : []
                      const instruccionesVideo = Array.isArray(respuesta?.instrucciones_ia_video) ? respuesta.instrucciones_ia_video : []
                      const copyPost = respuesta?.copy_post || {}
                      const partes = []
                      if (hook) partes.push(`HOOK:\n${hook}`)
                      if (guionVoz.length > 0) {
                        partes.push('GUION (voz / texto por tramo de segundos):', ...guionVoz.map((b) => `- ${b.segundos || ''}: ${b.texto || ''}`.trim()))
                      }
                      if (ideasVisuales.length > 0) {
                        partes.push('IDEAS VISUALES PARA EL VIDEO:', ...ideasVisuales.map((i) => `- ${i}`))
                      }
                      if (instruccionesVideo.length > 0) {
                        partes.push('INSTRUCCIONES PARA IA DE VIDEO:', ...instruccionesVideo.map((i) => `- ${i}`))
                      }
                      if (copyPost.titulo || copyPost.cuerpo || copyPost.cta) {
                        partes.push('COPY DEL POST/ANUNCIO:')
                        if (copyPost.titulo) partes.push(`Título: ${copyPost.titulo}`)
                        if (copyPost.cuerpo) partes.push(`Cuerpo: ${copyPost.cuerpo}`)
                        if (copyPost.cta) partes.push(`CTA: ${copyPost.cta}`)
                      }
                      const contenidoFinal = partes.length > 0 ? partes.join('\n') : 'Copy generado, pero la estructura esperada no se recibió correctamente.'
                      setUltimoCopyVideo(contenidoFinal)
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

            <div className="space-y-3 max-h-72 overflow-y-auto min-h-[4rem]">
              {mensajes.length === 0 && ultimaImagenVideo && (
                <p className="text-sm text-muted-foreground italic">
                  Pulsa «Generar copy» para crear el guion, hook e ideas visuales para el video.
                </p>
              )}
              {mensajes.map((m, i) => {
                const esUltimoAssistant = m.rol === 'assistant' && i === mensajes.map(x => x.rol).lastIndexOf('assistant')

                // Modo edición: panel full-width fuera de la burbuja
                if (esUltimoAssistant && editandoCopyVideo) {
                  return (
                    <div key={i} className="rounded-lg border border-primary/40 bg-background p-3 space-y-2">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">Editando copy de video</p>
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

            <div className="mt-4 border-t border-border pt-3 space-y-3">
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
                      const primeraImgProducto = data?.producto?.imagenes?.[0]
                      const urlImagenParaVideo = primeraImgProducto?.url || primeraImgProducto || ultimaImagenVideo
                      const res = await iaApi.generarVideo({
                        prompt: ultimoCopyVideo,
                        imageUrl: urlImagenParaVideo,
                      })
                      const requestId = res?.request_id || res?.requestId || res?.id || null
                      if (requestId) {
                        setUltimoRequestIdVideo(requestId)
                        setGenerandoVideo(false)
                        setConsultandoVideo(true)
                        // Polling automático cada 8 segundos hasta obtener URL
                        const poll = async () => {
                          try {
                            const estado = await iaApi.obtenerEstadoVideo(requestId)
                            const status = estado?.status || estado?.state || null
                            setEstadoVideo(status)
                            const url = estado?.url || estado?.video_url || estado?.video?.url || null
                            if (url) {
                              setUrlVideo(url)
                              setConsultandoVideo(false)
                            } else if (status === 'failed' || status === 'error') {
                              setErrorVideo('La generación del video falló en Grok.')
                              setConsultandoVideo(false)
                            } else {
                              setTimeout(poll, 8000)
                            }
                          } catch (err) {
                            setErrorVideo(err.message || 'Error al consultar el estado del video.')
                            setConsultandoVideo(false)
                          }
                        }
                        setTimeout(poll, 8000)
                      } else {
                        setGenerandoVideo(false)
                      }
                    } catch (err) {
                      setErrorVideo(err.message || 'No se pudo iniciar la generación del video.')
                      setGenerandoVideo(false)
                    }
                  }}
                  className="self-start rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
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
                      {generandoVideo ? 'Enviando a Grok...' : 'Generando video'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {generandoVideo ? 'Iniciando la solicitud de video' : `Esto puede tardar unos minutos${estadoVideo ? ` · ${estadoVideo}` : ''}`}
                    </p>
                  </div>
                </div>
              )}

              {urlVideo && (
                <div className="space-y-2">
                  <video
                    src={urlVideo}
                    controls
                    className="w-full max-w-xs rounded-lg border border-border"
                  />
                  <div className="flex gap-2">
                    <a
                      href={urlVideo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Abrir en nueva pestaña
                    </a>
                    <button
                      type="button"
                      onClick={() => { setUrlVideo(null); setUltimoRequestIdVideo(null); setEstadoVideo(null) }}
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

