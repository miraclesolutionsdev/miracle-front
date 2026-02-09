import Header from './components/Header'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <p className="text-gray-500 text-sm">
            Selecciona una opción del panel para continuar.
          </p>
        </main>
      </div>
    </div>
  )
}

export default App
