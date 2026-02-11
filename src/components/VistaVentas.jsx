import { useState } from 'react'
import SectionCard from './SectionCard'

const VENTAS_INICIALES = [
  {
    id: 'VENT-001',
    cliente: 'Acme Corp',
    productoPlan: 'Pack Social Media - Plan Pro',
    valor: '$1,200.00',
    fecha: '2025-02-01',
    metodoPago: 'Tarjeta',
    miracleCoins: 300,
  },
  {
    id: 'VENT-002',
    cliente: 'Startup XYZ',
    productoPlan: 'Video Corporativo',
    valor: '$3,500.00',
    fecha: '2025-01-25',
    metodoPago: 'Transferencia',
    miracleCoins: 700,
  },
  {
    id: 'VENT-003',
    cliente: 'Tienda Digital',
    productoPlan: 'Consultoría Estrategia Digital',
    valor: '$350.00',
    fecha: '2025-01-18',
    metodoPago: 'Efectivo',
    miracleCoins: 80,
  },
]

export default function VistaVentas() {
  const [ventas] = useState(VENTAS_INICIALES)

  const handleRegistrarVenta = () => {
    // Aquí luego se implementará el formulario real de registro de venta
    // eslint-disable-next-line no-alert
    alert('Aquí irá el formulario para registrar una nueva venta y asociarla a un cliente.')
  }

  const handleVerDetalle = (venta) => {
    // eslint-disable-next-line no-alert
    alert(`Ver detalle de la venta ${venta.id} (${venta.productoPlan}) del cliente ${venta.cliente}.`)
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Ventas">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Registra tus ingresos, planes vendidos y su impacto en el sistema de Miracle Coins.
          </p>
          <button
            type="button"
            onClick={handleRegistrarVenta}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Registrar venta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Cliente</th>
                <th className="pb-3 pr-4 font-medium">Producto / plan</th>
                <th className="pb-3 pr-4 font-medium">Valor</th>
                <th className="pb-3 pr-4 font-medium">Fecha</th>
                <th className="pb-3 pr-4 font-medium">Método de pago</th>
                <th className="pb-3 pr-4 font-medium">Miracle Coins</th>
                <th className="pb-3 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id} className="border-b border-border">
                  <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">
                    {v.cliente}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {v.productoPlan}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {v.valor}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {v.fecha}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {v.metodoPago}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {v.miracleCoins?.toLocaleString() ?? '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => handleVerDetalle(v)}
                      className="text-primary hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

