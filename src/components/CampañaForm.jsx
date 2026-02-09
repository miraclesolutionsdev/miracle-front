import { useState, useEffect } from 'react'

const PLATAFORMAS = ['Google Ads', 'Facebook Ads', 'Instagram Ads']
const ESTADOS = ['borrador', 'activa', 'pausada', 'finalizada']

function CampañaForm({ campaña, clientes = [], productos = [], onGuardar, onCancelar }) {
  const esEdicion = !!campaña
  const [form, setForm] = useState({
    cliente: '',
    producto: '',
    plataforma: 'Google Ads',
    miracleCoins: '',
    estado: 'borrador',
  })

  useEffect(() => {
    if (campaña) {
      setForm({
        cliente: campaña.cliente,
        producto: campaña.producto,
        plataforma: campaña.plataforma,
        miracleCoins: campaña.miracleCoins,
        estado: campaña.estado,
      })
    } else {
      setForm({
        cliente: clientes[0]?.nombreEmpresa ?? '',
        producto: productos[0] ?? '',
        plataforma: 'Google Ads',
        miracleCoins: '',
        estado: 'borrador',
      })
    }
  }, [campaña, clientes, productos])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (esEdicion) payload.id = campaña.id
    onGuardar(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">
          {esEdicion ? 'Editar campaña' : 'Crear campaña'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Cliente</label>
            <select
              value={form.cliente}
              onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            >
              <option value="">Seleccionar...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.nombreEmpresa}>{c.nombreEmpresa}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Producto/Servicio</label>
            <input
              type="text"
              value={form.producto}
              onChange={(e) => setForm((f) => ({ ...f, producto: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. Pack Social Media"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Plataforma/Social Media</label>
            <select
              value={form.plataforma}
              onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            >
              {PLATAFORMAS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Miracle Coins Asignadas</label>
            <input
              type="text"
              value={form.miracleCoins}
              onChange={(e) => setForm((f) => ({ ...f, miracleCoins: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            >
              {ESTADOS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
