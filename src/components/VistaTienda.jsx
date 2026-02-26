import { ExternalLink } from 'lucide-react'
import { useTiendaEstilo, ESTILOS } from '../context/TiendaEstiloContext.jsx'
import SectionCard from './SectionCard'
import FormularioInformacionNegocio from './FormularioInformacionNegocio'

function PreviewClasico() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-950 ring-1 ring-white/10">
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 h-6 w-24 rounded bg-neutral-800" />
        <div className="grid flex-1 grid-cols-2 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded bg-neutral-900/80">
              <div className="h-12 bg-neutral-800" />
              <div className="flex-1 space-y-1 p-1.5">
                <div className="h-1.5 w-3/4 rounded bg-neutral-700" />
                <div className="h-1 w-1/2 rounded bg-pink-500/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PreviewModerno() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#0d0d10] ring-1 ring-white/10">
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 h-6 w-20 rounded bg-white/5" />
        <div className="flex flex-1 flex-col gap-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2 rounded-lg bg-[#141418] p-2 ring-1 ring-white/[0.06]">
              <div className="h-14 w-14 shrink-0 rounded bg-white/5" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-full rounded bg-white/10" />
                <div className="h-1.5 w-1/3 rounded bg-amber-400/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ESTILOS_CONFIG = [
  {
    id: ESTILOS.CLASICO,
    titulo: 'Clasico',
    descripcion: 'Grid de tarjetas con acentos rosados. Ideal para catalogos visuales.',
    Preview: PreviewClasico,
  },
  {
    id: ESTILOS.MODERNO,
    titulo: 'Moderno',
    descripcion: 'Vista limpia con acentos ambar. Diseno minimalista y elegante.',
    Preview: PreviewModerno,
  },
]

function VistaTienda() {
  const { setEstilo } = useTiendaEstilo()

  const handleSeleccionar = (id) => {
    setEstilo(id)
    window.open(`${window.location.origin}/tienda?estilo=${id}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-8">
      <FormularioInformacionNegocio />

      <SectionCard title="Elige el estilo de tu tienda">
        <p className="mb-6 text-sm text-muted-foreground">
          Elige el estilo de tu tienda. Al hacer clic se abrirá la tienda en una nueva pestaña con el diseño seleccionado.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ESTILOS_CONFIG.map(({ id, titulo, descripcion, Preview }) => (
          <div
            key={id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] bg-muted/30 p-4">
              <Preview />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {descripcion}
              </p>
              <button
                type="button"
                onClick={() => handleSeleccionar(id)}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                Usar este estilo y abrir tienda
              </button>
            </div>
          </div>
        ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default VistaTienda
