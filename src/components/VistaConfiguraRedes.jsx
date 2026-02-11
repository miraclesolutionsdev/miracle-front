import SectionCard from './SectionCard'

function VistaConfiguraRedes() {
  return (
    <div className="space-y-6">
      <SectionCard title="Configura tus redes">
        <div className="space-y-6">
          {/* Bloque: Activos Publicitarios */}
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-card-foreground">
              Activos Publicitarios
            </h3>

            <div className="mt-4 space-y-4">
              {/* Select de activos publicitarios */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  Activos publicitarios
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona un activo publicitario</option>
                  <option value="pixel-1">Pixel Web - Sitio principal</option>
                  <option value="pixel-2">Pixel Web - Landing campañas</option>
                  <option value="catalogo-1">Catálogo de productos</option>
                </select>
              </div>

              {/* Select de cuentas publicitarias */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  Seleccionar cuenta publicitaria
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Buscar Cuentas Publicitarias</option>
                  <option value="cuenta-1">Cuenta Ads #1</option>
                  <option value="cuenta-2">Cuenta Ads #2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bloque: Canales de Redes Sociales */}
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-card-foreground">
              Canales de Redes Sociales
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Selecciona los canales en los que quieres publicar tus anuncios.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Página de Facebook */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  Página de Facebook
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona una página</option>
                  <option value="fb-page-1">Página Facebook #1</option>
                  <option value="fb-page-2">Página Facebook #2</option>
                </select>
              </div>

              {/* WhatsApp Business */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  WhatsApp Business
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona un número de WhatsApp Business</option>
                  <option value="wa-1">WhatsApp Business #1</option>
                  <option value="wa-2">WhatsApp Business #2</option>
                </select>
              </div>

              {/* Cuenta de Instagram */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground">
                  Cuenta de Instagram
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona una cuenta de Instagram</option>
                  <option value="ig-1">@tu_cuenta_1</option>
                  <option value="ig-2">@tu_cuenta_2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bloque: Canal Web */}
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-card-foreground">
              Canal Web
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Agrega estos datos si publicarás anuncios para Web.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* URL del sitio web */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  URL del sitio web
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona una URL</option>
                  <option value="site-1">https://tusitio.com</option>
                  <option value="site-2">https://landing.tusitio.com</option>
                </select>
              </div>

              {/* Pixel de Facebook */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-muted-foreground">
                  Pixel de Facebook
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecciona un pixel</option>
                  <option value="pixel-1">Pixel Web - Sitio principal</option>
                  <option value="pixel-2">Pixel Web - Landing campañas</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default VistaConfiguraRedes
