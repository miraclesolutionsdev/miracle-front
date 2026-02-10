import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import VistaDashboard from './VistaDashboard'
import VistaClientes from './VistaClientes'
import VistaProductos from './VistaProductos'
import VistaTienda from './VistaTienda'
import VistaConfiguraRedes from './VistaConfiguraRedes'
import VistaInformacionNegocio from './VistaInformacionNegocio'
import VistaCampañas from './VistaCampañas'

function DashboardLayout() {
  const [seleccionado, setSeleccionado] = useState('Dashboard')

  const renderContenido = () => {
    if (seleccionado === 'Dashboard') return <VistaDashboard />
    if (seleccionado === 'Clientes') return <VistaClientes />
    if (seleccionado === 'Productos') return <VistaProductos />
    if (seleccionado === 'Tienda') return <VistaTienda />
    if (seleccionado === 'Configura tus redes') return <VistaConfiguraRedes />
    if (seleccionado === 'Información del negocio') return <VistaInformacionNegocio />
    if (seleccionado === 'Campañas') return <VistaCampañas />
    return (
      <p className="text-sm text-muted-foreground sm:text-base">
        Selecciona una opción del panel para continuar.
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">{renderContenido()}</div>
      </main>
    </div>
  )
}

export default DashboardLayout

