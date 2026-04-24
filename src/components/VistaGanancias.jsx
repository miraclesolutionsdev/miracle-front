import { useState, useEffect } from 'react'
import { ordenesApi } from '../utils/api'
import { alertError } from '../utils/alerts'

export default function VistaGanancias() {
  const [ganancias, setGanancias] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  const cargarGanancias = async () => {
    try {
      setLoading(true)
      const params = {}
      if (fechaDesde) params.desde = fechaDesde
      if (fechaHasta) params.hasta = fechaHasta
      const data = await ordenesApi.obtenerGanancias(params)
      setGanancias(data)
    } catch (error) {
      alertError(error.message || 'Error al cargar ganancias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarGanancias()
  }, [])

  const formatMoney = (value) => {
    return `$${Number(value || 0).toLocaleString('es-CO')}`
  }

  if (loading && !ganancias) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando ganancias...</div>
      </div>
    )
  }

  const resumen = ganancias?.resumen || {}
  const detalle = ganancias?.detalleProductos || []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Ganancias</h1>
          <p className="text-muted-foreground">Resumen de ventas, utilidad y ganancias netas</p>
        </div>
        <button
          onClick={cargarGanancias}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Filtros de fecha */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Desde
          </label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Hasta
          </label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
          />
        </div>
        <button
          onClick={cargarGanancias}
          className="rounded-lg border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/10"
        >
          Filtrar
        </button>
        {(fechaDesde || fechaHasta) && (
          <button
            onClick={() => {
              setFechaDesde('')
              setFechaHasta('')
              setTimeout(cargarGanancias, 0)
            }}
            className="rounded-lg border border-border text-muted-foreground px-4 py-2 text-sm font-medium hover:bg-muted/20"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total vendido */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Vendido</h3>
          </div>
          <p className="text-3xl font-bold text-card-foreground">
            {formatMoney(resumen.totalVendido)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Precio cliente (público)
          </p>
        </div>

        {/* Utilidad */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Utilidad Total</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {formatMoney(resumen.totalUtilidad)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Para dueños/distribuidores
          </p>
        </div>

        {/* Ganancia neta */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Ganancia Neta</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatMoney(resumen.totalGananciaNeta)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Para la empresa
          </p>
        </div>

        {/* Cantidad de órdenes */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Órdenes Completadas</h3>
          </div>
          <p className="text-3xl font-bold text-card-foreground">
            {resumen.cantidadOrdenes || 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pagadas y preparadas
          </p>
        </div>
      </div>

      {/* Detalle por producto */}
      {detalle.length > 0 && (
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <button
              onClick={() => setMostrarDetalle(!mostrarDetalle)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-lg font-semibold text-card-foreground">
                Detalle por producto
              </h2>
              <span className="text-muted-foreground">
                {mostrarDetalle ? '▼' : '▶'}
              </span>
            </button>
          </div>

          {mostrarDetalle && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Total Vendido
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Utilidad (%)
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Total Utilidad
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Ganancia Neta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((item) => (
                    <tr
                      key={item.productoId}
                      className="border-b border-border hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-card-foreground">
                        {item.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-card-foreground">
                        {item.cantidadVendida}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-card-foreground">
                        {formatMoney(item.totalVendido)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-amber-600">
                        {item.utilidadPorcentaje}%
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-amber-600 font-medium">
                        {formatMoney(item.totalUtilidad)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                        {formatMoney(item.totalGananciaNeta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {resumen.cantidadOrdenes === 0 && (
        <div className="bg-muted/20 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No hay órdenes completadas en el período seleccionado
          </p>
        </div>
      )}
    </div>
  )
}
