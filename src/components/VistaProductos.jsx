import { useState, useMemo } from 'react'
import { toast } from 'sonner'
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
  const [busqueda, setBusqueda] = useState('')

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (producto) => setFormAbierto(producto)
  const cerrarForm = () => setFormAbierto(null)

  const handleGuardarProducto = async (payload) => {
    try {
      await guardarProducto(payload)
      cerrarForm()
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar el producto')
    }
  }

  const handleToggleEstado = (producto) => {
    toggleEstadoProducto(producto)
  }

  const handleExportExcel = () => {
    const rows = productosToRows(productosFiltrados)
    exportToExcel(PRODUCTOS_HEADERS, rows, 'productos')
  }

  const handleImportExcel = async (file) => {
    try {
      const rows = await readExcelFile(file)
      const validacionCabeceras = validarCabecerasProductos(rows)
      if (!validacionCabeceras.valido) {
        toast.error('Faltan columnas: ' + validacionCabeceras.faltantes.join(', ') + '. Revisa la primera fila del Excel.')
        return
      }
      const validacionFilas = validarFilasProductos(rows)
      if (!validacionFilas.valido) {
        const msg = validacionFilas.filasConError
          .map((e) => `Fila ${e.numeroFila}: faltan ${e.camposFaltantes.join(', ')}`)
          .join('\n')
        toast.error('Filas incompletas: ' + msg)
        return
      }
      const importados = rowsToProductos(rows)
      if (importados.length === 0) {
        toast.warning('No hay filas de datos para importar. Revisa el archivo Excel.')
        return
      }
      const { importadosOk, duplicados, total } = await importarProductos(importados)
      const msg =
        duplicados > 0
          ? `Se importaron ${importadosOk} de ${total} productos. ${duplicados} ya existían (nombre duplicado).`
          : `Se importaron ${importadosOk} de ${total} productos.`
      toast.success(msg)
    } catch (err) {
      console.error('Error al importar Excel:', err)
      toast.error('No se pudo leer el archivo. Comprueba que sea un Excel (.xlsx) válido.')
    }
  }

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return productos
    return productos.filter(
      (p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.tipo || '').toString().toLowerCase().includes(q) ||
        (p.estado || '').toString().toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q) ||
        (p.precio ?? '').toString().toLowerCase().includes(q)
    )
  }, [productos, busqueda])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, tipo o estado..."
          className="w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        />
      </div>
      <ProductosList
        productos={productosFiltrados}
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

