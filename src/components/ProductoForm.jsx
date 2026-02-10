import { useState, useEffect } from 'react'

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
    imagenes: [],
    nuevaImagen: '',
    usosTexto: '',
    caracteristicasTexto: '',
  })

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre ?? '',
        descripcion: producto.descripcion ?? '',
        precio: producto.precio ?? '',
        tipo: producto.tipo ?? 'servicio',
        estado: producto.estado ?? 'activo',
        imagenes: producto.imagenes ?? [],
        nuevaImagen: '',
      })
    } else {
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo: 'servicio',
        estado: 'activo',
        imagenes: [],
        nuevaImagen: '',
      })
    }
  }, [producto])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      imagenes: form.imagenes,
    }
    if (esEdicion) payload.id = producto.id
    onGuardar(payload)
  }

  const agregarImagen = () => {
    if (!form.nuevaImagen) return
    setForm((f) => ({
      ...f,
      imagenes: [...(f.imagenes || []), f.nuevaImagen],
      nuevaImagen: '',
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
              Precio
            </label>
            <input
              type="text"
              value={form.precio}
              onChange={(e) =>
                setForm((f) => ({ ...f, precio: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. $1,200"
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
              Imágenes (URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.nuevaImagen}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nuevaImagen: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={agregarImagen}
                className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Agregar
              </button>
            </div>
            {form.imagenes?.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.imagenes.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="h-20 w-full rounded object-cover"
                  />
                ))}
              </div>
            )}
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

