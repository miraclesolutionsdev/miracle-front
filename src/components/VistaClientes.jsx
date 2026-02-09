import { useState } from 'react'
import ClientesList from './ClientesList'
import ClienteForm from './ClienteForm'
import ClienteDetalle from './ClienteDetalle'

const CLIENTES_INICIALES = [
  {
    id: 'CLI-001',
    nombreEmpresa: 'Acme Corp',
    email: 'contacto@acme.com',
    whatsapp: '+57 300 123 4567',
    estado: 'activo',
    plan: 'Pro',
    miracleCoins: '1,250',
    fechaCreacion: '15/01/2025',
  },
  {
    id: 'CLI-002',
    nombreEmpresa: 'Startup XYZ',
    email: 'hola@startupxyz.com',
    whatsapp: '+57 310 987 6543',
    estado: 'pausado',
    plan: 'Basico',
    miracleCoins: '500',
    fechaCreacion: '20/01/2025',
  },
  {
    id: 'CLI-003',
    nombreEmpresa: 'Tienda Digital',
    email: 'info@tiendadigital.com',
    whatsapp: '+57 320 555 1234',
    estado: 'activo',
    plan: 'Enterprise',
    miracleCoins: '3,000',
    fechaCreacion: '01/02/2025',
  },
]

function generarId(clientes) {
  const nums = clientes
    .map((c) => parseInt(c.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `CLI-${String(next).padStart(3, '0')}`
}

function fechaHoy() {
  const d = new Date()
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

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

  return (
    <div className="space-y-6">
      <ClientesList
        clientes={clientes}
        onCrear={handleCrear}
        onVer={handleVer}
        onEditar={handleEditar}
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
