import { useEffect, useState } from 'react'

export default function IACopyResumenPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('miracle_ia_resumen')
      if (!raw) return
      setData(JSON.parse(raw))
    } catch {
      // ignorar errores de parseo
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-card-foreground flex items-center justify-center px-4">
        <p className="max-w-md text-center text-sm text-muted-foreground">
          No hay una selección de ángulo y copys guardada. Vuelve al asistente IA,
          selecciona un ángulo, genera los copys y usa el botón
          &nbsp;
          <span className="font-medium">“Seleccionar ángulo y copys”</span>
          &nbsp;
          para abrir esta vista.
        </p>
      </div>
    )
  }

  const { producto, angulo, copys } = data

  return (
    <div className="min-h-screen bg-background text-card-foreground px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Resumen de campaña IA
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {producto?.nombre || 'Producto'}
            </h1>
          </div>
          {producto?.descripcion && (
            <p className="text-sm text-muted-foreground">
              {producto.descripcion}
            </p>
          )}
          <div className="mt-2 rounded-lg border border-border bg-card px-4 py-3 space-y-1">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              Ángulo seleccionado
            </p>
            <p className="text-sm font-semibold">
              {angulo?.nombre || 'Sin nombre'}
            </p>
            {angulo?.descripcion && (
              <p className="text-sm text-muted-foreground">
                {angulo.descripcion}
              </p>
            )}
          </div>
        </header>

        <main className="space-y-4">
          {Array.isArray(copys) && copys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {copys.map((c, idx) => (
                <article
                  key={idx}
                  className="rounded-lg border border-border bg-card p-4 space-y-2"
                >
                  {c.etapa && (
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      {c.etapa === 'TOF' && 'TOF · Top of Funnel'}
                      {c.etapa === 'MOF' && 'MOF · Middle of Funnel'}
                      {c.etapa === 'BOF' && 'BOF · Bottom of Funnel'}
                    </p>
                  )}
                  {c.idea_central && (
                    <p className="text-xs text-muted-foreground">
                      Idea central: {c.idea_central}
                    </p>
                  )}
                  <p className="text-sm font-semibold">
                    {c.copy?.titulo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {c.copy?.cuerpo}
                  </p>
                  {c.copy?.cta && (
                    <p className="text-xs font-medium text-primary">
                      CTA: {c.copy.cta}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se encontraron copys en la selección guardada.
            </p>
          )}
        </main>
      </div>
    </div>
  )
}

