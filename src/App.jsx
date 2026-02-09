import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VistaClientes from './components/VistaClientes'
import './App.css'

function App() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0 w-full">
        <Sidebar seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto">
          {seleccionado === 'Clientes' ? (
            <VistaClientes />
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              Selecciona una opción del panel para continuar.
            </p>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
