import { useState } from 'react'
import ProductosList from './ProductosList'
import ProductoForm from './ProductoForm'
import { useProductos } from '../context/ProductosContext.jsx'
import {
  exportToExcel,
  readExcelFile,
  PRODUCTOS_HEADERS,
  productosToRows,
  rowsToProductos,
} from '../utils/excel.js'

export default function VistaProductos() {
  const { productos, guardarProducto, toggleEstadoProducto, importarProductos } = useProductos()
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

  const handleExportExcel = () => {
    const rows = productosToRows(productos)
    exportToExcel(PRODUCTOS_HEADERS, rows, 'productos')
  }

  const handleImportExcel = async (file) => {
    try {
      const rows = await readExcelFile(file)
      const importados = rowsToProductos(rows)
      if (importados.length) importarProductos(importados)
    } catch (err) {
      console.error('Error al importar Excel:', err)
      alert('No se pudo leer el archivo. Comprueba que sea un Excel (.xlsx) válido.')
    }
  }

  return (
    <div className="space-y-6">
      <ProductosList
        productos={productos}
        onCrear={handleCrear}
        onEditar={handleEditar}
        onToggleEstado={handleToggleEstado}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
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

