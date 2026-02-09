const OPCIONES = [
  'Clientes',
  'Productos',
  'Campañas',
  'Audiovisual',
  'Métricas Ads',
  'Ventas'
]

function Sidebar({ seleccionado, onSeleccionar }) {
  return (
    <aside className="flex-shrink-0 w-52 sm:w-56 lg:w-64 min-h-full bg-white border-r border-gray-200 shadow-sm">
      <nav className="p-3 sm:p-4 space-y-0.5 sm:space-y-1">
        {OPCIONES.map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => onSeleccionar(opcion)}
            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
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
