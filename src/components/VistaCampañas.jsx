import { useState } from 'react'
import CampañasList from './CampañasList'
import CampañaForm from './CampañaForm'
import CampañaDetalle from './CampañaDetalle'
import CampaignChart from './CampaignChart'
import { useProductos } from '../context/ProductosContext.jsx'

const PIEZAS_OPCIONES = [
  { id: 'AV-001', nombre: 'Pixel Web - Sitio principal' },
  { id: 'AV-002', nombre: 'Pixel Web - Landing campañas' },
  { id: 'AV-003', nombre: 'Catálogo de productos' },
  { id: 'AV-004', nombre: 'Video 15s TikTok' },
  { id: 'AV-005', nombre: 'Banner 1080x1080 Meta' },
]

const CAMPAÑAS_INICIALES = [
  {
    id: 'CAMP-001',
    producto: 'Pack Social Media',
    piezaCreativo: 'Pixel Web - Sitio principal',
    plataforma: 'Facebook Ads',
    miracleCoins: '500',
    estado: 'activa',
  },
  {
    id: 'CAMP-002',
    producto: 'Video Corporativo',
    piezaCreativo: 'Video 15s TikTok',
    plataforma: 'Google Ads',
    miracleCoins: '200',
    estado: 'borrador',
  },
  {
    id: 'CAMP-003',
    producto: 'Campaña Google Ads',
    piezaCreativo: 'Banner 1080x1080 Meta',
    plataforma: 'Instagram Ads',
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
  const { productos } = useProductos()
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
      setCampañas((prev) => [...prev, { ...payload, id: generarId(prev) }])
    }
    cerrarForm()
  }

  const handleLanzar = (c) => {
    setCampañas((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, estado: 'activa' } : x))
    )
    if (campañaDetalle?.id === c.id) {
      setCampañaDetalle((prev) => ({ ...prev, estado: 'activa' }))
    }
    // Aquí luego se puede conectar con la lógica real de lanzamiento (API, etc.)
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
        onLanzar={handleLanzar}
        onActivarPausar={handleActivarPausar}
        onFinalizar={handleFinalizar}
      />

      <CampaignChart />

      {formAbierto && (
        <CampañaForm
          campaña={formAbierto === 'crear' ? null : formAbierto}
          productos={productos}
          piezas={PIEZAS_OPCIONES}
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
