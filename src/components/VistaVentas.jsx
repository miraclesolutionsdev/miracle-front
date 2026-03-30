import { useState, useEffect, useCallback } from 'react'
import { ordenesApi } from '../utils/api'
import { alertConfirm, alertSuccess, alertError } from '../utils/alerts'
import SectionCard from './SectionCard'
import {
  ESTADO_ORDEN_STYLE,
  TICKET_TIPO_STYLE,
  ESTADO_ETIQUETA,
  obtenerEstadosPermitidos,
} from '../constants/ordenesConstants'

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatMonto = (n) => `$${Number(n).toLocaleString('es-CO')}`

// ===== TAB 1: LISTAR ÓRDENES =====
function TabOrdenes({
  ordenes,
  loading,
  error,
  onSeleccionar,
  filtro,
  onCambiarFiltro,
  desde,
  hasta,
  onCambiarFechas,
  total,
  skip,
  limit,
  onCambiarPagina,
}) {
  const [busqueda, setBusqueda] = useState('')

  const ordenesFiltradas = ordenes.filter(
    (o) =>
      (filtro === '' || o.estado === filtro) &&
      (o.ordenNumero?.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.cliente?.email?.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      {/* Resumen Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">Total órdenes</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">Pendientes</p>
          <p className="mt-1 text-2xl font-bold text-yellow-400">
            {ordenes.filter((o) => o.estado === 'pendiente').length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">Procesando</p>
          <p className="mt-1 text-2xl font-bold text-blue-400">
            {ordenes.filter((o) => o.estado === 'procesando').length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">Entregadas</p>
          <p className="mt-1 text-2xl font-bold text-green-400">
            {ordenes.filter((o) => o.estado === 'entregada').length}
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <SectionCard>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Buscar por número, cliente o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={filtro}
              onChange={(e) => onCambiarFiltro(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="completada">Completada</option>
              <option value="entregada">Entregada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <input
              type="date"
              value={desde}
              onChange={(e) => onCambiarFechas(e.target.value, hasta)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              title="Desde"
            />
            <input
              type="date"
              value={hasta}
              onChange={(e) => onCambiarFechas(desde, e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              title="Hasta"
            />
            {(desde || hasta) && (
              <button
                onClick={() => onCambiarFechas('', '')}
                className="rounded-lg border border-input px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpiar fechas
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Tabla de Órdenes */}
      <SectionCard title={`Órdenes (${ordenesFiltradas.length})`}>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Cargando órdenes...
          </p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-400">{error}</p>
        ) : ordenesFiltradas.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay órdenes registradas.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Orden</th>
                    <th className="pb-3 pr-4 font-medium">Cliente</th>
                    <th className="pb-3 pr-4 font-medium">Monto</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 pr-4 font-medium">Fecha</th>
                    <th className="pb-3 pr-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-border hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono text-xs font-bold text-foreground">
                        {o.ordenNumero}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-xs">
                          <p className="font-medium text-foreground">
                            {o.cliente?.nombre}
                          </p>
                          <p className="text-muted-foreground">{o.cliente?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {formatMonto(o.totalMonto)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ESTADO_ORDEN_STYLE[o.estado] || ''
                          }`}
                        >
                          {ESTADO_ETIQUETA[o.estado]}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {formatFecha(o.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => onSeleccionar(o._id)}
                          className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Mostrando {skip + 1} a {Math.min(skip + limit, total)} de {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onCambiarPagina(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                  className="rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 disabled:opacity-50 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => onCambiarPagina(skip + limit)}
                  disabled={skip + limit >= total}
                  className="rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 disabled:opacity-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

// ===== TAB 2: DETALLES DE ORDEN =====
function TabDetalles({ ordenId, onVolver, onActualizar }) {
  const [orden, setOrden] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accionando, setAccionando] = useState(false)

  const cargarDetalles = useCallback(async () => {
    try {
      setError(null)
      const data = await ordenesApi.obtener(ordenId)
      setOrden(data.orden)
      setTickets(data.tickets || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [ordenId])

  useEffect(() => {
    cargarDetalles()
  }, [cargarDetalles])

  const cambiarEstado = async (nuevoEstado) => {
    const ok = await alertConfirm({
      title: `¿Cambiar a "${ESTADO_ETIQUETA[nuevoEstado] ?? nuevoEstado}"?`,
      text: 'Este cambio quedará registrado en el timeline de la orden.',
      confirmText: 'Sí, cambiar',
    })
    if (!ok) return
    try {
      setAccionando(true)
      await ordenesApi.actualizarEstado(ordenId, nuevoEstado, '')
      await cargarDetalles()
      onActualizar()
      alertSuccess(`Orden marcada como ${ESTADO_ETIQUETA[nuevoEstado] ?? nuevoEstado}`)
    } catch (err) {
      alertError(err.message || 'No se pudo cambiar el estado')
    } finally {
      setAccionando(false)
    }
  }

  const cancelarOrden = async () => {
    const ok = await alertConfirm({
      title: '¿Cancelar esta orden?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, cancelar',
      confirmButtonColor: '#ef4444',
    })
    if (!ok) return
    try {
      setAccionando(true)
      await ordenesApi.cancelar(ordenId, 'Cancelada desde dashboard')
      await cargarDetalles()
      onActualizar()
      alertSuccess('Orden cancelada')
    } catch (err) {
      alertError(err.message || 'No se pudo cancelar la orden')
    } finally {
      setAccionando(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <button
          onClick={onVolver}
          className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors"
        >
          ← Volver a órdenes
        </button>
        <p className="py-8 text-center text-sm text-muted-foreground">
          Cargando detalles...
        </p>
      </div>
    )
  }

  if (error || !orden) {
    return (
      <div className="space-y-4">
        <button
          onClick={onVolver}
          className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors"
        >
          ← Volver a órdenes
        </button>
        <p className="py-8 text-center text-sm text-red-400">{error || 'Orden no encontrada'}</p>
      </div>
    )
  }

  const estadosDisponibles = obtenerEstadosPermitidos(orden.estado)
  const FLUJO = ['pendiente', 'procesando', 'completada', 'entregada']
  const idxActual = FLUJO.indexOf(orden.estado)
  const esCancelada = orden.estado === 'cancelada'

  const ESTADO_BTN = {
    procesando: 'bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20',
    completada:  'bg-purple-500/10 text-purple-400 border border-purple-500/25 hover:bg-purple-500/20',
    entregada:   'bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20',
    cancelada:   'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onVolver}
        className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors"
      >
        ← Volver a órdenes
      </button>

      {/* ── ESTADO Y ACCIONES ── */}
      <SectionCard>
        {/* Cabecera: estado actual + cancelar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Estado actual</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ORDEN_STYLE[orden.estado]}`}>
              {ESTADO_ETIQUETA[orden.estado]}
            </span>
          </div>
          {['pendiente', 'procesando', 'completada'].includes(orden.estado) && (
            <button
              onClick={cancelarOrden}
              disabled={accionando}
              className="text-xs text-red-400 underline-offset-2 hover:underline disabled:opacity-40"
            >
              Cancelar orden
            </button>
          )}
        </div>

        {/* Stepper visual del flujo */}
        {!esCancelada ? (
          <div className="mb-5 flex items-start gap-0">
            {FLUJO.map((e, i) => {
              const isPast    = i < idxActual
              const isCurrent = i === idxActual
              return (
                <div key={e} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-center">
                    {/* línea izquierda */}
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${isPast || isCurrent ? 'bg-primary' : 'bg-border'}`} />
                    )}
                    {/* círculo */}
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border ${
                      isCurrent
                        ? 'border-primary bg-primary text-white'
                        : isPast
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border bg-background text-muted-foreground'
                    }`}>
                      {isPast ? '✓' : i + 1}
                    </div>
                    {/* línea derecha */}
                    {i < FLUJO.length - 1 && (
                      <div className={`h-0.5 flex-1 ${isPast ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${
                    isCurrent ? 'text-primary' : isPast ? 'text-foreground/50' : 'text-muted-foreground'
                  }`}>
                    {ESTADO_ETIQUETA[e]}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <span className="text-sm text-red-400">✕</span>
            <span className="text-sm font-medium text-red-400">Esta orden fue cancelada</span>
          </div>
        )}

        {/* Botones de transición */}
        {estadosDisponibles.filter(e => e !== 'cancelada').length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {estadosDisponibles.filter(e => e !== 'cancelada').map((estado) => (
              <button
                key={estado}
                onClick={() => cambiarEstado(estado)}
                disabled={accionando}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${ESTADO_BTN[estado]}`}
              >
                Marcar como {ESTADO_ETIQUETA[estado]}
              </button>
            ))}
          </div>
        )}

        {(orden.estado === 'entregada' || esCancelada) && (
          <p className="text-center text-xs text-muted-foreground">
            {orden.estado === 'entregada' ? 'Orden finalizada exitosamente' : ''}
          </p>
        )}
      </SectionCard>

      {/* Información General */}
      <SectionCard title="Información de la orden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Número de orden</p>
            <p className="mt-1 font-mono text-sm font-bold text-foreground">
              {orden.ordenNumero}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                ESTADO_ORDEN_STYLE[orden.estado]
              }`}
            >
              {ESTADO_ETIQUETA[orden.estado]}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {orden.cliente.nombre}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="mt-1 text-sm text-foreground">{orden.cliente.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="mt-1 text-sm text-foreground">
              {orden.cliente.whatsapp || '—'}
            </p>
          </div>
          {orden.cliente.cedula && (
            <div>
              <p className="text-xs text-muted-foreground">Cédula / NIT</p>
              <p className="mt-1 text-sm text-foreground">{orden.cliente.cedula}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Método de pago</p>
            <p className="mt-1 text-sm text-foreground capitalize">
              {orden.metodoPago}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monto total</p>
            <p className="mt-1 text-sm font-bold text-green-400">
              {formatMonto(orden.totalMonto)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha de creación</p>
            <p className="mt-1 text-sm text-foreground">
              {formatFecha(orden.createdAt)}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Datos de envío */}
      {orden.envio && (orden.envio.direccion || orden.envio.barrio) && (
        <SectionCard title="Datos de envío">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orden.envio.direccion && (
              <div>
                <p className="text-xs text-muted-foreground">Dirección</p>
                <p className="mt-1 text-sm text-foreground">{orden.envio.direccion}</p>
              </div>
            )}
            {orden.envio.barrio && (
              <div>
                <p className="text-xs text-muted-foreground">Barrio / Ciudad</p>
                <p className="mt-1 text-sm text-foreground">{orden.envio.barrio}</p>
              </div>
            )}
            {orden.envio.unidadResidencial && (
              <div>
                <p className="text-xs text-muted-foreground">Unidad residencial</p>
                <p className="mt-1 text-sm text-foreground">{orden.envio.unidadResidencial}</p>
              </div>
            )}
            {orden.envio.torre && (
              <div>
                <p className="text-xs text-muted-foreground">Torre / Bloque</p>
                <p className="mt-1 text-sm text-foreground">{orden.envio.torre}</p>
              </div>
            )}
            {orden.envio.apto && (
              <div>
                <p className="text-xs text-muted-foreground">Apto / Casa</p>
                <p className="mt-1 text-sm text-foreground">{orden.envio.apto}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Productos */}
      <SectionCard title="Productos">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Producto</th>
                <th className="pb-3 pr-4 font-medium">Cantidad</th>
                <th className="pb-3 pr-4 font-medium">Precio unitario</th>
                <th className="pb-3 pr-4 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.productos.map((p, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {p.productoNombre}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{p.cantidad}</td>
                  <td className="py-3 pr-4 text-foreground">
                    {formatMonto(p.precioUnitario)}
                  </td>
                  <td className="py-3 pr-4 font-bold text-green-400">
                    {formatMonto(p.precioTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Timeline de Tickets */}
      <SectionCard title="Timeline de eventos">
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-4">
              No hay eventos registrados
            </p>
          ) : (
            tickets.map((t, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <div className="text-lg">
                  {TICKET_TIPO_STYLE[t.tipo]?.icono || '📋'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {t.numeroTicket}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${
                          TICKET_TIPO_STYLE[t.tipo]?.badge || ''
                        }`}
                      >
                        {t.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFecha(t.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-foreground">{t.descripcion}</p>
                  {t.cambios && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.cambios.campo}: {t.cambios.valorAnterior} →{' '}
                      {t.cambios.valorNuevo}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

    </div>
  )
}

// ===== COMPONENTE PRINCIPAL =====
export default function VistaVentas() {
  const [tab, setTab] = useState('ordenes') // 'ordenes' o 'detalles'
  const [selectedOrdenId, setSelectedOrdenId] = useState(null)
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  const cargarOrdenes = useCallback(async () => {
    try {
      setError(null)
      const params = { limit, skip }
      if (filtro) params.estado = filtro
      if (desde) params.desde = desde
      if (hasta) params.hasta = hasta
      const data = await ordenesApi.listar(params)
      setOrdenes(data.ordenes || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filtro, desde, hasta, skip])

  useEffect(() => {
    cargarOrdenes()
  }, [cargarOrdenes])

  const handleSeleccionar = (ordenId) => {
    setSelectedOrdenId(ordenId)
    setTab('detalles')
  }

  const handleVolver = () => {
    setTab('ordenes')
    setSelectedOrdenId(null)
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => {
            setTab('ordenes')
            setSkip(0)
          }}
          className={`px-4 py-2 text-sm font-medium ${
            tab === 'ordenes'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Órdenes ({total})
        </button>
        {tab === 'detalles' && (
          <button
            onClick={() => setTab('detalles')}
            className="border-b-2 border-blue-500 px-4 py-2 text-sm font-medium text-blue-400"
          >
            Detalles
          </button>
        )}
      </div>

      {/* Contenido */}
      {tab === 'ordenes' ? (
        <TabOrdenes
          ordenes={ordenes}
          loading={loading}
          error={error}
          onSeleccionar={handleSeleccionar}
          filtro={filtro}
          onCambiarFiltro={(f) => {
            setFiltro(f)
            setSkip(0)
          }}
          desde={desde}
          hasta={hasta}
          onCambiarFechas={(d, h) => {
            setDesde(d)
            setHasta(h)
            setSkip(0)
          }}
          total={total}
          skip={skip}
          limit={limit}
          onCambiarPagina={(newSkip) => setSkip(newSkip)}
        />
      ) : (
        <TabDetalles
          ordenId={selectedOrdenId}
          onVolver={handleVolver}
          onActualizar={cargarOrdenes}
        />
      )}
    </div>
  )
}
