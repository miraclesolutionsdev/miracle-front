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
  const [respuestas, setRespuestas] = useState([])
  const [historial, setHistorial] = useState([]) // [{rol, contenido}]

  const productoSeleccionado =
    productos.find((p) => String(p.id) === String(productoId)) || null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!productoSeleccionado) {
      setError('Selecciona primero un producto.')
      return
    }
    setLoading(true)

    try {
      // contexto más rico según el producto/plan
      let publico_objetivo =
        'Clientes ideales del negocio que comprarían este producto/servicio.'
      let beneficios_clave = [
        productoSeleccionado.descripcion ||
          'Beneficios principales del producto según la información disponible.',
      ]

      const nombreProd = (productoSeleccionado.nombre || '').trim()

      if (/plan spark/i.test(nombreProd)) {
        publico_objetivo =
          'Emprendedores que están empezando a vender servicios online y necesitan su primera tienda y presencia profesional.'
        beneficios_clave = [
          'Tener una tienda online profesional sin complicarse con la tecnología.',
          'Mostrar tus servicios y precios de forma clara.',
          'Dar el primer paso para validar tu negocio digital.',
        ]
      } else if (/plan luch/i.test(nombreProd)) {
        publico_objetivo =
          'Negocios que ya venden y quieren crecer ordenando su tienda, clientes y campañas.'
        beneficios_clave = [
          'Organizar tu catálogo, clientes y campañas en un mismo lugar.',
          'Mejorar el rendimiento de tus campañas con mejor estructura.',
          'Pasar de vender “a lo loco” a tener un sistema más estable.',
        ]
      } else if (/plan miracle/i.test(nombreProd)) {
        publico_objetivo =
          'Negocios y agencias que quieren escalar fuerte y profesionalizar sus campañas y métricas.'
        beneficios_clave = [
          'Escalar tus servicios/campañas con una plataforma más completa.',
          'Tomar decisiones con datos y métricas claras.',
          'Tener un ecosistema digital serio para crecer a largo plazo.',
        ]
      }

      const productoPayload = {
        nombre: nombreProd,
        categoria: productoSeleccionado.tipo === 'servicio' ? 'Servicio' : 'Producto',
        publico_objetivo,
        beneficios_clave,
        objetivo:
          mensaje.trim() ||
          'Generar 2 copys TOF, 2 copys MOF y 1 copy BOF para vender este producto.',
      }

      // registramos mensaje del usuario en historial
      const nuevoHistorial = [
        ...historial,
        {
          rol: 'user',
          contenido:
            mensaje.trim() ||
            `Genera copys TOF/MOF/BOF para ${productoPayload.nombre}.`,
        },
      ]

      const data = await iaApi.generarCopys({
        producto: productoPayload,
        historial: nuevoHistorial,
      })

      setHistorial([
        ...nuevoHistorial,
        {
          rol: 'assistant',
          contenido: `He generado copys para ${productoPayload.nombre}.`,
        },
      ])

      setRespuestas((prev) => [...prev, { producto: productoPayload.nombre, data }])
      setMensaje('')
    } catch (err) {
      setError(err.message || 'No se pudieron generar los copys.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard title="Asistente IA para campañas">
      <div className="flex flex-col gap-4">
        {/* Selector de producto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Producto para generar copys
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

        {/* Área de conversación + resultados */}
        <div className="h-64 w-full rounded-lg border border-border bg-background/40 p-3 text-sm overflow-y-auto space-y-3">
          {/* Historial tipo chat */}
          {historial.length > 0 && (
            <div className="space-y-2">
              {historial.map((m, idx) => (
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
              ))}
            </div>
          )}

          {/* Última respuesta estructurada */}
          {respuestas.length === 0 ? (
            <p className="text-muted-foreground">
              Usa este asistente para generar ángulos y copys (2 TOF, 2 MOF y 1 BOF) por
              producto. Selecciona un producto, escribe si quieres instrucciones
              adicionales y haz clic en "Generar copys".
            </p>
          ) : (
            <div className="space-y-4">
              {respuestas.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-background/60 p-3 border border-border/60"
                >
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    Copys generados para: {r.producto}
                  </p>
                  {Array.isArray(r.data?.copys) ? (
                    <ul className="space-y-2">
                      {r.data.copys.map((c, i) => (
                        <li key={i} className="rounded-md bg-background/80 p-2">
                          <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                            {c.etapa} · {c.angulo}
                          </p>
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
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No se pudo interpretar la respuesta de la IA.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input para instrucciones/opcional */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            rows={2}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Opcional: agrega contexto extra (ej. público, canal, tono)…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
          />
          <div className="flex items-center justify-between gap-2">
            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              <Send className="mr-1 h-4 w-4" />
              {loading ? 'Generando…' : 'Generar copys'}
            </button>
          </div>
        </form>
      </div>
    </SectionCard>
  )
}

