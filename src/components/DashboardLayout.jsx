import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import VistaDashboard from './VistaDashboard'
import VistaClientes from './VistaClientes'
import VistaProductos from './VistaProductos'
import VistaTienda from './VistaTienda'
import VistaConfiguraRedes from './VistaConfiguraRedes'
import VistaInformacionNegocio from './VistaInformacionNegocio'
import VistaCampañas from './VistaCampañas'
import VistaAudiovisual from './VistaAudiovisual'
import MetricsAds from './MetricsAds'
import VistaVentas from './VistaVentas'

const PATH_TO_LABEL = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/clientes': 'Clientes',
  '/productos': 'Productos',
  '/configura-redes': 'Configura tus redes',
  '/informacion-negocio': 'Información del negocio',
  '/campanas': 'Campañas',
  '/audiovisual': 'Audiovisual',
  '/metricas-ads': 'Métricas Ads',
  '/ventas': 'Ventas',
}

function DashboardLayout() {
  const { pathname } = useLocation()
  const seleccionado = useMemo(() => {
    const path = pathname.replace(/\/$/, '') || '/'
    return PATH_TO_LABEL[path] ?? 'Dashboard'
  }, [pathname])

  const renderContenido = () => {
    if (seleccionado === 'Dashboard') return <VistaDashboard />
    if (seleccionado === 'Clientes') return <VistaClientes />
    if (seleccionado === 'Productos') return <VistaProductos />
    if (seleccionado === 'Tienda') return <VistaTienda />
    if (seleccionado === 'Configura tus redes') return <VistaConfiguraRedes />
    if (seleccionado === 'Información del negocio') return <VistaInformacionNegocio />
    if (seleccionado === 'Audiovisual') return <VistaAudiovisual />
    if (seleccionado === 'Métricas Ads') return <MetricsAds />
    if (seleccionado === 'Ventas') return <VistaVentas />
    if (seleccionado === 'Campañas') return <VistaCampañas />
    return (
      <p className="text-sm text-muted-foreground">
        Selecciona una opcion del panel para continuar.
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar seleccionado={seleccionado} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{seleccionado}</h1>
          </div>
          {renderContenido()}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

