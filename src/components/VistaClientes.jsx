import { useState } from 'react'
import ClientesList from './ClientesList'
import ClienteForm from './ClienteForm'
import ClienteDetalle from './ClienteDetalle'
import {
  exportToExcel,
  readExcelFile,
  CLIENTES_HEADERS,
  clientesToRows,
  rowsToClientes,
} from '../utils/excel'

const PREFIJO_PAIS = 'CO'

function generarId(clientes, prefijo = PREFIJO_PAIS) {
  const delPais = clientes.filter((c) => c.id && c.id.startsWith(prefijo + '-'))
  if (delPais.length === 0) return `${prefijo}-1001`
  const numeros = delPais
    .map((c) => parseInt(c.id.replace(/^[A-Z]+-/, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = Math.max(...numeros)
  const siguiente = max === 1999 ? 2001 : max + 1
  return `${prefijo}-${siguiente}`
}

function fechaHoy() {
  const d = new Date()
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const CLIENTES_INICIALES = [
  {
    id: 'CO-1001',
    nombreEmpresa: 'Acme Corp',
    cedulaNit: '900.123.456-1',
    email: 'contacto@acme.com',
    whatsapp: '+57 300 123 4567',
    direccion: 'Calle 50 # 10-20',
    ciudadBarrio: 'Bogotá - Chapinero',
    estado: 'activo',
    plan: 'Pro',
    miracleCoins: '1,250',
    fechaCreacion: '15/01/2025',
  },
  {
    id: 'CO-1002',
    nombreEmpresa: 'Startup XYZ',
    cedulaNit: '800.987.654-2',
    email: 'hola@startupxyz.com',
    whatsapp: '+57 310 987 6543',
    direccion: 'Carrera 15 # 80-50',
    ciudadBarrio: 'Medellín - El Poblado',
    estado: 'pausado',
    plan: 'Basico',
    miracleCoins: '500',
    fechaCreacion: '20/01/2025',
  },
  {
    id: 'CO-1003',
    nombreEmpresa: 'Tienda Digital',
    cedulaNit: '900.555.111-3',
    email: 'info@tiendadigital.com',
    whatsapp: '+57 320 555 1234',
    direccion: 'Av. 68 # 100-10',
    ciudadBarrio: 'Cali - Granada',
    estado: 'activo',
    plan: 'Enterprise',
    miracleCoins: '3,000',
    fechaCreacion: '01/02/2025',
  },
]

export default function VistaClientes() {
  const [clientes, setClientes] = useState(CLIENTES_INICIALES)
  const [formAbierto, setFormAbierto] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (c) => setFormAbierto(c)
  const handleVer = (c) => setClienteDetalle(c)
  const cerrarForm = () => setFormAbierto(null)
  const cerrarDetalle = () => setClienteDetalle(null)

  const handleGuardarCliente = (payload) => {
    if (payload.id) {
      setClientes((prev) =>
        prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
      )
      if (clienteDetalle?.id === payload.id) {
        setClienteDetalle((prev) => (prev ? { ...prev, ...payload } : null))
      }
    } else {
      setClientes((prev) => [
        ...prev,
        {
          ...payload,
          id: generarId(prev),
          fechaCreacion: fechaHoy(),
        },
      ])
    }
    cerrarForm()
  }

  const handleExportExcel = () => {
    const rows = clientesToRows(clientes)
    exportToExcel(CLIENTES_HEADERS, rows, 'clientes')
  }

  const handleImportExcel = async (file) => {
    try {
      const rows = await readExcelFile(file)
      const importados = rowsToClientes(rows)
      setClientes((prev) => {
        let lista = [...prev]
        return [
          ...prev,
          ...importados.map((c) => {
            const id = c.id && !lista.some((x) => x.id === c.id) ? c.id : generarId(lista)
            const item = {
              ...c,
              id,
              fechaCreacion: c.fechaCreacion || fechaHoy(),
            }
            lista = [...lista, item]
            return item
          }),
        ]
      })
    } catch (err) {
      console.error('Error al importar Excel:', err)
      alert('No se pudo leer el archivo. Comprueba que sea un Excel (.xlsx) válido.')
    }
  }

  return (
    <div className="space-y-6">
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
