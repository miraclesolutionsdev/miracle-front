import { useState, useEffect, useCallback } from 'react'
import { whatsappApi } from '../utils/api'
import { MessageCircle, ChevronLeft, RefreshCw, User, Bot } from 'lucide-react'

function formatFecha(ts) {
  if (!ts) return '—'
  const d = new Date(typeof ts === 'number' ? ts * 1000 : ts)
  return d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

function formatDuracion(segs) {
  if (!segs) return '—'
  const m = Math.floor(segs / 60)
  const s = segs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const ESTADO_STYLE = {
  done:       'bg-green-500/10 text-green-400 border border-green-500/20',
  in_progress:'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  failed:     'bg-red-500/10 text-red-400 border border-red-500/20',
}

const ESTADO_LABEL = {
  done:        'Completada',
  in_progress: 'En progreso',
  failed:      'Fallida',
}

export default function VistaClipsWhatsApp() {
  const [conversaciones, setConversaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)
  const [transcripcion, setTranscripcion] = useState(null)
  const [cargandoTranscripcion, setCargandoTranscripcion] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await whatsappApi.listarConversaciones({ page_size: 50 })
      setConversaciones(data.conversations || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function verTranscripcion(conv) {
    setSeleccionada(conv)
    setTranscripcion(null)
    setCargandoTranscripcion(true)
    try {
      const data = await whatsappApi.obtenerConversacion(conv.conversation_id)
      setTranscripcion(data)
    } catch (err) {
      setTranscripcion({ error: err.message })
    } finally {
      setCargandoTranscripcion(false)
    }
  }

  // ── Vista de transcripción ────────────────────────────────────────────────
  if (seleccionada) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSeleccionada(null); setTranscripcion(null) }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </button>
          <span className="text-xs text-muted-foreground/50">|</span>
          <span className="text-sm font-medium">
            {formatFecha(seleccionada.start_time)} · {formatDuracion(seleccionada.call_duration_secs)}
          </span>
          <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full ${ESTADO_STYLE[seleccionada.status] || ''}`}>
            {ESTADO_LABEL[seleccionada.status] || seleccionada.status}
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 min-h-[300px]">
          {cargandoTranscripcion && (
            <p className="text-sm text-muted-foreground text-center py-10">Cargando transcripción...</p>
          )}
          {transcripcion?.error && (
            <p className="text-sm text-red-400 text-center py-10">{transcripcion.error}</p>
          )}
          {transcripcion && !transcripcion.error && (
            <>
              {(!transcripcion.transcript || transcripcion.transcript.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-10">Sin mensajes en esta conversación.</p>
              )}
              {(transcripcion.transcript || []).map((msg, i) => {
                const esAgente = msg.role === 'agent'
                return (
                  <div key={i} className={`flex gap-2.5 ${esAgente ? '' : 'flex-row-reverse'}`}>
                    <div className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs ${
                      esAgente ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {esAgente ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      esAgente
                        ? 'bg-primary/10 text-foreground rounded-tl-sm'
                        : 'bg-muted text-foreground rounded-tr-sm'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Tabla de conversaciones ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''} registrada{conversaciones.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={cargar}
          disabled={cargando}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${cargando ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Duración</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mensajes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">
                  Cargando conversaciones...
                </td>
              </tr>
            )}
            {!cargando && conversaciones.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">
                  No hay conversaciones aún.
                </td>
              </tr>
            )}
            {conversaciones.map((conv) => (
              <tr key={conv.conversation_id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-foreground">{formatFecha(conv.start_time)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDuracion(conv.call_duration_secs)}</td>
                <td className="px-4 py-3 text-muted-foreground">{conv.message_count ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ESTADO_STYLE[conv.status] || 'bg-muted text-muted-foreground'}`}>
                    {ESTADO_LABEL[conv.status] || conv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => verTranscripcion(conv)}
                    className="flex items-center gap-1.5 ml-auto text-xs text-primary hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Ver conversación
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
