import { useState, useEffect, useCallback } from 'react'
import { ordenesApi } from '../utils/api'
import { alertConfirm, alertSuccess, alertError } from '../utils/alerts'
import SectionCard from './SectionCard'
import { RefreshCw } from 'lucide-react'
import {
  ESTADO_ORDEN_STYLE,
  ESTADO_PAGO_STYLE,
  ESTADO_PREPARACION_STYLE,
  ORIGEN_STYLE,
  TICKET_TIPO_STYLE,
  ESTADO_ETIQUETA,
  ESTADO_PAGO_ETIQUETA,
  ESTADO_PREPARACION_ETIQUETA,
  ORIGEN_ETIQUETA,
  obtenerEstadosPermitidos,
} from '../constants/ordenesConstants'

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

const formatMonto = (n) => `$${Number(n).toLocaleString('es-CO')}`

// ===== TAB 1: LISTAR ÓRDENES =====
function TabOrdenes({
  ordenes, loading, error, onSeleccionar,
  filtroPago, filtroPreparacion, filtroOrigen,
  onCambiarFiltros, desde, hasta, onCambiarFechas,
  total, skip, limit, onCambiarPagina, onActualizar,
}) {
  const [busqueda, setBusqueda] = useState('')

  const ordenesFiltradas = ordenes.filter((o) =>
    o.ordenNumero?.toLowerCase().includes(busqueda.toLowerCase()) ||
    o.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    o.cliente?.whatsapp?.includes(busqueda)
  )

  const noPagadas    = ordenes.filter((o) => o.estadoPago        === 'no_pagado').length
  const noPreparadas = ordenes.filter((o) => o.estadoPreparacion === 'no_preparado').length
  const deWhatsApp   = ordenes.filter((o) => o.origen            === 'whatsapp').length

  return (
    <div className="space-y-4">
      {/* Resumen Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">Total órdenes</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">No pagadas</p>
          <p className="mt-1 text-2xl font-bold text-red-400">{noPagadas}</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">No preparadas</p>
          <p className="mt-1 text-2xl font-bold text-yellow-400">{noPreparadas}</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">WhatsApp</p>
          <p className="mt-1 text-2xl font-bold text-teal-400">{deWhatsApp}</p>
        </div>
      </div>

      {/* Filtros */}
      <SectionCard>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Buscar por número, nombre o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={filtroPago}
              onChange={(e) => onCambiarFiltros({ pago: e.target.value })}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos (pago)</option>
              <option value="no_pagado">No pagado</option>
              <option value="pagado">Pagado</option>
            </select>
            <select
              value={filtroPreparacion}
              onChange={(e) => onCambiarFiltros({ preparacion: e.target.value })}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos (preparación)</option>
              <option value="no_preparado">No preparado</option>
              <option value="preparado">Preparado</option>
            </select>
            <select
              value={filtroOrigen}
              onChange={(e) => onCambiarFiltros({ origen: e.target.value })}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos (origen)</option>
              <option value="web">Web</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <input type="date" value={desde}
              onChange={(e) => onCambiarFechas(e.target.value, hasta)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              title="Desde"
            />
            <input type="date" value={hasta}
              onChange={(e) => onCambiarFechas(desde, e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              title="Hasta"
            />
            {(desde || hasta) && (
              <button onClick={() => onCambiarFechas('', '')}
                className="rounded-lg border border-input px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Limpiar fechas
              </button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Tabla */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Órdenes ({ordenesFiltradas.length})</h3>
        <button
          onClick={onActualizar}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>
      <SectionCard>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Cargando órdenes...</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-400">{error}</p>
        ) : ordenesFiltradas.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No hay órdenes registradas.</p>
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
                    <th className="pb-3 pr-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.map((o) => (
                    <tr key={o._id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-mono text-xs font-bold text-foreground">{o.ordenNumero}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${ORIGEN_STYLE[o.origen] || ORIGEN_STYLE.web}`}>
                          {ORIGEN_ETIQUETA[o.origen] || 'Web'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-xs font-medium text-foreground">{o.cliente?.nombre}</p>
                        <p className="text-xs text-muted-foreground">{o.cliente?.whatsapp || o.cliente?.email}</p>
                      </td>
                      <td className="py-3 pr-4 font-medium text-foreground text-xs">
                        {formatMonto(o.totalMonto)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${ESTADO_PREPARACION_STYLE[o.estadoPreparacion] || ESTADO_PREPARACION_STYLE.no_preparado}`}>
                            {ESTADO_PREPARACION_ETIQUETA[o.estadoPreparacion] || 'No preparado'}
                          </span>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${ESTADO_PAGO_STYLE[o.estadoPago] || ESTADO_PAGO_STYLE.no_pagado}`}>
                            {ESTADO_PAGO_ETIQUETA[o.estadoPago] || 'No pagado'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{formatFecha(o.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => onSeleccionar(o._id)}
                          className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors">
                          Ver
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
                Mostrando {skip + 1}–{Math.min(skip + limit, total)} de {total}
              </p>
              <div className="flex gap-2">
                <button onClick={() => onCambiarPagina(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                  className="rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 disabled:opacity-50 transition-colors">
                  Anterior
                </button>
                <button onClick={() => onCambiarPagina(skip + limit)}
                  disabled={skip + limit >= total}
                  className="rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 disabled:opacity-50 transition-colors">
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

  useEffect(() => { cargarDetalles() }, [cargarDetalles])

  const cambiarEstado = async (nuevoEstado) => {
    const ok = await alertConfirm({
      title: `¿Cambiar a "${ESTADO_ETIQUETA[nuevoEstado] ?? nuevoEstado}"?`,
      text: 'Este cambio quedará registrado en el timeline.',
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

  const cambiarPreparacion = async () => {
    const nuevo = orden.estadoPreparacion === 'preparado' ? 'no_preparado' : 'preparado'
    try {
      setAccionando(true)
      await ordenesApi.actualizarPreparacion(ordenId, nuevo)
      await cargarDetalles()
      onActualizar()
      alertSuccess(nuevo === 'preparado' ? '✓ Marcado como preparado' : 'Marcado como no preparado')
    } catch (err) {
      alertError(err.message || 'No se pudo cambiar la preparación')
    } finally {
      setAccionando(false)
    }
  }

  const cambiarPago = async () => {
    const nuevo = orden.estadoPago === 'pagado' ? 'no_pagado' : 'pagado'
    const ok = await alertConfirm({
      title: nuevo === 'pagado' ? '¿Confirmar pago manualmente?' : '¿Revertir estado de pago?',
      text: 'Esto quedará registrado en el timeline.',
      confirmText: 'Sí, confirmar',
    })
    if (!ok) return
    try {
      setAccionando(true)
      await ordenesApi.actualizarPago(ordenId, nuevo)
      await cargarDetalles()
      onActualizar()
      alertSuccess(nuevo === 'pagado' ? '✓ Pago confirmado' : 'Pago revertido')
    } catch (err) {
      alertError(err.message || 'No se pudo cambiar el pago')
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

  if (loading) return (
    <div className="space-y-4">
      <button onClick={onVolver} className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors">← Volver</button>
      <p className="py-8 text-center text-sm text-muted-foreground">Cargando detalles...</p>
    </div>
  )

  if (error || !orden) return (
    <div className="space-y-4">
      <button onClick={onVolver} className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors">← Volver</button>
      <p className="py-8 text-center text-sm text-red-400">{error || 'Orden no encontrada'}</p>
    </div>
  )

  const estadosDisponibles = obtenerEstadosPermitidos(orden.estado)
  const FLUJO = ['pendiente', 'procesando', 'completada', 'entregada']
  const idxActual = FLUJO.indexOf(orden.estado)
  const esCancelada = orden.estado === 'cancelada'

  const ESTADO_BTN = {
    procesando: 'bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20',
    completada:  'bg-purple-500/10 text-purple-400 border border-purple-500/25 hover:bg-purple-500/20',
    entregada:   'bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20',
  }

  return (
    <div className="space-y-4">
      <button onClick={onVolver} className="mb-4 rounded-md bg-button px-3 py-1 text-xs font-medium hover:bg-button/80 transition-colors">
        ← Volver a órdenes
      </button>

      {/* ── ESTADOS: PAGO + PREPARACIÓN ── */}
      <SectionCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_PREPARACION_STYLE[orden.estadoPreparacion] || ESTADO_PREPARACION_STYLE.no_preparado}`}>
              {ESTADO_PREPARACION_ETIQUETA[orden.estadoPreparacion] || 'No preparado'}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_PAGO_STYLE[orden.estadoPago] || ESTADO_PAGO_STYLE.no_pagado}`}>
              {ESTADO_PAGO_ETIQUETA[orden.estadoPago] || 'No pagado'}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ORIGEN_STYLE[orden.origen] || ORIGEN_STYLE.web}`}>
              {ORIGEN_ETIQUETA[orden.origen] || 'Web'}
            </span>
          </div>
          {['pendiente', 'procesando', 'completada'].includes(orden.estado) && (
            <button onClick={cancelarOrden} disabled={accionando}
              className="text-xs text-red-400 underline-offset-2 hover:underline disabled:opacity-40">
              Cancelar orden
            </button>
          )}
        </div>

        {/* Botones de pago y preparación */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={cambiarPreparacion}
            disabled={accionando || esCancelada}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 border ${
              orden.estadoPreparacion === 'preparado'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25 hover:bg-yellow-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
            }`}
          >
            {orden.estadoPreparacion === 'preparado' ? 'Marcar no preparado' : 'Marcar preparado'}
          </button>
          <button
            onClick={cambiarPago}
            disabled={accionando || esCancelada}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 border ${
              orden.estadoPago === 'pagado'
                ? 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20'
            }`}
          >
            {orden.estadoPago === 'pagado' ? 'Revertir pago' : 'Confirmar pago'}
          </button>
        </div>

        {/* Stepper flujo logístico */}
        {!esCancelada ? (
          <>
            <p className="mb-3 text-xs text-muted-foreground">Flujo logístico</p>
            <div className="mb-4 flex items-start gap-0">
              {FLUJO.map((e, i) => {
                const isPast    = i < idxActual
                const isCurrent = i === idxActual
                return (
                  <div key={e} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full items-center">
                      {i > 0 && <div className={`h-0.5 flex-1 ${isPast || isCurrent ? 'bg-primary' : 'bg-border'}`} />}
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border ${
                        isCurrent ? 'border-primary bg-primary text-white'
                        : isPast   ? 'border-primary bg-primary/20 text-primary'
                        :            'border-border bg-background text-muted-foreground'
                      }`}>
                        {isPast ? '✓' : i + 1}
                      </div>
                      {i < FLUJO.length - 1 && <div className={`h-0.5 flex-1 ${isPast ? 'bg-primary' : 'bg-border'}`} />}
                    </div>
                    <span className={`text-[10px] font-medium ${isCurrent ? 'text-primary' : isPast ? 'text-foreground/50' : 'text-muted-foreground'}`}>
                      {ESTADO_ETIQUETA[e]}
                    </span>
                  </div>
                )
              })}
            </div>
            {estadosDisponibles.filter(e => e !== 'cancelada').length > 0 && (
              <div className="flex flex-wrap gap-2">
                {estadosDisponibles.filter(e => e !== 'cancelada').map((estado) => (
                  <button key={estado} onClick={() => cambiarEstado(estado)} disabled={accionando}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${ESTADO_BTN[estado]}`}>
                    Marcar como {ESTADO_ETIQUETA[estado]}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <span className="text-sm text-red-400">✕</span>
            <span className="text-sm font-medium text-red-400">Esta orden fue cancelada</span>
          </div>
        )}
      </SectionCard>

      {/* Información General */}
      <SectionCard title="Información de la orden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Número de orden</p>
            <p className="mt-1 font-mono text-sm font-bold text-foreground">{orden.ordenNumero}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Origen</p>
            <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ORIGEN_STYLE[orden.origen] || ORIGEN_STYLE.web}`}>
              {ORIGEN_ETIQUETA[orden.origen] || 'Web'}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="mt-1 text-sm font-medium text-foreground">{orden.cliente.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp / Teléfono</p>
            <p className="mt-1 text-sm text-foreground">{orden.cliente.whatsapp || '—'}</p>
          </div>
          {orden.cliente.email && !orden.cliente.email.includes('@whatsapp.local') && (
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 text-sm text-foreground">{orden.cliente.email}</p>
            </div>
          )}
          {orden.cliente.cedula && (
            <div>
              <p className="text-xs text-muted-foreground">Cédula / NIT</p>
              <p className="mt-1 text-sm text-foreground">{orden.cliente.cedula}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Método de pago</p>
            <p className="mt-1 text-sm text-foreground capitalize">{orden.metodoPago}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monto total</p>
            <p className="mt-1 text-sm font-bold text-green-400">{formatMonto(orden.totalMonto)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="mt-1 text-sm text-foreground">{formatFecha(orden.createdAt)}</p>
          </div>
        </div>
      </SectionCard>

      {/* Datos de envío */}
      {orden.envio && (orden.envio.direccion || orden.envio.barrio) && (
        <SectionCard title="Datos de envío">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orden.envio.direccion && <div><p className="text-xs text-muted-foreground">Dirección</p><p className="mt-1 text-sm text-foreground">{orden.envio.direccion}</p></div>}
            {orden.envio.barrio    && <div><p className="text-xs text-muted-foreground">Ciudad / Barrio</p><p className="mt-1 text-sm text-foreground">{orden.envio.barrio}</p></div>}
            {orden.envio.unidadResidencial && <div><p className="text-xs text-muted-foreground">Unidad</p><p className="mt-1 text-sm text-foreground">{orden.envio.unidadResidencial}</p></div>}
            {orden.envio.torre && <div><p className="text-xs text-muted-foreground">Torre / Bloque</p><p className="mt-1 text-sm text-foreground">{orden.envio.torre}</p></div>}
            {orden.envio.apto  && <div><p className="text-xs text-muted-foreground">Apto / Casa</p><p className="mt-1 text-sm text-foreground">{orden.envio.apto}</p></div>}
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
                <th className="pb-3 pr-4 font-medium">Detalle</th>
                <th className="pb-3 pr-4 font-medium">Cant.</th>
                <th className="pb-3 pr-4 font-medium">P. Unit.</th>
                <th className="pb-3 pr-4 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.productos.map((p, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium text-foreground">{p.productoNombre}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {[orden.talla && `Talla: ${orden.talla}`, orden.color && `Color: ${orden.color}`].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{p.cantidad}</td>
                  <td className="py-3 pr-4 text-foreground">{formatMonto(p.precioUnitario)}</td>
                  <td className="py-3 pr-4 font-bold text-green-400">{formatMonto(p.precioTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Timeline de eventos">
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-4">No hay eventos registrados</p>
          ) : (
            tickets.map((t, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-border bg-background/50 p-3">
                <div className="text-lg">{TICKET_TIPO_STYLE[t.tipo]?.icono || '📋'}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.numeroTicket}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${TICKET_TIPO_STYLE[t.tipo]?.badge || ''}`}>
                        {t.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatFecha(t.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs text-foreground">{t.descripcion}</p>
                  {t.cambios && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.cambios.campo}: {t.cambios.valorAnterior} → {t.cambios.valorNuevo}
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
  const [tab, setTab] = useState('ordenes')
  const [selectedOrdenId, setSelectedOrdenId] = useState(null)
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroPago, setFiltroPago] = useState('')
  const [filtroPreparacion, setFiltroPreparacion] = useState('')
  const [filtroOrigen, setFiltroOrigen] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  const cargarOrdenes = useCallback(async () => {
    try {
      setError(null)
      const params = { limit, skip }
      if (filtroPago)        params.estadoPago        = filtroPago
      if (filtroPreparacion) params.estadoPreparacion = filtroPreparacion
      if (filtroOrigen)      params.origen            = filtroOrigen
      if (desde)             params.desde             = desde
      if (hasta)             params.hasta             = hasta
      const data = await ordenesApi.listar(params)
      setOrdenes(data.ordenes || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filtroPago, filtroPreparacion, filtroOrigen, desde, hasta, skip])

  useEffect(() => { cargarOrdenes() }, [cargarOrdenes])

  const handleCambiarFiltros = ({ pago, preparacion, origen }) => {
    if (pago        !== undefined) setFiltroPago(pago)
    if (preparacion !== undefined) setFiltroPreparacion(preparacion)
    if (origen      !== undefined) setFiltroOrigen(origen)
    setSkip(0)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => { setTab('ordenes'); setSkip(0) }}
          className={`px-4 py-2 text-sm font-medium ${tab === 'ordenes' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Órdenes ({total})
        </button>
        {tab === 'detalles' && (
          <button className="border-b-2 border-blue-500 px-4 py-2 text-sm font-medium text-blue-400">
            Detalles
          </button>
        )}
      </div>

      {tab === 'ordenes' ? (
        <TabOrdenes
          ordenes={ordenes} loading={loading} error={error}
          onSeleccionar={(id) => { setSelectedOrdenId(id); setTab('detalles') }}
          filtroPago={filtroPago} filtroPreparacion={filtroPreparacion} filtroOrigen={filtroOrigen}
          onCambiarFiltros={handleCambiarFiltros}
          desde={desde} hasta={hasta}
          onCambiarFechas={(d, h) => { setDesde(d); setHasta(h); setSkip(0) }}
          total={total} skip={skip} limit={limit}
          onCambiarPagina={(s) => setSkip(s)}
          onActualizar={cargarOrdenes}
        />
      ) : (
        <TabDetalles
          ordenId={selectedOrdenId}
          onVolver={() => { setTab('ordenes'); setSelectedOrdenId(null) }}
          onActualizar={cargarOrdenes}
        />
      )}
    </div>
  )
}
