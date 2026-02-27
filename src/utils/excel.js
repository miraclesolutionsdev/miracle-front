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
 * Lee un archivo y devuelve la primera hoja como array de filas (incluye cabecera)
 * Soporta: .xlsx, .xls y .csv
 * @param {File} file - Archivo .xlsx, .xls o .csv
 * @returns {Promise<any[][]>} [headers, ...rows]
 */
export function readExcelFile(file) {
  const isCsv =
    file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, {
          type: isCsv ? 'string' : 'binary',
        })
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

    if (isCsv) {
      reader.readAsText(file, 'utf-8')
    } else {
      reader.readAsBinaryString(file)
    }
  })
}

// --- Clientes: cabeceras y mapeo fila <-> objeto

/** Normaliza texto de cabecera para comparar (minúsculas, sin tildes, espacios unificados) */
function normalizarCabecera(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s_\-/]+/g, ' ')
    .trim()
}

/** Mapeo: cabecera normalizada -> nombre del campo en nuestro modelo */
const CLIENTES_CABECERA_A_CAMPO = {
  id: 'id',
  nombre: 'nombreEmpresa',
  'nombre empresa': 'nombreEmpresa',
  'nombre o empresa': 'nombreEmpresa',
  empresa: 'nombreEmpresa',
  cedula: 'cedulaNit',
  nit: 'cedulaNit',
  'cedula nit': 'cedulaNit',
  'cedula/nit': 'cedulaNit',
  'cedula o nit': 'cedulaNit',
  email: 'email',
  whatsapp: 'whatsapp',
  telefono: 'whatsapp',
  celular: 'whatsapp',
  contacto: 'whatsapp',
  direccion: 'direccion',
  ciudad: 'ciudadBarrio',
  barrio: 'ciudadBarrio',
  'ciudad barrio': 'ciudadBarrio',
  'ciudad/barrio': 'ciudadBarrio',
  'ciudad con barrio': 'ciudadBarrio',
  'ciudad y barrio': 'ciudadBarrio',
  estado: 'estado',
  'miracle coins': 'miracleCoins',
  plan: 'plan',
  'fecha creacion': 'fechaCreacion',
}

/** Dado un array de cabeceras (primera fila), devuelve { nombreCampo: índiceColumna } */
function indicesPorCabecera(headerRow) {
  const indices = {}
  for (let i = 0; i < (headerRow?.length ?? 0); i++) {
    const norm = normalizarCabecera(headerRow[i])
    const campo = CLIENTES_CABECERA_A_CAMPO[norm]
    if (campo != null) indices[campo] = i
  }
  return indices
}

/** Columnas obligatorias para importar clientes y sus nombres para mostrar al usuario */
const CLIENTES_CAMPOS_OBLIGATORIOS = [
  'nombreEmpresa',
  'cedulaNit',
  'email',
  'whatsapp',
  'direccion',
  'ciudadBarrio',
]
const CLIENTES_NOMBRES_OBLIGATORIOS = {
  nombreEmpresa: 'Nombre o empresa',
  cedulaNit: 'Cédula/NIT',
  email: 'Email',
  whatsapp: 'WhatsApp',
  direccion: 'Dirección',
  ciudadBarrio: 'Ciudad/Barrio',
}

/**
 * Valida que el Excel tenga todas las columnas obligatorias para clientes.
 * @param {any[][]} rows - Filas del Excel (primera = cabecera)
 * @returns {{ valido: boolean, faltantes: string[] }}
 */
export function validarCabecerasClientes(rows) {
  if (!rows?.length) {
    return { valido: false, faltantes: ['El archivo está vacío o no tiene cabecera.'] }
  }
  const headerRow = rows[0]
  const header = Array.isArray(headerRow) ? headerRow : [headerRow]
  const indices = indicesPorCabecera(header)
  const faltantes = CLIENTES_CAMPOS_OBLIGATORIOS.filter((campo) => indices[campo] == null)
  const nombresFaltantes = faltantes.map((c) => CLIENTES_NOMBRES_OBLIGATORIOS[c] || c)
  return {
    valido: faltantes.length === 0,
    faltantes: nombresFaltantes,
  }
}

/**
 * Valida que cada fila de datos tenga todos los campos obligatorios.
 * @param {any[][]} rows - Filas del Excel (primera = cabecera)
 * @returns {{ valido: boolean, filasConError: { numeroFila: number, camposFaltantes: string[] }[] }}
 */
export function validarFilasClientes(rows) {
  const filasConError = []
  if (!rows?.length) return { valido: true, filasConError: [] }
  const [headerRow, ...dataRows] = rows
  const header = Array.isArray(headerRow) ? headerRow : [headerRow]
  const indices = indicesPorCabecera(header)

  const get = (row, campo) => {
    const i = indices[campo]
    if (i == null) return ''
    const val = row[i]
    return val != null ? String(val).trim() : ''
  }

  dataRows.forEach((row, idx) => {
    if (!row || !row.some((cell) => cell != null && String(cell).trim() !== '')) return
    const faltantes = CLIENTES_CAMPOS_OBLIGATORIOS.filter((campo) => {
      const v = get(row, campo)
      return v === ''
    })
    if (faltantes.length > 0) {
      filasConError.push({
        numeroFila: idx + 2,
        camposFaltantes: faltantes.map((c) => CLIENTES_NOMBRES_OBLIGATORIOS[c] || c),
      })
    }
  })

  return {
    valido: filasConError.length === 0,
    filasConError,
  }
}

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
  const [headerRow, ...dataRows] = rows
  const header = Array.isArray(headerRow) ? headerRow : [headerRow]
  const indices = indicesPorCabecera(header)

  const get = (row, campo) => {
    const i = indices[campo]
    if (i == null) return ''
    const val = row[i]
    return val != null ? String(val).trim() : ''
  }

  return dataRows
    .filter((row) => row && row.some((cell) => cell != null && String(cell).trim() !== ''))
    .map((row) => {
      const nombreEmpresa = get(row, 'nombreEmpresa')
      const email = get(row, 'email')
      const whatsapp = get(row, 'whatsapp')
      const cedulaNit = get(row, 'cedulaNit')
      const direccion = get(row, 'direccion')
      const ciudadBarrio = get(row, 'ciudadBarrio')
      const estadoRaw = get(row, 'estado')
      const miracleCoinsRaw = get(row, 'miracleCoins')

      return {
        id: '', // Al importar no usamos ID del Excel; el backend lo genera al crear
        nombreEmpresa: nombreEmpresa || '',
        cedulaNit: cedulaNit || '',
        email: email || '',
        whatsapp: whatsapp || '',
        direccion: direccion || '',
        ciudadBarrio: ciudadBarrio || '',
        estado: estadoRaw === 'pausado' || estadoRaw === 'inactivo' ? estadoRaw : 'activo',
        miracleCoins: miracleCoinsRaw.replace(/\D/g, '') || '0',
        fechaCreacion: get(row, 'fechaCreacion') || '',
      }
    })
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

/** Índices y nombres para validación de productos (mismo orden que PRODUCTOS_HEADERS) */
const PRODUCTOS_INDICES_OBLIGATORIOS = [
  { index: 1, nombre: 'Nombre' },
  { index: 3, nombre: 'Precio' },
  { index: 4, nombre: 'Tipo' },
  { index: 5, nombre: 'Estado' },
]

/**
 * Valida que el Excel de productos tenga las columnas obligatorias (por índice).
 * @param {any[][]} rows - Filas del Excel (primera = cabecera)
 * @returns {{ valido: boolean, faltantes: string[] }}
 */
export function validarCabecerasProductos(rows) {
  if (!rows?.length) {
    return { valido: false, faltantes: ['El archivo está vacío o no tiene cabecera.'] }
  }
  const headerRow = rows[0]
  const numCols = Array.isArray(headerRow) ? headerRow.length : 0
  const faltantes = PRODUCTOS_INDICES_OBLIGATORIOS.filter(
    (c) => c.index >= numCols
  ).map((c) => c.nombre)
  return {
    valido: faltantes.length === 0,
    faltantes,
  }
}

/**
 * Valida que cada fila de datos de productos tenga los campos obligatorios.
 * @param {any[][]} rows - Filas del Excel (primera = cabecera)
 * @returns {{ valido: boolean, filasConError: { numeroFila: number, camposFaltantes: string[] }[] }}
 */
export function validarFilasProductos(rows) {
  const filasConError = []
  if (!rows?.length) return { valido: true, filasConError: [] }
  const [, ...dataRows] = rows
  const nombresPorIndice = Object.fromEntries(
    PRODUCTOS_INDICES_OBLIGATORIOS.map((c) => [c.index, c.nombre])
  )

  dataRows.forEach((row, idx) => {
    if (!row || row.length === 0) return
    const nombre = row[1] != null ? String(row[1]).trim() : ''
    if (nombre === '') return
    const faltantes = PRODUCTOS_INDICES_OBLIGATORIOS.filter(({ index }) => {
      const val = row[index]
      return val == null || String(val).trim() === ''
    }).map((c) => c.nombre)
    if (faltantes.length > 0) {
      filasConError.push({
        numeroFila: idx + 2,
        camposFaltantes: faltantes,
      })
    }
  })

  return {
    valido: filasConError.length === 0,
    filasConError,
  }
}

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
