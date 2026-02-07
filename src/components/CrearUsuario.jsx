import { useState } from 'react'

function CrearUsuario({ onUsuarioCreado }) {
  const [nombre, setNombre] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [telefono, setTelefono] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nombre && contraseña && telefono) {
      onUsuarioCreado({ nombre, contraseña, telefono })
      setNombre('')
      setContraseña('')
      setTelefono('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Usuario</h2>
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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Crear Usuario
      </button>
    </form>
  )
}

export default CrearUsuario
