/**
 * Cabecera llamativa de la tienda: logo (o placeholder), nombre con efecto, eslogan y descripción.
 * Reutilizable en TiendaEstiloClasico y TiendaEstiloModerno.
 * variant: 'clasico' (acentos rosa) | 'moderno' (acentos ámbar)
 */
export default function TiendaHeader({ tenant, variant = 'clasico' }) {
  const name = tenant?.nombre || 'Tienda'
  const slogan = tenant?.eslogan || ''
  const description = tenant?.descripcion || ''
  const logoUrl = tenant?.logoUrl

  const isClasico = variant === 'clasico'
  const accent = {
    gradient: isClasico
      ? 'from-white via-white to-pink-200/90'
      : 'from-white via-white to-amber-200/90',
    bar: isClasico ? 'bg-pink-500' : 'bg-amber-500',
    slogan: isClasico ? 'text-pink-200/90' : 'text-amber-200/90',
    ring: isClasico ? 'ring-pink-500/30' : 'ring-amber-500/30',
  }

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header
      className={`relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-xl ring-1 ${accent.ring} sm:mb-12`}
      style={{
        padding: 'clamp(32px, 6vw, 48px) clamp(24px, 4vw, 48px)',
      }}
    >
      {/* Barra de acento inferior */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${accent.bar}`}
        aria-hidden
      />

      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        {/* Logo: siempre visible (imagen o placeholder) */}
        <div className="flex shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg sm:h-24 sm:w-24"
            />
          ) : (
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold shadow-lg ring-2 ring-white/20 sm:h-24 sm:w-24 sm:text-3xl ${
                isClasico
                  ? 'bg-pink-500/20 text-pink-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {initials || 'T'}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1
            className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-5xl`}
            style={{ letterSpacing: '-0.03em' }}
          >
            {name}
          </h1>
          {slogan && (
            <p
              className={`mt-2 text-base font-medium leading-relaxed sm:text-lg ${accent.slogan}`}
            >
              {slogan}
            </p>
          )}
        </div>
      </div>

      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-neutral-400 sm:mt-6 sm:text-left">
          {description}
        </p>
      )}
    </header>
  )
}
