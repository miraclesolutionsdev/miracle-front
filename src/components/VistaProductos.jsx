import { useState } from 'react'
import ProductosList from './ProductosList'
import ProductoForm from './ProductoForm'
import { useProductos } from '../context/ProductosContext.jsx'

export default function VistaProductos() {
  const { productos, guardarProducto, toggleEstadoProducto } = useProductos()
  const [formAbierto, setFormAbierto] = useState(null)

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (producto) => setFormAbierto(producto)
  const cerrarForm = () => setFormAbierto(null)

  const handleGuardarProducto = (payload) => {
    guardarProducto(payload)
    cerrarForm()
  }

  const handleToggleEstado = (producto) => {
    toggleEstadoProducto(producto)
  }

  return (
    <div className="space-y-6">
      <ProductosList
        productos={productos}
        onCrear={handleCrear}
        onEditar={handleEditar}
        onToggleEstado={handleToggleEstado}
      />

      {formAbierto && (
        <ProductoForm
          producto={formAbierto === 'crear' ? null : formAbierto}
          onGuardar={handleGuardarProducto}
          onCancelar={cerrarForm}
        />
      )}
    </div>
  )
}

