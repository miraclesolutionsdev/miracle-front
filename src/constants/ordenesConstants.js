/**
 * Constantes para el sistema de Órdenes y Tickets
 * Estilos, colores y datos que se usan en el frontend
 */

export const ESTADO_ORDEN_STYLE = {
  pendiente:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  procesando: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  completada: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  entregada:  'bg-green-500/10 text-green-400 border border-green-500/20',
  cancelada:  'bg-red-500/10 text-red-500 border border-red-500/20',
}

export const ESTADO_PAGO_STYLE = {
  no_pagado: 'bg-red-500/10 text-red-400 border border-red-500/20',
  pagado:    'bg-green-500/10 text-green-400 border border-green-500/20',
}

export const ESTADO_PREPARACION_STYLE = {
  no_preparado: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  preparado:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
}

export const ORIGEN_STYLE = {
  web:       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  whatsapp:  'bg-teal-500/10 text-teal-400 border border-teal-500/20',
}

export const TICKET_TIPO_STYLE = {
  creacion:             { badge: 'bg-blue-500/10 text-blue-400',   icono: '📝' },
  pago_recibido:        { badge: 'bg-green-500/10 text-green-400', icono: '✓'  },
  procesamiento_inicio: { badge: 'bg-purple-500/10 text-purple-400', icono: '⚙️' },
  envio:                { badge: 'bg-orange-500/10 text-orange-400', icono: '📦' },
  entrega:              { badge: 'bg-green-500/10 text-green-500',  icono: '🎉' },
  problema:             { badge: 'bg-red-500/10 text-red-400',      icono: '⚠️' },
  cancelacion:          { badge: 'bg-red-500/10 text-red-500',      icono: '❌' },
  actualización:        { badge: 'bg-gray-500/10 text-gray-400',    icono: '🔄' },
}

export const ESTADO_ETIQUETA = {
  pendiente:  'Pendiente',
  procesando: 'Procesando',
  completada: 'Completada',
  entregada:  'Entregada',
  cancelada:  'Cancelada',
}

export const ESTADO_PAGO_ETIQUETA = {
  no_pagado: 'No pagado',
  pagado:    'Pagado',
}

export const ESTADO_PREPARACION_ETIQUETA = {
  no_preparado: 'No preparado',
  preparado:    'Preparado',
}

export const ORIGEN_ETIQUETA = {
  web:      'Web',
  whatsapp: 'WhatsApp',
}

const TRANSICIONES_VALIDAS = {
  pendiente:  ['procesando', 'cancelada'],
  procesando: ['completada', 'cancelada'],
  completada: ['entregada', 'cancelada'],
  entregada:  [],
  cancelada:  [],
}

export function obtenerEstadosPermitidos(estadoActual) {
  return TRANSICIONES_VALIDAS[estadoActual] || []
}

export function esTransicionValida(estadoActual, estadoNuevo) {
  if (!TRANSICIONES_VALIDAS[estadoActual]) return false
  return TRANSICIONES_VALIDAS[estadoActual].includes(estadoNuevo)
}
