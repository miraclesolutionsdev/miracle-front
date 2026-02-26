import { useState, useEffect } from 'react'

const PLATAFORMAS = ['Google Ads', 'Facebook Ads', 'Instagram Ads']
const ESTADOS = ['borrador', 'activa', 'pausada', 'finalizada']

function CampañaForm({ campaña, productos = [], piezas = [], onGuardar, onCancelar }) {
  const esEdicion = !!campaña
  const [form, setForm] = useState({
    producto: '',
    piezaCreativo: '',
    plataforma: 'Google Ads',
    miracleCoins: '',
    estado: 'borrador',
  })

  useEffect(() => {
    if (campaña) {
      const productMatch = productos.find((p) => p.nombre === campaña.producto)
      const piezaMatch = piezas.find(
        (p) => (p.nombre && p.nombre === campaña.piezaCreativo) || (p.id && p.id === campaña.piezaCreativo)
      )
      setForm({
        producto: productMatch?.id ?? campaña.producto ?? '',
        piezaCreativo: piezaMatch?.id ?? piezaMatch?.nombre ?? campaña.piezaCreativo ?? '',
        plataforma: campaña.plataforma ?? 'Google Ads',
        miracleCoins: campaña.miracleCoins ?? '',
        estado: campaña.estado ?? 'borrador',
      })
    } else {
      setForm({
        producto: productos[0]?.id ?? '',
        piezaCreativo: piezas[0]?.id ?? piezas[0]?.nombre ?? '',
        plataforma: 'Google Ads',
        miracleCoins: '',
        estado: 'borrador',
      })
    }
  }, [campaña, productos, piezas])

  const handleSubmit = (e) => {
    e.preventDefault()
    const productoSeleccionado = productos.find((p) => p.id === form.producto)
    const piezaSeleccionada = piezas.find(
      (p) => (p.id && p.id === form.piezaCreativo) || (p.nombre && p.nombre === form.piezaCreativo)
    )
    const payload = {
      ...form,
      producto: productoSeleccionado?.nombre ?? form.producto,
      piezaCreativo: piezaSeleccionada?.nombre ?? piezaSeleccionada?.id ?? form.piezaCreativo,
    }
    if (esEdicion) payload.id = campaña.id
    onGuardar(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">
          {esEdicion ? 'Editar campaña' : 'Crear campaña'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Producto
            </label>
            <select
              value={form.producto}
              onChange={(e) => setForm((f) => ({ ...f, producto: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            >
              <option value="">Seleccionar producto...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Pieza Publicidad (Creativo)
            </label>
            <select
              value={form.piezaCreativo}
              onChange={(e) => setForm((f) => ({ ...f, piezaCreativo: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            >
              <option value="">Seleccionar pieza...</option>
              {piezas.map((p) => (
                <option key={p.id || p.nombre} value={p.id || p.nombre}>
                  {p.nombre ?? p.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Plataforma / Social Media
            </label>
            <select
              value={form.plataforma}
              onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            >
              {PLATAFORMAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Miracle Coins Asignadas
            </label>
            <input
              type="text"
              value={form.miracleCoins}
              onChange={(e) => setForm((f) => ({ ...f, miracleCoins: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Estado
            </label>
            <select
              value={form.estado}
              onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            >
              {ESTADOS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
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

export default CampañaForm
