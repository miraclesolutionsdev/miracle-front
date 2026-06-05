import { useEffect } from 'react'

export default function ImageLightbox({ imagenes, indiceActual, onClose, onIndexChange, getNombreProducto }) {
  // Si no hay imágenes o índice inválido, no renderizar
  if (!Array.isArray(imagenes) || imagenes.length === 0 || indiceActual < 0 || indiceActual >= imagenes.length) {
    return null
  }

  const imagenActual = imagenes[indiceActual]
  const tieneMultiples = imagenes.length > 1

  const irAnterior = () => {
    if (indiceActual > 0 && onIndexChange) onIndexChange(indiceActual - 1)
  }

  const irSiguiente = () => {
    if (indiceActual < imagenes.length - 1 && onIndexChange) onIndexChange(indiceActual + 1)
  }

  // Cerrar con ESC, navegar con flechas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') irAnterior()
      if (e.key === 'ArrowRight') irSiguiente()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [indiceActual, imagenes.length])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Contenedor de la imagen */}
      <div
        className="relative max-h-screen w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen principal */}
        <div className="flex items-center justify-center">
          <img
            src={typeof imagenActual === 'string' ? imagenActual : imagenActual.url || imagenActual}
            alt="Imagen ampliada"
            className="max-h-[90vh] max-w-full object-contain"
          />
        </div>

        {/* Botón cerrar (X en esquina superior derecha) */}
        <button
          onClick={onClose}
          className="absolute -right-12 -top-12 text-white hover:text-gray-300 text-3xl font-light transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Navegación si hay múltiples imágenes */}
        {tieneMultiples && (
          <>
            {/* Botón anterior */}
            {indiceActual > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  irAnterior()
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:text-gray-300 text-3xl font-light transition-colors"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
            )}

            {/* Botón siguiente */}
            {indiceActual < imagenes.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  irSiguiente()
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:text-gray-300 text-3xl font-light transition-colors"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            )}

            {/* Indicadores de página */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imagenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === indiceActual ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute top-4 right-4 text-white text-sm font-light">
              {indiceActual + 1} / {imagenes.length}
            </div>
          </>
        )}

        {/* Nombre del producto (si se proporciona) */}
        {getNombreProducto && (
          <div className="absolute top-4 left-4 text-white font-light max-w-xs truncate">
            {getNombreProducto()}
          </div>
        )}
      </div>

      {/* Hint: ESC para cerrar */}
      <div className="absolute bottom-4 left-4 text-white/50 text-xs font-light">
        Presiona ESC para cerrar
      </div>
    </div>
  )
}
