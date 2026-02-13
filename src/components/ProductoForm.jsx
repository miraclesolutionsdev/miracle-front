import { useState, useEffect } from 'react'
import { productosApi } from '../utils/api'

const TIPOS = ['servicio', 'producto']
const ESTADOS = ['activo', 'inactivo']

function ProductoForm({ producto, onGuardar, onCancelar }) {
  const esEdicion = !!producto
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo: 'servicio',
    estado: 'activo',
    archivosImagen: [],
    usosTexto: '',
    caracteristicasTexto: '',
    stock: 0,
  })

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
        stock: producto.stock ?? 0,
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
        stock: 0,
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
      formData.append('precio', String(form.precio).replace(/[^0-9.]/g, '') || '0')
      formData.append('tipo', form.tipo)
      formData.append('estado', form.estado)
      formData.append('stock', String(form.stock))
      formData.append('usos', JSON.stringify(usos))
      formData.append('caracteristicas', JSON.stringify(caracteristicas))
      form.archivosImagen.forEach((file) => formData.append('imagenes', file))
      const payload = { formData }
      if (esEdicion) payload.id = producto.id
      onGuardar(payload)
    } else {
      const payload = {
        ...form,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
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
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              rows={3}
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              rows={3}
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
              rows={3}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Stock disponible
            </label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 10"
            />
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
                <img
                  key={i}
                  src={typeof img === 'string' ? img : productosApi.urlImagen(producto.id, i)}
                  alt={`Imagen ${i + 1}`}
                  className="h-20 w-20 rounded object-cover"
                />
              ))}
              {form.archivosImagen?.map((file, i) => (
                <div key={`f-${i}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Nueva ${i + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => quitarArchivo(i)}
                    className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground"
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

