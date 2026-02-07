import { useState } from 'react'
import { API_URL } from '../config/api'

function CrearUsuario({ onUsuarioCreado }) {
  const [nombre, setNombre] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!nombre || !contraseña || !telefono) return

    setCargando(true)
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, contraseña, tel: telefono })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al crear")
      onUsuarioCreado(data)
      setNombre('')
      setContraseña('')
      setTelefono('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Usuario</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ingrese su nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ingrese su contraseña"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Ingrese su teléfono"
        />
      </div>
      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {cargando ? "Creando..." : "Crear Usuario"}
      </button>
    </form>
  )
}

export default CrearUsuario
