import { useEffect, useRef, useState } from 'react'
import { iaApi } from '../utils/api'

export default function IACopyResumenPage() {
  const [data, setData] = useState(null)
  const [copySeleccionadoParaImagen, setCopySeleccionadoParaImagen] = useState(null)
  const [imagenPorCopy, setImagenPorCopy] = useState({})
  const [mensajes, setMensajes] = useState([])
  const [imagenParaCopy, setImagenParaCopy] = useState(null)
  const [fileImagen, setFileImagen] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('miracle_ia_resumen')
      if (!raw) return
      setData(JSON.parse(raw))
    } catch {
      // ignorar errores de parseo
    }
  }, [])

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

  return (
    <div className="min-h-screen bg-background text-card-foreground px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Resumen de campaña IA
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {producto?.nombre || 'Producto'}
            </h1>
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
                    <button
                      type="button"
                      onClick={() => setCopySeleccionadoParaImagen(idx)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Generar imagen para este copy
                    </button>
                    {copySeleccionadoParaImagen === idx && imagenPorCopy[idx] && (
                      <img
                        src={imagenPorCopy[idx]}
                        alt="Imagen generada"
                        className="mt-2 rounded border border-border max-h-32 object-cover w-full"
                      />
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
          </section>
        </main>
      </div>
    </div>
  )
}

