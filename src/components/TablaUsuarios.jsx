function TablaUsuarios({ usuarios }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Contraseña</th>
            <th className="px-4 py-3 text-left">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t border-gray-200">
              <td className="px-4 py-3">{u.nombre}</td>
              <td className="px-4 py-3">{u.contraseña}</td>
              <td className="px-4 py-3">{u.tel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaUsuarios
