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

const initialState = () => ({
  modo: 'texto',
  texto: '',
  audioGrabadoUrl: null,
  audioGrabadoBlob: null,
  audioSubido: null,
  audioSubidoUrl: null,
})

function VistaInformacionNegocio() {
  const [respuesta, setRespuesta] = useState(initialState)
  const [grabando, setGrabando] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const setModo = (modo) => setRespuesta((prev) => ({ ...prev, modo }))

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = { mediaRecorder, stream }
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        })
        const url = URL.createObjectURL(blob)
        setRespuesta((prev) => ({
          ...prev,
          audioGrabadoBlob: blob,
          audioGrabadoUrl: url,
        }))
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setGrabando(true)
    } catch (err) {
      console.error('Error al acceder al micrófono:', err)
      alert('No se pudo acceder al micrófono. Revisa los permisos del navegador.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.mediaRecorder?.state === 'recording') {
      mediaRecorderRef.current.mediaRecorder.stop()
      setGrabando(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRespuesta((prev) => ({ ...prev, audioSubido: file, audioSubidoUrl: url }))
  }

  const clearAudioGrabado = () => {
    setRespuesta((prev) => ({
      ...prev,
      audioGrabadoUrl: null,
      audioGrabadoBlob: null,
    }))
  }

  const clearAudioSubido = () => {
    setRespuesta((prev) => ({
      ...prev,
      audioSubido: null,
      audioSubidoUrl: null,
    }))
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Información del negocio">
        <p className="mb-6 text-sm text-muted-foreground">
          Responde todas las preguntas a continuación usando un solo método: texto, grabando audio o
          subiendo un archivo de audio.
        </p>

        {/* Listado de preguntas juntas */}
        <div className="mb-6 rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">
            Preguntas que necesitas responder
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-sm text-card-foreground">
            {PREGUNTAS.map((pregunta, i) => (
              <li key={i} className="pl-1">
                {pregunta}
              </li>
            ))}
          </ol>
        </div>

        {/* Un solo modo: Texto | Grabar audio | Subir audio */}
        <div className="flex flex-wrap gap-2">
          {MODOS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setModo(id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                respuesta.modo === id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Contenido según modo único */}
        <div className="mt-4">
          {respuesta.modo === 'texto' && (
            <textarea
              value={respuesta.texto}
              onChange={(e) => setRespuesta((prev) => ({ ...prev, texto: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={6}
              placeholder="Escribe aquí tu respuesta a todas las preguntas..."
            />
          )}

          {respuesta.modo === 'grabar' && (
            <div className="space-y-3">
              {!respuesta.audioGrabadoUrl ? (
                <div className="flex flex-wrap items-center gap-3">
                  {!grabando ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      <Mic className="h-4 w-4" />
                      Grabar audio
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="inline-flex items-center gap-2 rounded-xl bg-destructive/90 px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90"
                    >
                      <Square className="h-4 w-4" />
                      Detener grabación
                    </button>
                  )}
                  {grabando && (
                    <span className="text-sm text-muted-foreground">
                      Grabando... (responde todas las preguntas y luego pulsa Detener)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Audio grabado</p>
                  <audio src={respuesta.audioGrabadoUrl} controls className="w-full max-w-md" />
                  <button
                    type="button"
                    onClick={clearAudioGrabado}
                    className="text-sm text-primary hover:underline"
                  >
                    Eliminar y grabar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}

          {respuesta.modo === 'subir' && (
            <div className="space-y-3">
              {!respuesta.audioSubidoUrl ? (
                <label className="flex cursor-pointer flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    Elegir archivo de audio
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Sube un audio respondiendo todas las preguntas. MP3, WAV, M4A, etc.
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Archivo subido: {respuesta.audioSubido?.name}
                  </p>
                  <audio
                    src={respuesta.audioSubidoUrl}
                    controls
                    className="w-full max-w-md"
                  />
                  <button
                    type="button"
                    onClick={clearAudioSubido}
                    className="text-sm text-primary hover:underline"
                  >
                    Quitar y subir otro
                  </button>
                </div>
              )}
            </div>
          )}
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

export default VistaInformacionNegocio
