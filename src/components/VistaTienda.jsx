function VistaTienda() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
      <p className="text-center text-muted-foreground">
        Abre la tienda en una nueva pestaña para ver el catálogo y compartir el enlace.
      </p>
      <button
        type="button"
        onClick={() => window.open(`${window.location.origin}/tienda`, '_blank', 'noopener,noreferrer')}
        className="rounded-xl bg-pink-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition-colors hover:bg-pink-600"
      >
        Ver tienda
      </button>
    </div>
  )
}

export default VistaTienda
