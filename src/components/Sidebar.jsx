import { useState } from 'react'

const OPCIONES = [
  'Clientes',
  'Productos',
  'Campañas',
  'Audiovisual',
  'Métricas Ads',
  'Ventas'
]

function Sidebar() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <aside className="w-56 min-h-full bg-white border-r border-gray-200 shadow-sm">
      <nav className="p-4 space-y-1">
        {OPCIONES.map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => setSeleccionado(opcion)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              seleccionado === opcion
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {opcion}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
