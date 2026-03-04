import { useState, useEffect, useMemo } from 'react'
import CampañasList from './CampañasList'
import CampañaForm from './CampañaForm'
import CampañaDetalle from './CampañaDetalle'
import CampaignChart from './CampaignChart'
import { useProductos } from '../context/ProductosContext.jsx'
import { useAuth } from '../context/AuthContext'
import { campanasApi, audiovisualApi } from '../utils/api'

// Fallback si no hay piezas desde API
const PIEZAS_FALLBACK = [
  { id: 'AV-001', nombre: 'Pixel Web - Sitio principal' },
  { id: 'AV-002', nombre: 'Pixel Web - Landing campañas' },
  { id: 'AV-003', nombre: 'Catálogo de productos' },
  { id: 'AV-004', nombre: 'Video 15s TikTok' },
  { id: 'AV-005', nombre: 'Banner 1080x1080 Meta' },
]

export default function VistaCampañas() {
  const { user } = useAuth()
  const { productos } = useProductos()
  const [campañas, setCampañas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [piezas, setPiezas] = useState(PIEZAS_FALLBACK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(null)
  const [campañaDetalle, setCampañaDetalle] = useState(null)

  const cargarCampañas = () => {
    setError(null)
    campanasApi
      .listar()
      .then((data) => setCampañas(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.tenantId) {
      setCampañas([])
      setLoading(false)
      return
    }
    setLoading(true)
    cargarCampañas()
  }, [user?.tenantId])

  useEffect(() => {
    if (!user?.tenantId) return
    audiovisualApi
      .listar()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setPiezas(
          list.length
            ? list.map((p) => ({ id: p.id, nombre: p.nombre || p.titulo || p.id }))
            : PIEZAS_FALLBACK
        )
      })
      .catch(() => setPiezas(PIEZAS_FALLBACK))
  }, [user?.tenantId])

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (c) => setFormAbierto(c)
  const handleVer = (c) => setCampañaDetalle(c)
  const cerrarForm = () => setFormAbierto(null)
  const cerrarDetalle = () => setCampañaDetalle(null)

  const handleGuardarCampaña = (payload) => {
    const body = {
      producto: payload.producto ?? '',
      piezaCreativo: payload.piezaCreativo ?? '',
      plataforma: payload.plataforma ?? '',
      miracleCoins: payload.miracleCoins ?? '',
      estado: payload.estado ?? 'borrador',
    }
    if (payload.id) {
      campanasApi
        .actualizar(payload.id, body)
        .then((actualizada) => {
          setCampañas((prev) => prev.map((c) => (c.id === actualizada.id ? actualizada : c)))
          cerrarForm()
        })
        .catch((err) => setError(err.message))
    } else {
      campanasApi
        .crear(body)
        .then((nueva) => {
          setCampañas((prev) => [nueva, ...prev])
          cerrarForm()
        })
        .catch((err) => setError(err.message))
    }
  }

  const actualizarEstadoLocal = (id, estado) => {
    setCampañas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)))
    if (campañaDetalle?.id === id) setCampañaDetalle((p) => ({ ...p, estado }))
  }

  const handleLanzar = (c) => {
    campanasApi
      .actualizarEstado(c.id, 'activa')
      .then(() => actualizarEstadoLocal(c.id, 'activa'))
      .catch((err) => setError(err.message))
  }

  const handleActivarPausar = (c) => {
    const nuevo = c.estado === 'activa' ? 'pausada' : 'activa'
    campanasApi
      .actualizarEstado(c.id, nuevo)
      .then(() => actualizarEstadoLocal(c.id, nuevo))
      .catch((err) => setError(err.message))
  }

  const handleFinalizar = (c) => {
    campanasApi
      .actualizarEstado(c.id, 'finalizada')
      .then(() => actualizarEstadoLocal(c.id, 'finalizada'))
      .catch((err) => setError(err.message))
  }

  const campañasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return campañas
    return campañas.filter(
      (c) =>
        (c.id ?? '').toLowerCase().includes(q) ||
        (c.producto ?? '').toLowerCase().includes(q) ||
        (c.piezaCreativo ?? '').toLowerCase().includes(q) ||
        (c.plataforma ?? '').toLowerCase().includes(q) ||
        (c.miracleCoins ?? '').toLowerCase().includes(q) ||
        (c.estado ?? '').toLowerCase().includes(q)
    )
  }, [campañas, busqueda])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Cargando campañas…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por ID, producto, pieza, plataforma, estado..."
          className="w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        />
      </div>
      <CampañasList
        campañas={campañasFiltradas}
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
          piezas={piezas}
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
