import { useState, useRef } from 'react'
import SectionCard from './SectionCard'
import { Mic, Square, Upload, Type } from 'lucide-react'

const PREGUNTAS = [
  '¿Qué productos o servicios ofrece tu negocio?',
  '¿Quién es tu cliente ideal? (edad, intereses, ubicación)',
  '¿Qué problema principal resuelves?',
  '¿Qué te hace diferente de la competencia?',
]

const MODOS = [
  { id: 'texto', label: 'Texto', icon: Type },
  { id: 'grabar', label: 'Grabar audio', icon: Mic },
  { id: 'subir', label: 'Subir audio', icon: Upload },
]

const initialState = () =>
  PREGUNTAS.map(() => ({
    texto: '',
    audioGrabadoUrl: null,
    audioGrabadoBlob: null,
    audioSubido: null,
    audioSubidoUrl: null,
    modo: 'texto',
  }))

function VistaConfiguraNegocio() {
  const [respuestas, setRespuestas] = useState(initialState)
  const [grabandoIndex, setGrabandoIndex] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const setRespuesta = (index, update) => {
    setRespuestas((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...update }
      return next
    })
  }

  const setModo = (index, modo) => {
    setRespuesta(index, { modo })
  }

  const startRecording = async (index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = { mediaRecorder, stream }
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setRespuesta(index, { audioGrabadoBlob: blob, audioGrabadoUrl: url })
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setGrabandoIndex(index)
    } catch (err) {
      console.error('Error al acceder al micrófono:', err)
      alert('No se pudo acceder al micrófono. Revisa los permisos del navegador.')
    }
  }

  const stopRecording = (index) => {
    if (mediaRecorderRef.current?.mediaRecorder?.state === 'recording') {
      mediaRecorderRef.current.mediaRecorder.stop()
      setGrabandoIndex(null)
    }
  }

  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRespuesta(index, { audioSubido: file, audioSubidoUrl: url })
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Preguntas que necesitas responder">
        <p className="mb-6 text-sm text-muted-foreground">
          Responde cada pregunta con texto, grabando audio o subiendo un archivo de audio.
        </p>

        <div className="space-y-8">
          {PREGUNTAS.map((pregunta, index) => {
            const r = respuestas[index]
            const isGrabando = grabandoIndex === index

            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-muted/30 p-5"
              >
                <h3 className="text-sm font-semibold text-card-foreground">
                  {pregunta}
                </h3>

                {/* Tabs: Texto | Grabar audio | Subir audio */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {MODOS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setModo(index, id)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        r.modo === id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Contenido según modo */}
                <div className="mt-4">
                  {r.modo === 'texto' && (
                    <textarea
                      value={r.texto}
                      onChange={(e) => setRespuesta(index, { texto: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      rows={4}
                      placeholder="Escribe tu respuesta aquí..."
                    />
                  )}

                  {r.modo === 'grabar' && (
                    <div className="space-y-3">
                      {!r.audioGrabadoUrl ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {!isGrabando ? (
                            <button
                              type="button"
                              onClick={() => startRecording(index)}
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                              <Mic className="h-4 w-4" />
                              Grabar audio
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => stopRecording(index)}
                              className="inline-flex items-center gap-2 rounded-xl bg-destructive/90 px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90"
                            >
                              <Square className="h-4 w-4" />
                              Detener grabación
                            </button>
                          )}
                          {isGrabando && (
                            <span className="text-sm text-muted-foreground">
                              Grabando... (pulsa Detener cuando termines)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Audio grabado
                          </p>
                          <audio
                            src={r.audioGrabadoUrl}
                            controls
                            className="w-full max-w-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setRespuesta(index, {
                                audioGrabadoUrl: null,
                                audioGrabadoBlob: null,
                              })
                            }
                            className="text-sm text-primary hover:underline"
                          >
                            Eliminar y grabar de nuevo
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {r.modo === 'subir' && (
                    <div className="space-y-3">
                      {!r.audioSubidoUrl ? (
                        <label className="flex cursor-pointer flex-col items-start gap-2">
                          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted">
                            <Upload className="h-4 w-4" />
                            Elegir archivo de audio
                          </span>
                          <input
                            type="file"
                            accept="audio/*"
                            className="sr-only"
                            onChange={(e) => handleFileChange(index, e)}
                          />
                          <span className="text-xs text-muted-foreground">
                            MP3, WAV, M4A, etc.
                          </span>
                        </label>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Archivo subido: {r.audioSubido?.name}
                          </p>
                          <audio
                            src={r.audioSubidoUrl}
                            controls
                            className="w-full max-w-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setRespuesta(index, {
                                audioSubido: null,
                                audioSubidoUrl: null,
                              })
                            }
                            className="text-sm text-primary hover:underline"
                          >
                            Quitar y subir otro
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Guardar respuestas
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

export default VistaConfiguraNegocio
