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
      ? new Date(c.fechaCreacion).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '—',
  }
}

export default function VistaClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)

  const loadClientes = useCallback(async () => {
    try {
      setError(null)
      const data = await clientesApi.listar()
      setClientes((data || []).map(formatClienteFromApi))
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de clientes')
      setClientes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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
        await clientesApi.crear(body)
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
      for (const c of importados) {
        const body = {
          nombreEmpresa: (c.nombreEmpresa || '').trim(),
          cedulaNit: (c.cedulaNit ?? '').trim(),
          email: (c.email || '').trim(),
          whatsapp: (c.whatsapp ?? '').trim(),
          direccion: (c.direccion ?? '').trim(),
          ciudadBarrio: (c.ciudadBarrio ?? '').trim(),
        }
        try {
          await clientesApi.crear(body)
          importadosOk += 1
        } catch {
          // ignorar duplicados o errores por fila
        }
      }
      await loadClientes()
      alert(`Se importaron ${importadosOk} de ${importados.length} clientes.`)
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
