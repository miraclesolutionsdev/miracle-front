import * as XLSX from 'xlsx'

const SEP = '|'

/**
 * Exporta un array de filas (primera fila = cabeceras) a un archivo .xlsx
 * @param {string[]} headers - Nombres de columnas
 * @param {any[][]} rows - Filas de datos (cada fila es un array con mismo orden que headers)
 * @param {string} fileName - Nombre del archivo sin extensión
 */
export function exportToExcel(headers, rows, fileName = 'export') {
  const data = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, `${fileName}.xlsx`)
}

/**
 * Lee un archivo Excel y devuelve la primera hoja como array de filas (incluye cabecera)
 * @param {File} file - Archivo .xlsx o .xls
 * @returns {Promise<any[][]>} [headers, ...rows]
 */
export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const aoa = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: '',
          raw: false,
        })
        resolve(aoa)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsBinaryString(file)
  })
}

// --- Clientes: cabeceras y mapeo fila <-> objeto
export const CLIENTES_HEADERS = [
  'ID',
  'Nombre Empresa',
  'Cédula/NIT',
  'Email',
  'WhatsApp',
  'Dirección',
  'Ciudad/Barrio',
  'Estado',
  'Plan',
  'Miracle Coins',
  'Fecha creación',
]

export function clientesToRows(clientes) {
  return clientes.map((c) => [
    c.id ?? '',
    c.nombreEmpresa ?? '',
    c.cedulaNit ?? '',
    c.email ?? '',
    c.whatsapp ?? '',
    c.direccion ?? '',
    c.ciudadBarrio ?? '',
    c.estado ?? '',
    c.plan ?? '',
    c.miracleCoins ?? '',
    c.fechaCreacion ?? '',
  ])
}

export function rowsToClientes(rows) {
  if (!rows.length) return []
  const [header, ...dataRows] = rows
  return dataRows
    .filter((row) => row && row.some((cell) => cell != null && String(cell).trim() !== ''))
    .map((row) => ({
      id: row[0] ? String(row[0]).trim() : '',
      nombreEmpresa: String(row[1] ?? '').trim(),
      cedulaNit: String(row[2] ?? '').trim(),
      email: String(row[3] ?? '').trim(),
      whatsapp: String(row[4] ?? '').trim(),
      direccion: String(row[5] ?? '').trim(),
      ciudadBarrio: String(row[6] ?? '').trim(),
      estado: String(row[7] ?? 'activo').trim() || 'activo',
      plan: String(row[8] ?? '').trim(),
      miracleCoins: String(row[9] ?? '0').trim().replace(/\D/g, '') || '0',
      fechaCreacion: String(row[10] ?? '').trim(),
    }))
}

// --- Productos: cabeceras y mapeo (arrays con SEP)
export const PRODUCTOS_HEADERS = [
  'ID',
  'Nombre',
  'Descripción',
  'Precio',
  'Tipo',
  'Estado',
  'Stock',
  'Imágenes',
  'Usos',
  'Características',
]

export function productosToRows(productos) {
  return productos.map((p) => [
    p.id ?? '',
    p.nombre ?? '',
    p.descripcion ?? '',
    p.precio ?? '',
    p.tipo ?? 'servicio',
    p.estado ?? 'activo',
    p.stock ?? '',
    Array.isArray(p.imagenes) ? p.imagenes.join(SEP) : '',
    Array.isArray(p.usos) ? p.usos.join(SEP) : '',
    Array.isArray(p.caracteristicas) ? p.caracteristicas.join(SEP) : '',
  ])
}

export function rowsToProductos(rows) {
  if (!rows.length) return []
  const [, ...dataRows] = rows
  return dataRows
    .filter((row) => row && row[1] != null && String(row[1]).trim() !== '')
    .map((row) => {
      const imagenes = String(row[7] ?? '').trim()
      const usos = String(row[8] ?? '').trim()
      const caracteristicas = String(row[9] ?? '').trim()
      return {
        id: row[0] ? String(row[0]).trim() : undefined,
        nombre: String(row[1] ?? '').trim(),
        descripcion: String(row[2] ?? '').trim(),
        precio: String(row[3] ?? '').trim(),
        tipo: String(row[4] ?? 'servicio').trim() || 'servicio',
        estado: String(row[5] ?? 'activo').trim() || 'activo',
        stock: parseInt(String(row[6] ?? '0').replace(/\D/g, ''), 10) || 0,
        imagenes: imagenes ? imagenes.split(SEP).map((s) => s.trim()).filter(Boolean) : [],
        usos: usos ? usos.split(SEP).map((s) => s.trim()).filter(Boolean) : [],
        caracteristicas: caracteristicas ? caracteristicas.split(SEP).map((s) => s.trim()).filter(Boolean) : [],
      }
    })
}
