import { useState } from 'react'
import SectionCard from './SectionCard'

const PIEZAS_INICIALES = [
  {
    id: 'AV-001',
    tipo: 'Video',
    plataforma: 'TikTok',
    formato: '9:16 · 15s',
    estado: 'pendiente',
    campañaAsociada: 'Lanzamiento Q2',
  },
  {
    id: 'AV-002',
    tipo: 'Imagen',
    plataforma: 'Meta',
    formato: '1080x1080',
    estado: 'aprobada',
    campañaAsociada: 'Promo fin de mes',
  },
  {
    id: 'AV-003',
    tipo: 'Video',
    plataforma: 'YouTube',
    formato: '16:9 · 30s',
    estado: 'usada',
    campañaAsociada: 'Brand Awareness',
  },
]

function badgeEstado(estado) {
  const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium'
  if (estado === 'aprobada') return `${base} bg-emerald-100 text-emerald-700`
  if (estado === 'usada') return `${base} bg-sky-100 text-sky-700`
  return `${base} bg-amber-100 text-amber-700`
}

export default function VistaAudiovisual() {
  const [piezas] = useState(PIEZAS_INICIALES)

  const handleSubir = () => {
    // Aquí luego se implementará el flujo real de subida
    // eslint-disable-next-line no-alert
    alert('Aquí irá el flujo para subir una pieza audiovisual.')
  }

  const handleAsociar = (pieza) => {
    // eslint-disable-next-line no-alert
    alert(`Asociar la pieza ${pieza.id} a una campaña.`)
  }

  const handleAprobar = (pieza) => {
    // eslint-disable-next-line no-alert
    alert(`Marcar la pieza ${pieza.id} como aprobada.`)
  }

  const handleReutilizar = (pieza) => {
    // eslint-disable-next-line no-alert
    alert(`Reutilizar la pieza ${pieza.id} en otras campañas.`)
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Piezas audiovisuales">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Centraliza todo tu material creativo y reutilízalo fácilmente en tus campañas.
          </p>
          <button
            type="button"
            onClick={handleSubir}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Subir pieza audiovisual
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Tipo</th>
                <th className="pb-3 pr-4 font-medium">Plataforma destino</th>
                <th className="pb-3 pr-4 font-medium">Formato / duración</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 pr-4 font-medium">Campaña asociada</th>
                <th className="pb-3 pr-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {piezas.map((pieza) => (
                <tr key={pieza.id} className="border-b border-border">
                  <td className="py-3 pr-4 text-card-foreground whitespace-nowrap">
                    {pieza.id}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.tipo}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.plataforma}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.formato}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={badgeEstado(pieza.estado)}>{pieza.estado}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                    {pieza.campañaAsociada || '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAsociar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Asociar a campaña
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAprobar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Marcar como aprobada
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReutilizar(pieza)}
                        className="text-primary hover:underline"
                      >
                        Reutilizar
                      </button>
                    </div>
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

