import { useState, useEffect, useMemo, useRef } from 'react'
import { alertError, alertSuccess } from '../utils/alerts'
import { productosApi } from '../utils/api'
import { useProductos } from '../context/ProductosContext'

const TIPOS = ['servicio', 'producto']
const ESTADOS = ['activo', 'inactivo']

function ProductoForm({ producto, onGuardar, onCancelar }) {
  const esEdicion = !!producto
  const { productos } = useProductos()
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'servicio',
    estado: 'activo',
    archivosImagen: [],
    usosTexto: '',
    caracteristicasTexto: '',
    stock: '',
    whatsapp: '',
    categoria: '',
    subcategoria: '',
  })
  const [eliminandoImagen, setEliminandoImagen] = useState(null)
  const [showCatSuggestions, setShowCatSuggestions] = useState(false)
  const [showSubcatSuggestions, setShowSubcatSuggestions] = useState(false)
  const catRef = useRef(null)
  const subcatRef = useRef(null)

  const categoriasExistentes = useMemo(() => {
    const cats = new Set()
    ;(productos || []).forEach(p => { if (p.categoria) cats.add(p.categoria) })
    return [...cats].sort()
  }, [productos])

  const subcategoriasExistentes = useMemo(() => {
    const subs = new Set()
    ;(productos || []).forEach(p => { if (p.subcategoria) subs.add(p.subcategoria) })
    return [...subs].sort()
  }, [productos])

  const catSuggestions = useMemo(() => {
    if (!form.categoria) return categoriasExistentes
    const lower = form.categoria.toLowerCase()
    return categoriasExistentes.filter(c => c.toLowerCase().includes(lower))
  }, [form.categoria, categoriasExistentes])

  const subcatSuggestions = useMemo(() => {
    if (!form.subcategoria) return subcategoriasExistentes
    const lower = form.subcategoria.toLowerCase()
    return subcategoriasExistentes.filter(c => c.toLowerCase().includes(lower))
  }, [form.subcategoria, subcategoriasExistentes])

  const archivoUrls = useMemo(
    () => (form.archivosImagen || []).map(f => URL.createObjectURL(f)),
    [form.archivosImagen]
  )

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre ?? '',
        descripcion: producto.descripcion ?? '',
        precio: producto.precio ?? '',
        tipo: producto.tipo ?? 'servicio',
        estado: producto.estado ?? 'activo',
        archivosImagen: [],
        usosTexto: Array.isArray(producto.usos) ? producto.usos.join('\n') : '',
        caracteristicasTexto: Array.isArray(producto.caracteristicas)
          ? producto.caracteristicas.join('\n')
          : '',
        stock: producto.stock != null ? String(producto.stock) : '',
        whatsapp: producto.whatsapp ?? '',
        categoria: producto.categoria ?? '',
        subcategoria: producto.subcategoria ?? '',
      })
    } else {
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo: 'servicio',
        estado: 'activo',
        archivosImagen: [],
        usosTexto: '',
        caracteristicasTexto: '',
        stock: '',
        categoria: '',
        subcategoria: '',
      })
    }
  }, [producto])

  const usos = form.usosTexto.split('\n').map((s) => s.trim()).filter(Boolean)
  const caracteristicas = form.caracteristicasTexto.split('\n').map((s) => s.trim()).filter(Boolean)
  const imagenesExistentes = Array.isArray(producto?.imagenes) ? producto.imagenes : []

  const handleSubmit = (e) => {
    e.preventDefault()
    const tieneArchivos = form.archivosImagen?.length > 0

    if (tieneArchivos) {
      const formData = new FormData()
      formData.append('nombre', form.nombre)
      formData.append('descripcion', form.descripcion)
      formData.append('precio', String(form.precio).replace(/\D/g, '') || '0')
      formData.append('tipo', form.tipo)
      formData.append('estado', form.estado)
      formData.append('stock', form.tipo === 'producto' ? String(Number(form.stock) || 0) : '0')
      formData.append('whatsapp', form.whatsapp || '')
      formData.append('categoria', form.categoria || '')
      formData.append('subcategoria', form.subcategoria || '')
      formData.append('usos', JSON.stringify(usos))
      formData.append('caracteristicas', JSON.stringify(caracteristicas))
      form.archivosImagen.forEach((file) => formData.append('imagenes', file))
      const payload = { formData }
      if (esEdicion) payload.id = producto.id
      onGuardar(payload)
    } else {
      const payload = {
        ...form,
        stock: form.tipo === 'producto' ? (Number(form.stock) || 0) : 0,
        usos,
        caracteristicas,
        imagenes: imagenesExistentes,
      }
      if (esEdicion) payload.id = producto.id
      onGuardar(payload)
    }
  }

  const quitarArchivo = (i) => {
    setForm((f) => ({
      ...f,
      archivosImagen: f.archivosImagen.filter((_, j) => j !== i),
    }))
  }

  const quitarImagenExistente = async (i) => {
    if (!producto?.id) return
    try {
      setEliminandoImagen(i)
      await productosApi.eliminarImagen(producto.id, i)
      // Actualizar las imágenes en el producto local sin re-enviar todo el form
      producto.imagenes = producto.imagenes.filter((_, j) => j !== i)
      setForm((f) => ({ ...f }))
      alertSuccess('Imagen eliminada')
    } catch (err) {
      alertError('Error al eliminar la imagen: ' + err.message)
    } finally {
      setEliminandoImagen(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">
          {esEdicion ? 'Editar producto' : 'Crear producto'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Nombre del producto/servicio
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            />
          </div>
          <div className="relative" ref={catRef}>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Categoría <span className="text-muted-foreground/50 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => {
                setForm((f) => ({ ...f, categoria: e.target.value }))
                setShowCatSuggestions(true)
              }}
              onFocus={() => setShowCatSuggestions(true)}
              onBlur={() => setTimeout(() => setShowCatSuggestions(false), 150)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. Orales, Inyectables, Camisetas..."
            />
            {showCatSuggestions && catSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-40 overflow-auto">
                {catSuggestions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setForm((f) => ({ ...f, categoria: cat }))
                      setShowCatSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-card-foreground hover:bg-primary/10 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            {categoriasExistentes.length > 0 && !form.categoria && (
              <p className="mt-1 text-xs text-muted-foreground">
                Categorías existentes: {categoriasExistentes.join(', ')}
              </p>
            )}
          </div>
          <div className="relative" ref={subcatRef}>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Subcategoría <span className="text-muted-foreground/50 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.subcategoria}
              onChange={(e) => {
                setForm((f) => ({ ...f, subcategoria: e.target.value }))
                setShowSubcatSuggestions(true)
              }}
              onFocus={() => setShowSubcatSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSubcatSuggestions(false), 150)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 100mg, 250mg, 10ml..."
            />
            {showSubcatSuggestions && subcatSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-40 overflow-auto">
                {subcatSuggestions.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setForm((f) => ({ ...f, subcategoria: sub }))
                      setShowSubcatSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-card-foreground hover:bg-primary/10 transition-colors"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
            {subcategoriasExistentes.length > 0 && !form.subcategoria && (
              <p className="mt-1 text-xs text-muted-foreground">
                Subcategorías existentes: {subcategoriasExistentes.join(', ')}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground min-h-40"
              rows={6}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Usos del producto/servicio
            </label>
            <textarea
              value={form.usosTexto}
              onChange={(e) =>
                setForm((f) => ({ ...f, usosTexto: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground min-h-40"
              rows={6}
              placeholder="Escribe un uso por línea..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Características principales
            </label>
            <textarea
              value={form.caracteristicasTexto}
              onChange={(e) =>
                setForm((f) => ({ ...f, caracteristicasTexto: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground min-h-40"
              rows={6}
              placeholder="Escribe una característica por línea..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Precio (COP)
            </label>
            <input
              type="text"
              value={form.precio}
              onChange={(e) =>
                setForm((f) => ({ ...f, precio: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. $50.000 o 50000"
            />
          </div>
          {form.tipo === 'producto' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Stock disponible
              </label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
                placeholder="Ej. 10"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              WhatsApp de contacto (con código de país)
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 573001234567"
            />
            <p className="mt-1 text-xs text-muted-foreground">Se usa para redirigir al cliente por WhatsApp después del pago.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t === 'servicio' ? 'Servicio' : 'Producto'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estado: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              >
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'activo' ? 'Activo' : 'Inactivo'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Imágenes
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  archivosImagen: [...(f.archivosImagen || []), ...(e.target.files || [])],
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
            />
            {imagenesExistentes.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Imágenes actuales del producto:
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {imagenesExistentes.map((img, i) => (
                <div key={`e-${i}`} className="relative group">
                  <img
                    src={typeof img === 'string' ? img : productosApi.urlImagen(producto.id, i)}
                    alt={`Imagen ${i + 1}`}
                    className={`h-20 w-20 rounded object-cover transition-opacity ${
                      eliminandoImagen === i ? 'opacity-50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => quitarImagenExistente(i)}
                    disabled={eliminandoImagen !== null}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    title="Eliminar imagen"
                  >
                    {eliminandoImagen === i ? '⟳' : '×'}
                  </button>
                </div>
              ))}
              {archivoUrls.map((url, i) => (
                <div key={`f-${i}`} className="relative group">
                  <img
                    src={url}
                    alt={`Nueva ${i + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => quitarArchivo(i)}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoForm

