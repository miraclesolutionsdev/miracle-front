import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'

// Cambia este número por el tuyo en formato internacional, sin "+"
const WHATSAPP_NUMBER = '573001234567'

function LandingProductoPage() {
  const { id } = useParams()
  const { findProductoById } = useProductos()

  const producto = findProductoById(id)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')

  if (!producto) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
      </main>
    )
  }

  const handleWhatsapp = (e) => {
    e.preventDefault()
    const base = `https://wa.me/${WHATSAPP_NUMBER}`

    const texto = [
      'Hola, estoy interesado en el siguiente producto:',
      `Producto: ${producto.nombre}`,
      producto.precio ? `Precio mostrado: ${producto.precio}` : '',
      nombre ? `Mi nombre: ${nombre}` : '',
      telefono ? `Mi número de contacto: ${telefono}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const url = `${base}?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-background py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
          {/* Columna izquierda: imagen(es) */}
          {producto.imagenes?.length > 0 && (
            <section className="space-y-3">
              <div className="overflow-hidden rounded-2xl bg-muted/30 shadow-lg">
                <img
                  src={producto.imagenes[0]}
                  alt={producto.nombre}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              {producto.imagenes.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {producto.imagenes.slice(1, 4).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${producto.nombre} ${i + 2}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Columna derecha: título, precio, descripción */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                {producto.nombre}
              </h1>
              {producto.precio && (
                <p className="mt-2 text-xl font-semibold text-primary sm:text-2xl">
                  {producto.precio}
                </p>
              )}
              <div className="mt-4 border-t border-border pt-4">
                <h2 className="text-sm font-semibold text-card-foreground">
                  Descripción
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>
            </div>

            {/* Bloque WhatsApp */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-card-foreground">
                ¿Hablamos por WhatsApp?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Te contestamos casi al instante para resolver dudas y ayudarte a activar este producto.
              </p>

              <form
                onSubmit={handleWhatsapp}
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Número de celular
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="+57 300 000 0000"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1 sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Contactar por WhatsApp
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Usamos estos datos solo para responder tu mensaje por WhatsApp.
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LandingProductoPage

