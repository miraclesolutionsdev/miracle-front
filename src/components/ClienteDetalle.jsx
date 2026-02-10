import { useState } from 'react'

const TABS = [
  { id: 'productos', label: 'Productos asociados' },
  { id: 'campanas', label: 'Campañas asociadas' },
  { id: 'ventas', label: 'Ventas asociadas' },
  { id: 'coins', label: 'Consumo Miracle Coins' },
]

const productosEjemplo = [
  { name: 'Pack Social Media', price: '$1,200', estado: 'Activo' },
  { name: 'Video Corporativo', price: '$3,500', estado: 'En uso' },
]
const campañasEjemplo = [
  { nombre: 'Facebook Ads Q1', estado: 'Activa', alcance: '12.5k' },
  { nombre: 'Google Search', estado: 'Activa', alcance: '8.2k' },
]
const ventasEjemplo = [
  { fecha: '2025-01-15', monto: '$2,400', estado: 'Completada' },
  { fecha: '2025-01-08', monto: '$800', estado: 'Completada' },
]
const consumoCoinsEjemplo = [
  { fecha: '2025-01-14', concepto: 'Creación de anuncios', coins: 150 },
  { fecha: '2025-01-10', concepto: 'Reporte semanal', coins: 50 },
]

function ClienteDetalle({ cliente, onCerrar }) {
  const [tab, setTab] = useState('productos')

  if (!cliente) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-lg flex flex-col">
        <div className="border-b border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{cliente.nombreEmpresa}</h2>
              <p className="text-sm text-muted-foreground">{cliente.id} · {cliente.email}</p>
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Cédula / NIT</dt>
              <dd className="text-card-foreground">{cliente.cedulaNit || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="text-card-foreground">{cliente.whatsapp}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Dirección</dt>
              <dd className="text-card-foreground">{cliente.direccion || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ciudad y Barrio</dt>
              <dd className="text-card-foreground">{cliente.ciudadBarrio || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="text-card-foreground">{cliente.estado}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Miracle Coins</dt>
              <dd className="text-card-foreground">{cliente.miracleCoins}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fecha de creación</dt>
              <dd className="text-card-foreground">{cliente.fechaCreacion}</dd>
            </div>
          </dl>
        </div>

        <div className="flex border-b border-border px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {tab === 'productos' && (
            <ul className="space-y-2">
              {productosEjemplo.map((p, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
                  <span className="text-card-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{p.price} · {p.estado}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === 'campanas' && (
            <ul className="space-y-2">
              {campañasEjemplo.map((c, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
                  <span className="text-card-foreground">{c.nombre}</span>
                  <span className="text-muted-foreground">{c.estado} · Alcance {c.alcance}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === 'ventas' && (
            <ul className="space-y-2">
              {ventasEjemplo.map((v, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
                  <span className="text-card-foreground">{v.fecha}</span>
                  <span className="text-muted-foreground">{v.monto} · {v.estado}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === 'coins' && (
            <ul className="space-y-2">
              {consumoCoinsEjemplo.map((c, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
                  <span className="text-card-foreground">{c.concepto}</span>
                  <span className="text-muted-foreground">{c.fecha} · {c.coins} coins</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClienteDetalle
