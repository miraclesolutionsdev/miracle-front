import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VistaClientes from './components/VistaClientes'
import VistaCampañas from './components/VistaCampañas'
import './App.css'

function App() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="flex flex-col gap-6 p-6">
          {seleccionado === 'Clientes' && <VistaClientes />}
          {seleccionado === 'Campañas' && <VistaCampañas />}
          {seleccionado !== 'Clientes' && seleccionado !== 'Campañas' && (
            <p className="text-muted-foreground text-sm sm:text-base">
              Selecciona una opción del panel para continuar.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
