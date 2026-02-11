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
} from '../utils/excel'

function formatClienteFromApi(c) {
  return {
    ...c,
    miracleCoins: c.miracleCoins ?? 0,
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
      nombreEmpresa: payload.nombreEmpresa,
      cedulaNit: payload.cedulaNit ?? '',
      email: payload.email,
      whatsapp: payload.whatsapp ?? '',
      direccion: payload.direccion ?? '',
      ciudadBarrio: payload.ciudadBarrio ?? '',
      estado: payload.estado ?? 'activo',
      miracleCoins: Number(String(payload.miracleCoins).replace(/\D/g, '')) || 0,
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
      const importados = rowsToClientes(rows)
      for (const c of importados) {
        const body = {
          nombreEmpresa: c.nombreEmpresa || 'Sin nombre',
          cedulaNit: c.cedulaNit ?? '',
          email: c.email || '',
          whatsapp: c.whatsapp ?? '',
          direccion: c.direccion ?? '',
          ciudadBarrio: c.ciudadBarrio ?? '',
          estado: c.estado === 'pausado' || c.estado === 'inactivo' ? c.estado : 'activo',
          miracleCoins: Number(String(c.miracleCoins || '0').replace(/\D/g, '')) || 0,
        }
        try {
          await clientesApi.crear(body)
        } catch {
          // ignorar duplicados o errores por fila
        }
      }
      await loadClientes()
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
