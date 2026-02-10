import { useState, useEffect } from 'react'

const ESTADOS = ['activo', 'pausado']

function ClienteForm({ cliente, onGuardar, onCancelar }) {
  const esEdicion = !!cliente
  const [form, setForm] = useState({
    nombreEmpresa: '',
    cedulaNit: '',
    email: '',
    whatsapp: '',
    direccion: '',
    ciudadBarrio: '',
    estado: 'activo',
    miracleCoins: '0',
  })

  useEffect(() => {
    if (cliente) {
      setForm({
        nombreEmpresa: cliente.nombreEmpresa ?? '',
        cedulaNit: cliente.cedulaNit ?? '',
        email: cliente.email ?? '',
        whatsapp: cliente.whatsapp ?? '',
        direccion: cliente.direccion ?? '',
        ciudadBarrio: cliente.ciudadBarrio ?? '',
        estado: cliente.estado ?? 'activo',
        miracleCoins: String(cliente.miracleCoins ?? '0'),
      })
    } else {
      setForm({
        nombreEmpresa: '',
        cedulaNit: '',
        email: '',
        whatsapp: '',
        direccion: '',
        ciudadBarrio: '',
        estado: 'activo',
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
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-border bg-card p-6 shadow-lg">
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
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Cédula / NIT
            </label>
            <input
              type="text"
              value={form.cedulaNit}
              onChange={(e) => setForm((f) => ({ ...f, cedulaNit: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. 900.123.456-1"
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
              WhatsApp / Teléfono
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. Calle 50 # 10-20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Ciudad y Barrio
            </label>
            <input
              type="text"
              value={form.ciudadBarrio}
              onChange={(e) => setForm((f) => ({ ...f, ciudadBarrio: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-card-foreground"
              placeholder="Ej. Bogotá - Chapinero"
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
                <option key={s} value={s}>{s === 'activo' ? 'Activo' : 'Pausado'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Miracle Coins disponibles
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
