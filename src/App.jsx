import { useState, useEffect, useCallback } from 'react'
import CrearUsuario from './components/CrearUsuario'
import ListaUsuarios from './components/ListaUsuarios'
import { API_URL } from './config/api'
import './App.css'

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(false)

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch(`${API_URL}/usuarios`)
      const data = await res.json()
      setUsuarios(data)
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
      setUsuarios([])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const handleUsuarioCreado = () => {
    cargarUsuarios()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <CrearUsuario onUsuarioCreado={handleUsuarioCreado} />
        <ListaUsuarios
          usuarios={usuarios}
          onActualizar={cargarUsuarios}
          cargando={cargando}
        />
      </div>
    </div>
  )
}

export default App
