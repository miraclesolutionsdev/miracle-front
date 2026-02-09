import { useState, useEffect } from 'react'

const PLANES = ['Basico', 'Pro', 'Enterprise']
const ESTADOS = ['activo', 'pausado']

function ClienteForm({ cliente, onGuardar, onCancelar }) {
  const esEdicion = !!cliente
  const [form, setForm] = useState({
    nombreEmpresa: '',
    email: '',
    whatsapp: '',
    estado: 'activo',
    plan: 'Basico',
    miracleCoins: '0',
  })

  useEffect(() => {
    if (cliente) {
      setForm({
        nombreEmpresa: cliente.nombreEmpresa,
        email: cliente.email,
        whatsapp: cliente.whatsapp,
        estado: cliente.estado,
        plan: cliente.plan,
        miracleCoins: String(cliente.miracleCoins),
      })
    } else {
      setForm({
        nombreEmpresa: '',
        email: '',
        whatsapp: '',
        estado: 'activo',
        plan: 'Basico',
        miracleCoins: '0',
      })
    }
  }, [cliente])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      miracleCoins: form.miracleCoins.replace(/\D/g, '') || '0',
    }
    if (esEdicion) payload.id = cliente.id
    onGuardar(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">
          {esEdicion ? 'Editar cliente' : 'Crear cliente'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Nombre o empresa
            </label>
            <input
              type="text"
              value={form.nombreEmpresa}
              onChange={(e) => setForm((f) => ({ ...f, nombreEmpresa: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              WhatsApp / teléfono
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
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
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Plan</label>
            <select
              value={form.plan}
              onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            >
              {PLANES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Miracle Coins (ejemplo)
            </label>
            <input
              type="text"
              value={form.miracleCoins}
              onChange={(e) => setForm((f) => ({ ...f, miracleCoins: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            />
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

export default ClienteForm
