import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import VistaDashboard from './VistaDashboard'
import VistaClientes from './VistaClientes'
import VistaProductos from './VistaProductos'
import VistaTienda from './VistaTienda'
import VistaCampañas from './VistaCampañas'
import VistaAudiovisual from './VistaAudiovisual'
import MetricsAds from './MetricsAds'
import VistaVentas from './VistaVentas'
import VistaAdministradores from './VistaAdministradores'
import VistaConfiguracion from './VistaConfiguracion'

const PATH_TO_LABEL = {
  '/plataforma': 'Dashboard',
  '/plataforma/dashboard': 'Dashboard',
  '/plataforma/clientes': 'Clientes',
  '/plataforma/productos': 'Productos',
  '/plataforma/configurar-tienda': 'Tienda',
  '/plataforma/campanas': 'Campañas',
  '/plataforma/audiovisual': 'Audiovisual',
  '/plataforma/metricas-ads': 'Métricas Ads',
  '/plataforma/ventas': 'Ventas',
  '/plataforma/administradores': 'Administradores',
  '/plataforma/configuracion': 'Configuración',
}

const PAGE_DESCRIPTIONS = {
  'Dashboard': 'Resumen general de tu negocio y campañas',
  'Clientes': 'Gestiona tu base de clientes',
  'Productos': 'Administra tu catálogo de productos',
  'Tienda': 'Personaliza tu tienda online',
  'Campañas': 'Crea y gestiona campañas publicitarias',
  'Audiovisual': 'Biblioteca de piezas audiovisuales',
  'Métricas Ads': 'Análisis de rendimiento de anuncios',
  'Ventas': 'Seguimiento de ventas y conversiones',
  'Administradores': 'Gestión de accesos y usuarios',
  'Configuración': 'Preferencias de tu cuenta',
}

function DashboardLayout() {
  const { pathname } = useLocation()
  const seleccionado = useMemo(() => {
    const path = pathname.replace(/\/$/, '') || '/plataforma'
    return PATH_TO_LABEL[path] ?? 'Dashboard'
  }, [pathname])

  const renderContenido = () => {
    if (seleccionado === 'Dashboard') return <VistaDashboard />
    if (seleccionado === 'Clientes') return <VistaClientes />
    if (seleccionado === 'Productos') return <VistaProductos />
    if (seleccionado === 'Tienda') return <VistaTienda />
    if (seleccionado === 'Audiovisual') return <VistaAudiovisual />
    if (seleccionado === 'Métricas Ads') return <MetricsAds />
    if (seleccionado === 'Ventas') return <VistaVentas />
    if (seleccionado === 'Campañas') return <VistaCampañas />
    if (seleccionado === 'Administradores') return <VistaAdministradores />
    if (seleccionado === 'Configuración') return <VistaConfiguracion />
    return (
      <p className="text-sm text-muted-foreground">
        Selecciona una opción del panel para continuar.
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar seleccionado={seleccionado} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">
          {/* Page header */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-0.5 rounded-full bg-gradient-to-b from-primary to-primary/30" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">{seleccionado}</h1>
            </div>
            {PAGE_DESCRIPTIONS[seleccionado] && (
              <p className="mt-1 pl-3.5 text-[13px] text-muted-foreground">
                {PAGE_DESCRIPTIONS[seleccionado]}
              </p>
            )}
            <div className="mt-4 h-px bg-gradient-to-r from-border/80 via-border/30 to-transparent" />
          </div>
          {renderContenido()}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
