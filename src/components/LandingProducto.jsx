function LandingProducto({ producto, onCerrar }) {
  if (!producto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-border bg-card shadow-lg">
        <div className="border-b border-border p-6 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-card-foreground">
              {producto.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">
              {producto.clienteNombre ? `${producto.clienteNombre} · ` : ''}
              {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
            </p>
            {producto.precio && (
              <p className="text-xl font-semibold text-primary">
                {producto.precio}
              </p>
            )}
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

        <div className="p-6 space-y-6">
          {producto.imagenes?.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {producto.imagenes.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${producto.nombre} ${i + 1}`}
                  className="h-56 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-card-foreground">
              Descripción
            </h2>
            <p className="text-sm text-muted-foreground">
              {producto.descripcion || 'Sin descripción disponible.'}
            </p>
          </section>

          {producto.landing && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-card-foreground">
                Landing asociada
              </h2>
              <a
                href={producto.landing}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {producto.landing}
              </a>
            </section>
          )}

          {producto.vistaTienda && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-card-foreground">
                Vista de tienda / referencia
              </h2>
              <a
                href={producto.vistaTienda}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {producto.vistaTienda}
              </a>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingProducto

