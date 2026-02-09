import { useState } from 'react'
import SectionCard from './SectionCard'

const materialEjemplo = {
  videos: ['video_principal.mp4', 'story_15s.mp4'],
  imagenes: ['banner_1200x628.jpg', 'cuadrado_1080.jpg'],
  copies: ['Título: Oferta limitada', 'Descripción: Hasta 50% en...'],
  landing: 'https://ejemplo.com/landing-campana',
}

function CampañaDetalle({ campaña, onCerrar, onImportarPiezas, onAsociarMaterial, onAsignarPresupuesto, onActivarPausar, onFinalizar }) {
  const [material] = useState(materialEjemplo)

  if (!campaña) return null

  const puedeActivarPausar = campaña.estado === 'activa' || campaña.estado === 'pausada'
  const puedeFinalizar = campaña.estado !== 'finalizada'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card shadow-lg flex flex-col">
        <div className="border-b border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{campaña.id} · {campaña.producto}</h2>
              <p className="text-sm text-muted-foreground">{campaña.plataforma} · {campaña.cliente}</p>
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
              <dt className="text-muted-foreground">Presupuesto</dt>
              <dd className="text-card-foreground">{campaña.presupuesto}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Miracle Coins</dt>
              <dd className="text-card-foreground">{campaña.miracleCoins}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="text-card-foreground">{campaña.estado}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onImportarPiezas?.(campaña)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-card-foreground hover:bg-muted"
            >
              Importar piezas publicitarias
            </button>
            <button
              type="button"
              onClick={() => onAsociarMaterial?.(campaña)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-card-foreground hover:bg-muted"
            >
              Asociar material audiovisual
            </button>
            <button
              type="button"
              onClick={() => onAsignarPresupuesto?.(campaña)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-card-foreground hover:bg-muted"
            >
              Asignar presupuesto
            </button>
            {puedeActivarPausar && (
              <button
                type="button"
                onClick={() => onActivarPausar?.(campaña)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"
              >
                {campaña.estado === 'activa' ? 'Pausar campaña' : 'Activar campaña'}
              </button>
            )}
            {puedeFinalizar && (
              <button
                type="button"
                onClick={() => onFinalizar?.(campaña)}
                className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/80"
              >
                Finalizar campaña
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-card-foreground">Material requerido</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SectionCard title="Videos" className="!p-4">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {material.videos.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Imágenes" className="!p-4">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {material.imagenes.map((img, i) => (
                  <li key={i}>{img}</li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Copies" className="!p-4 sm:col-span-2">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {material.copies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Landing page" className="!p-4 sm:col-span-2">
              <a href={material.landing} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                {material.landing}
              </a>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampañaDetalle
