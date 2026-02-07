import { useState } from 'react'
import CrearUsuario from './components/CrearUsuario'
import ListaUsuarios from './components/ListaUsuarios'
import './App.css'

function App() {
  const [usuarios, setUsuarios] = useState([])

  const handleUsuarioCreado = (usuario) => {
    setUsuarios((prev) => [...prev, usuario])
  }

  const handleActualizar = () => {
    setUsuarios((prev) => [...prev])
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <CrearUsuario onUsuarioCreado={handleUsuarioCreado} />
        <ListaUsuarios usuarios={usuarios} onActualizar={handleActualizar} />
      </div>
    </div>
  )
}

export default App
