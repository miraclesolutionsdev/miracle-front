import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import VistaDashboard from './VistaDashboard'
import VistaClientes from './VistaClientes'
import VistaProductos from './VistaProductos'
import VistaTienda from './VistaTienda'
import VistaCampañas from './VistaCampañas'

function DashboardLayout() {
  const [seleccionado, setSeleccionado] = useState('Dashboard')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">
          {seleccionado === 'Dashboard' && <VistaDashboard />}
          {seleccionado === 'Clientes' && <VistaClientes />}
          {seleccionado === 'Productos' && <VistaProductos />}
          {seleccionado === 'Tienda' && <VistaTienda />}
          {seleccionado === 'Campañas' && <VistaCampañas />}
          {seleccionado !== 'Dashboard' &&
            seleccionado !== 'Clientes' &&
            seleccionado !== 'Productos' &&
            seleccionado !== 'Tienda' &&
            seleccionado !== 'Campañas' && (
              <p className="text-muted-foreground text-sm sm:text-base">
                Selecciona una opción del panel para continuar.
              </p>
            )}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

