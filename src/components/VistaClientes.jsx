import { useState, useEffect, useCallback } from 'react'
import ClientesList from './ClientesList'
import ClienteForm from './ClienteForm'
import ClienteDetalle from './ClienteDetalle'
import { clientesApi } from '../utils/api'
import {
  exportToExcel,
  readExcelFile,
  CLIENTES_HEADERS,
  clientesToRows,
  rowsToClientes,
  validarCabecerasClientes,
  validarFilasClientes,
} from '../utils/excel'

function formatClienteFromApi(c) {
  return {
    ...c,
    fechaCreacion: c.fechaCreacion
      ? new Date(c.fechaCreacion).toLocaleString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—',
  }
}

const ORIGEN_OPTIONS = [
  { value: '', label: 'Todos los orígenes' },
  { value: 'plataforma', label: 'Plataforma' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

export default function VistaClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroOrigen, setFiltroOrigen] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('')
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('')

  const loadClientes = useCallback(async () => {
    try {
      setError(null)
      const params = {}
      if (busqueda.trim()) params.busqueda = busqueda.trim()
      if (filtroOrigen) params.origen = filtroOrigen
      if (filtroCiudad.trim()) params.ciudad = filtroCiudad.trim()
      if (filtroFechaDesde) params.fechaDesde = filtroFechaDesde
      if (filtroFechaHasta) params.fechaHasta = filtroFechaHasta
      const data = await clientesApi.listar(params)
      setClientes((data || []).map(formatClienteFromApi))
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de clientes')
      setClientes([])
    } finally {
      setLoading(false)
    }
  }, [busqueda, filtroOrigen, filtroCiudad, filtroFechaDesde, filtroFechaHasta])

  useEffect(() => {
    setLoading(true)
    loadClientes()
  }, [loadClientes])

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (c) => setFormAbierto(c)
  const handleVer = (c) => setClienteDetalle(c)
  const cerrarForm = () => setFormAbierto(null)
  const cerrarDetalle = () => setClienteDetalle(null)

  const handleGuardarCliente = async (payload) => {
    const body = {
      nombreEmpresa: (payload.nombreEmpresa || '').trim(),
      cedulaNit: (payload.cedulaNit ?? '').trim(),
      email: (payload.email || '').trim(),
      whatsapp: (payload.whatsapp ?? '').trim(),
      direccion: (payload.direccion ?? '').trim(),
      ciudadBarrio: (payload.ciudadBarrio ?? '').trim(),
    }
    try {
      if (payload.id) {
        await clientesApi.actualizar(payload.id, body)
      } else {
        await clientesApi.crear({ ...body, origen: 'plataforma' })
      }
      await loadClientes()
      if (clienteDetalle?.id === payload.id) setClienteDetalle(null)
      cerrarForm()
    } catch (err) {
      alert(err.message || 'No se pudo guardar el cliente')
    }
  }

  const handleExportExcel = () => {
    const rows = clientesToRows(clientes)
    exportToExcel(CLIENTES_HEADERS, rows, 'clientes')
  }

  const handleImportExcel = async (file) => {
    try {
      const rows = await readExcelFile(file)
      const validacion = validarCabecerasClientes(rows)
      if (!validacion.valido) {
        alert(
          'No se puede importar: el archivo no cumple con todas las columnas obligatorias. Faltan: ' +
            validacion.faltantes.join(', ') +
            '. Revisa que la primera fila tenga esas cabeceras.'
        )
        return
      }
      const validacionFilas = validarFilasClientes(rows)
      if (!validacionFilas.valido) {
        const msg = validacionFilas.filasConError
          .map((e) => `Fila ${e.numeroFila}: faltan ${e.camposFaltantes.join(', ')}`)
          .join('\n')
        alert('No se puede importar: hay filas con datos incompletos. Todos los campos son obligatorios.\n\n' + msg)
        return
      }
      const importados = rowsToClientes(rows)
      if (importados.length === 0) {
        alert('No hay filas de datos para importar. Revisa que haya datos debajo de la cabecera en el Excel.')
        return
      }
      let importadosOk = 0
      let duplicados = 0
      for (const c of importados) {
        const body = {
          nombreEmpresa: (c.nombreEmpresa || '').trim(),
          cedulaNit: (c.cedulaNit ?? '').trim(),
          email: (c.email || '').trim(),
          whatsapp: (c.whatsapp ?? '').trim(),
          direccion: (c.direccion ?? '').trim(),
          ciudadBarrio: (c.ciudadBarrio ?? '').trim(),
          origen: 'plataforma',
        }
        try {
          await clientesApi.crear(body)
          importadosOk += 1
        } catch (err) {
          if (err.message && err.message.includes('Ya existe un cliente con esta cédula/NIT')) {
            duplicados += 1
          }
        }
      }
      await loadClientes()
      const msg =
        duplicados > 0
          ? `Se importaron ${importadosOk} de ${importados.length} clientes. ${duplicados} ya existían (cédula/NIT duplicada).`
          : `Se importaron ${importadosOk} de ${importados.length} clientes.`
      alert(msg)
    } catch (err) {
      console.error('Error al importar Excel:', err)
      alert('No se pudo leer el archivo. Comprueba que sea un Excel (.xlsx) válido.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Cargando clientes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <button
            type="button"
            onClick={loadClientes}
            className="ml-2 underline"
          >
            Reintentar
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, cédula, email, WhatsApp, ciudad..."
          className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        />
        <select
          value={filtroOrigen}
          onChange={(e) => setFiltroOrigen(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        >
          {ORIGEN_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
          placeholder="Ciudad"
          className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        />
        <input
          type="date"
          value={filtroFechaDesde}
          onChange={(e) => setFiltroFechaDesde(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
          title="Desde"
        />
        <input
          type="date"
          value={filtroFechaHasta}
          onChange={(e) => setFiltroFechaHasta(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
          title="Hasta"
        />
      </div>
      <ClientesList
        clientes={clientes}
        onCrear={handleCrear}
        onVer={handleVer}
        onEditar={handleEditar}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
      />

      {formAbierto && (
        <ClienteForm
          cliente={formAbierto === 'crear' ? null : formAbierto}
          onGuardar={handleGuardarCliente}
          onCancelar={cerrarForm}
        />
      )}

      {clienteDetalle && (
        <ClienteDetalle cliente={clienteDetalle} onCerrar={cerrarDetalle} />
      )}
    </div>
  )
}
