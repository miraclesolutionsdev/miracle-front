import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
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
import VistaClipsWhatsApp from './VistaClipsWhatsApp'

const PAGE_DESCRIPTIONS = {
  Dashboard: 'Resumen general de tu negocio y campañas',
  Clientes: 'Gestiona tu base de clientes',
  Productos: 'Administra tu catálogo de productos',
  Tienda: 'Personaliza tu tienda online',
  Campañas: 'Crea y gestiona campañas publicitarias',
  Audiovisual: 'Biblioteca de piezas audiovisuales',
  'Métricas Ads': 'Análisis de rendimiento de anuncios',
  Ventas: 'Seguimiento de ventas y conversiones',
  'Leads WhatsApp': 'Contenido audiovisual para campañas de WhatsApp',
  Administradores: 'Gestión de accesos y usuarios',
  Configuración: 'Preferencias de tu cuenta',
}

function DashboardLayout() {
  const { slug } = useParams()
  const { pathname } = useLocation()

  const pathToLabel = useMemo(() => ({
    [`/${slug}/plataforma`]: 'Dashboard',
    [`/${slug}/plataforma/dashboard`]: 'Dashboard',
    [`/${slug}/plataforma/clientes`]: 'Clientes',
    [`/${slug}/plataforma/productos`]: 'Productos',
    [`/${slug}/plataforma/configurar-tienda`]: 'Tienda',
    [`/${slug}/plataforma/campanas`]: 'Campañas',
    [`/${slug}/plataforma/audiovisual`]: 'Audiovisual',
    [`/${slug}/plataforma/metricas-ads`]: 'Métricas Ads',
    [`/${slug}/plataforma/ventas`]: 'Ventas',
    [`/${slug}/plataforma/leads-whatsapp`]: 'Leads WhatsApp',
    [`/${slug}/plataforma/administradores`]: 'Administradores',
    [`/${slug}/plataforma/configuracion`]: 'Configuración',
  }), [slug])

  const seleccionado = pathToLabel[pathname.replace(/\/$/, '')] ?? 'Dashboard'

  const renderContenido = () => {
    switch (seleccionado) {
      case 'Dashboard':       return <VistaDashboard />
      case 'Clientes':        return <VistaClientes />
      case 'Productos':       return <VistaProductos />
      case 'Tienda':          return <VistaTienda />
      case 'Campañas':        return <VistaCampañas />
      case 'Audiovisual':     return <VistaAudiovisual />
      case 'Métricas Ads':    return <MetricsAds />
      case 'Ventas':          return <VistaVentas />
      case 'Leads WhatsApp':  return <VistaClipsWhatsApp />
      case 'Administradores': return <VistaAdministradores />
      case 'Configuración':   return <VistaConfiguracion />
      default:                return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header slug={slug} />
      <Sidebar seleccionado={seleccionado} slug={slug} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">
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
