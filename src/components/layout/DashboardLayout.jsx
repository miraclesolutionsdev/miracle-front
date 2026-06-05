import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import VistaDashboard from '../dashboard/VistaDashboard'
import VistaClientes from '../dashboard/VistaClientes'
import VistaProductos from '../dashboard/VistaProductos'
import VistaTienda from '../dashboard/VistaTienda'
import VistaCampañas from '../dashboard/VistaCampañas'
import VistaAudiovisual from '../dashboard/VistaAudiovisual'
import MetricsAds from '../dashboard/analytics/MetricsAds'
import VistaVentas from '../dashboard/analytics/VistaVentas'
import VistaGanancias from '../dashboard/analytics/VistaGanancias'
import VistaAdministradores from '../dashboard/VistaAdministradores'
import VistaConfiguracion from '../dashboard/VistaConfiguracion'
import VistaClipsWhatsApp from '../dashboard/VistaClipsWhatsApp'
import VistaBlog from '../dashboard/VistaBlog'

const PAGE_DESCRIPTIONS = {
  Dashboard: 'Resumen general de tu negocio y campañas',
  Clientes: 'Gestiona tu base de clientes',
  Productos: 'Administra tu catálogo de productos',
  Tienda: 'Personaliza tu tienda online',
  Campañas: 'Crea y gestiona campañas publicitarias',
  Audiovisual: 'Biblioteca de piezas audiovisuales',
  'Métricas Ads': 'Análisis de rendimiento de anuncios',
  Ventas: 'Seguimiento de ventas y conversiones',
  Ganancias: 'Resumen de ingresos, utilidad y ganancias netas',
  'Leads WhatsApp': 'Contenido audiovisual para campañas de WhatsApp',
  Administradores: 'Gestión de accesos y usuarios',
  Configuración: 'Preferencias de tu cuenta',
  Blog: 'Crea y gestiona artículos para tu tienda',
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
    [`/${slug}/plataforma/ganancias`]: 'Ganancias',
    [`/${slug}/plataforma/leads-whatsapp`]: 'Leads WhatsApp',
    [`/${slug}/plataforma/administradores`]: 'Administradores',
    [`/${slug}/plataforma/configuracion`]: 'Configuración',
    [`/${slug}/plataforma/blog`]: 'Blog',
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
      case 'Ganancias':       return <VistaGanancias />
      case 'Leads WhatsApp':  return <VistaClipsWhatsApp />
      case 'Administradores': return <VistaAdministradores />
      case 'Configuración':   return <VistaConfiguracion />
      case 'Blog':            return <VistaBlog />
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
