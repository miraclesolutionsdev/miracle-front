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
  const [imagenParaCopy, setImagenParaCopy] = useState(null)
  const [fileImagen, setFileImagen] = useState(null)
  const [cargandoResumen, setCargandoResumen] = useState(true)
  const [limpiando, setLimpiando] = useState(false)
  const fileInputRef = useRef(null)

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
    } catch (_) {
      // si falla la API, limpiar solo local
      try {
        localStorage.removeItem('miracle_ia_resumen')
      } catch (_) {}
      setData(null)
      setImagenPorCopy({})
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
    const nombreAngulo = angulo?.nombre || 'ángulo'
    const titulo = c.copy?.titulo || ''
    const cuerpo = c.copy?.cuerpo || ''
    const ideaCentral = c.idea_central || ''
    const etapaLabel =
      c.etapa === 'TOF'
        ? 'top of funnel, enfocado en generar curiosidad y awareness'
        : c.etapa === 'MOF'
        ? 'middle of funnel, enfocado en demostrar beneficios y uso real'
        : c.etapa === 'BOF'
        ? 'bottom of funnel, enfocado en urgencia y decisión de compra'
        : 'anuncio para redes sociales'
    return `
Crea una imagen publicitaria para ${nombreProducto}.
Ángulo de comunicación: ${nombreAngulo}.
Etapa del funnel: ${etapaLabel}.

Inspírate en este copy:
Título: "${titulo}"
Cuerpo: "${cuerpo}"
Idea central: "${ideaCentral}"

La imagen debe mostrar el producto como protagonista en un entorno que refuerce el mensaje del copy.
Estilo: fotográfico realista, iluminación cuidada, composición profesional, pensada para anuncios en redes sociales (formato cuadrado 1:1).
Colores y fondo que hagan destacar el producto, sensación de calidad y deseo de compra.
Sin texto sobreimpreso en la imagen.
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

  const handleDescargarImagen = (idx) => {
    const dataUrl = imagenPorCopy[idx]
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `copy-${idx + 1}-imagen.png`
    link.click()
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
                  {c.etapa && (
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      {c.etapa === 'TOF' && 'TOF · Top of Funnel'}
                      {c.etapa === 'MOF' && 'MOF · Middle of Funnel'}
                      {c.etapa === 'BOF' && 'BOF · Bottom of Funnel'}
                    </p>
                  )}
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
                            onClick={() => handleDescargarImagen(idx)}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            Descargar
                          </button>
                          <button
                            type="button"
                            disabled={generandoImagenIdx !== null}
                            onClick={() => handleGenerarImagen(idx)}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                          >
                            {generandoImagenIdx === idx
                              ? 'Generando...'
                              : 'Generar nueva imagen'}
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

          <section className="mt-8 rounded-lg border border-border bg-card p-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Generar copy desde imagen
            </h2>
            <p className="text-xs text-muted-foreground">
              Sube una imagen y el asistente generará un paquete creativo completo: hook, guion de 15–20 segundos, ideas visuales, instrucciones para IA de video y copy del post/anuncio.
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto min-h-[8rem]">
              {mensajes.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Sube una imagen y pulsa &quot;Generar copy&quot; para empezar.
                </p>
              )}
              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm space-y-2 ${
                      m.rol === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {m.imagenUrl && (
                      <img
                        src={m.imagenUrl}
                        alt="Imagen subida"
                        className="rounded border border-border/50 max-h-24 object-cover"
                      />
                    )}
                    <div className="whitespace-pre-wrap">{m.contenido}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setFileImagen(file)
                  const reader = new FileReader()
                  reader.onload = () => setImagenParaCopy(reader.result)
                  reader.readAsDataURL(file)
                }}
              />
              {imagenParaCopy ? (
                <div className="flex items-start gap-2 rounded-lg border border-border p-2">
                  <img
                    src={imagenParaCopy}
                    alt="Vista previa"
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Imagen lista para generar copy</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImagenParaCopy(null)
                          setFileImagen(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Quitar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!imagenParaCopy || !fileImagen) return
                          const actualImagen = imagenParaCopy
                          setMensajes((prev) => [
                            ...prev,
                            {
                              rol: 'user',
                              contenido: 'Generar copy para esta imagen',
                              imagenUrl: actualImagen,
                            },
                          ])
                          try {
                            const respuesta = await iaApi.generarCopyDesdeImagen({
                              imagenDataUrl: actualImagen,
                            })
                            const hook = respuesta?.hook
                            const guionVoz = Array.isArray(respuesta?.guion_voz)
                              ? respuesta.guion_voz
                              : []
                            const ideasVisuales = Array.isArray(respuesta?.ideas_visuales)
                              ? respuesta.ideas_visuales
                              : []
                            const instruccionesVideo = Array.isArray(
                              respuesta?.instrucciones_ia_video,
                            )
                              ? respuesta.instrucciones_ia_video
                              : []
                            const copyPost = respuesta?.copy_post || {}

                            const partes = []
                            if (hook) {
                              partes.push(`HOOK:\n${hook}`)
                            }
                            if (guionVoz.length > 0) {
                              partes.push(
                                'GUION (voz / texto por tramo de segundos):',
                                ...guionVoz.map(
                                  (b) =>
                                    `- ${b.segundos || ''}: ${b.texto || ''}`.trim(),
                                ),
                              )
                            }
                            if (ideasVisuales.length > 0) {
                              partes.push(
                                'IDEAS VISUALES PARA EL VIDEO:',
                                ...ideasVisuales.map((i) => `- ${i}`),
                              )
                            }
                            if (instruccionesVideo.length > 0) {
                              partes.push(
                                'INSTRUCCIONES PARA IA DE VIDEO:',
                                ...instruccionesVideo.map((i) => `- ${i}`),
                              )
                            }
                            if (copyPost.titulo || copyPost.cuerpo || copyPost.cta) {
                              partes.push('COPY DEL POST/ANUNCIO:')
                              if (copyPost.titulo) {
                                partes.push(`Título: ${copyPost.titulo}`)
                              }
                              if (copyPost.cuerpo) {
                                partes.push(`Cuerpo: ${copyPost.cuerpo}`)
                              }
                              if (copyPost.cta) {
                                partes.push(`CTA: ${copyPost.cta}`)
                              }
                            }

                            const contenidoFinal =
                              partes.length > 0
                                ? partes.join('\n')
                                : 'Copy generado, pero la estructura esperada no se recibió correctamente.'

                            setUltimoCopyVideo(contenidoFinal)
                            setUltimaImagenVideo(actualImagen)

                            setMensajes((prev) => [
                              ...prev,
                              {
                                rol: 'assistant',
                                contenido: contenidoFinal,
                              },
                            ])
                          } catch (error) {
                            setMensajes((prev) => [
                              ...prev,
                              {
                                rol: 'assistant',
                                contenido:
                                  'No se pudo generar el copy desde la imagen. Verifica tu conexión o la configuración de la IA.',
                              },
                            ])
                          } finally {
                            setImagenParaCopy(null)
                            setFileImagen(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }
                        }}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                      >
                        Generar copy
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Subir imagen
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Con el último copy generado puedes iniciar un video en Grok y consultar su estado.
              </p>
              <button
                type="button"
                disabled={!ultimoCopyVideo || !ultimaImagenVideo || generandoVideo}
                onClick={async () => {
                  if (!ultimoCopyVideo || !ultimaImagenVideo) return
                  setErrorVideo(null)
                  setGenerandoVideo(true)
                  setUltimoRequestIdVideo(null)
                  setEstadoVideo(null)
                  setUrlVideo(null)
                  try {
                    const res = await iaApi.generarVideo({
                      prompt: ultimoCopyVideo,
                      imageUrl: ultimaImagenVideo,
                      duration: 5,
                    })
                    const requestId =
                      res?.request_id || res?.requestId || res?.id || null
                    if (requestId) {
                      setUltimoRequestIdVideo(requestId)
                    }
                    setMensajes((prev) => [
                      ...prev,
                      {
                        rol: 'assistant',
                        contenido:
                          'Se ha iniciado la generación del video con Grok. Respuesta de la API:\n' +
                          JSON.stringify(res, null, 2),
                      },
                    ])
                  } catch (err) {
                    setErrorVideo(
                      err.message ||
                        'No se pudo iniciar la generación del video. Verifica la configuración de Grok.',
                    )
                  } finally {
                    setGenerandoVideo(false)
                  }
                }}
                className="self-start rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {generandoVideo ? 'Generando video...' : 'Crear video con este copy'}
              </button>
              {ultimoRequestIdVideo && (
                <p className="text-xs text-muted-foreground">
                  ID de solicitud de video: <span className="font-mono">{ultimoRequestIdVideo}</span>
                </p>
              )}
              <button
                type="button"
                disabled={!ultimoRequestIdVideo || consultandoVideo}
                onClick={async () => {
                  if (!ultimoRequestIdVideo) return
                  setErrorVideo(null)
                  setConsultandoVideo(true)
                  try {
                    const res = await iaApi.obtenerEstadoVideo(ultimoRequestIdVideo)
                    const status = res?.status || res?.state || null
                    setEstadoVideo(status)
                    const maybeUrl =
                      res?.url ||
                      res?.video_url ||
                      res?.video?.url ||
                      null
                    if (maybeUrl) {
                      setUrlVideo(maybeUrl)
                    }
                    setMensajes((prev) => [
                      ...prev,
                      {
                        rol: 'assistant',
                        contenido:
                          'Estado actual del video en Grok:\n' +
                          JSON.stringify(res, null, 2),
                      },
                    ])
                  } catch (err) {
                    setErrorVideo(
                      err.message ||
                        'No se pudo consultar el estado del video. Verifica la configuración de Grok.',
                    )
                  } finally {
                    setConsultandoVideo(false)
                  }
                }}
                className="self-start rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
              >
                {consultandoVideo ? 'Consultando estado...' : 'Consultar estado del video'}
              </button>
              {estadoVideo && (
                <p className="text-xs text-muted-foreground">
                  Estado del video: <span className="font-semibold">{estadoVideo}</span>
                </p>
              )}
              {urlVideo && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Video generado:</p>
                  <video
                    src={urlVideo}
                    controls
                    className="w-full max-w-md rounded border border-border"
                  />
                  <a
                    href={urlVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-primary hover:underline"
                  >
                    Abrir video en nueva pestaña
                  </a>
                </div>
              )}
              {errorVideo && (
                <p className="text-xs text-destructive">
                  {errorVideo}
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

