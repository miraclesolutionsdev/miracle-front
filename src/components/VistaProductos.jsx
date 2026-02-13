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
  validarCabecerasProductos,
  validarFilasProductos,
} from '../utils/excel.js'

export default function VistaProductos() {
  const { productos, guardarProducto, toggleEstadoProducto, importarProductos } = useProductos()
  const [formAbierto, setFormAbierto] = useState(null)

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (producto) => setFormAbierto(producto)
  const cerrarForm = () => setFormAbierto(null)

  const handleGuardarProducto = async (payload) => {
    try {
      await guardarProducto(payload)
      cerrarForm()
    } catch (err) {
      alert(err.message || 'No se pudo guardar el producto')
    }
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
      const validacionCabeceras = validarCabecerasProductos(rows)
      if (!validacionCabeceras.valido) {
        alert(
          'No se puede importar: faltan columnas obligatorias. Faltan: ' +
            validacionCabeceras.faltantes.join(', ') +
            '. Revisa que la primera fila tenga esas cabeceras (Nombre, Precio en COP, Tipo, Stock, Estado).'
        )
        return
      }
      const validacionFilas = validarFilasProductos(rows)
      if (!validacionFilas.valido) {
        const msg = validacionFilas.filasConError
          .map((e) => `Fila ${e.numeroFila}: faltan ${e.camposFaltantes.join(', ')}`)
          .join('\n')
        alert('No se puede importar: hay filas con datos incompletos. Todos los campos obligatorios deben estar llenos.\n\n' + msg)
        return
      }
      const importados = rowsToProductos(rows)
      if (importados.length === 0) {
        alert('No hay filas de datos para importar. Revisa que haya datos debajo de la cabecera en el Excel.')
        return
      }
      const { importadosOk, duplicados, total } = await importarProductos(importados)
      const msg =
        duplicados > 0
          ? `Se importaron ${importadosOk} de ${total} productos. ${duplicados} ya existían (nombre duplicado).`
          : `Se importaron ${importadosOk} de ${total} productos.`
      alert(msg)
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

