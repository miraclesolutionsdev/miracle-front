import { useState } from 'react'
import CampañasList from './CampañasList'
import CampañaForm from './CampañaForm'
import CampañaDetalle from './CampañaDetalle'
import CampaignChart from './CampaignChart'

const CLIENTES_OPCIONES = [
  { id: 'CLI-001', nombreEmpresa: 'Acme Corp' },
  { id: 'CLI-002', nombreEmpresa: 'Startup XYZ' },
  { id: 'CLI-003', nombreEmpresa: 'Tienda Digital' },
]

const CAMPAÑAS_INICIALES = [
  {
    id: 'CAMP-001',
    cliente: 'Acme Corp',
    producto: 'Pack Social Media',
    plataforma: 'Facebook Ads',
    presupuesto: '$1,200',
    miracleCoins: '500',
    estado: 'activa',
  },
  {
    id: 'CAMP-002',
    cliente: 'Startup XYZ',
    producto: 'Video Corporativo',
    plataforma: 'Google Ads',
    presupuesto: '$800',
    miracleCoins: '200',
    estado: 'borrador',
  },
  {
    id: 'CAMP-003',
    cliente: 'Tienda Digital',
    producto: 'Campana Google Ads',
    plataforma: 'Instagram Ads',
    presupuesto: '$2,000',
    miracleCoins: '800',
    estado: 'pausada',
  },
]

function generarId(campañas) {
  const nums = campañas
    .map((c) => parseInt(c.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `CAMP-${String(next).padStart(3, '0')}`
}

export default function VistaCampañas() {
  const [campañas, setCampañas] = useState(CAMPAÑAS_INICIALES)
  const [formAbierto, setFormAbierto] = useState(null)
  const [campañaDetalle, setCampañaDetalle] = useState(null)

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (c) => setFormAbierto(c)
  const handleVer = (c) => setCampañaDetalle(c)
  const cerrarForm = () => setFormAbierto(null)
  const cerrarDetalle = () => setCampañaDetalle(null)

  const handleGuardarCampaña = (payload) => {
    if (payload.id) {
      setCampañas((prev) =>
        prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c))
      )
    } else {
      setCampañas((prev) => [
        ...prev,
        { ...payload, id: generarId(prev) },
      ])
    }
    cerrarForm()
  }

  const handleActivarPausar = (c) => {
    setCampañas((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? { ...x, estado: x.estado === 'activa' ? 'pausada' : 'activa' }
          : x
      )
    )
    if (campañaDetalle?.id === c.id) {
      setCampañaDetalle((prev) => ({
        ...prev,
        estado: prev.estado === 'activa' ? 'pausada' : 'activa',
      }))
    }
  }

  const handleFinalizar = (c) => {
    setCampañas((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, estado: 'finalizada' } : x))
    )
    if (campañaDetalle?.id === c.id) {
      setCampañaDetalle((prev) => ({ ...prev, estado: 'finalizada' }))
    }
  }

  return (
    <div className="space-y-6">
      <CampañasList
        campañas={campañas}
        onCrear={handleCrear}
        onVer={handleVer}
        onEditar={handleEditar}
        onActivarPausar={handleActivarPausar}
        onFinalizar={handleFinalizar}
      />

      <CampaignChart />

      {formAbierto && (
        <CampañaForm
          campaña={formAbierto === 'crear' ? null : formAbierto}
          clientes={CLIENTES_OPCIONES}
          productos={['Pack Social Media', 'Video Corporativo', 'Campana Google Ads', 'Diseno de Marca']}
          onGuardar={handleGuardarCampaña}
          onCancelar={cerrarForm}
        />
      )}

      {campañaDetalle && (
        <CampañaDetalle
          campaña={campañaDetalle}
          onCerrar={cerrarDetalle}
          onActivarPausar={handleActivarPausar}
          onFinalizar={handleFinalizar}
        />
      )}
    </div>
  )
}
