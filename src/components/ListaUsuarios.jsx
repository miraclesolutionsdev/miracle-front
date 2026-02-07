import TablaUsuarios from './TablaUsuarios'

function ListaUsuarios({ usuarios, onActualizar, cargando }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lista de Usuarios</h2>
        <button
          onClick={onActualizar}
          disabled={cargando}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {cargando ? "Cargando..." : "Actualizar"}
        </button>
      </div>
      <TablaUsuarios usuarios={usuarios} />
    </div>
  )
}

export default ListaUsuarios
