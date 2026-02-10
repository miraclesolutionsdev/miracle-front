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

            {/* Bloque WhatsApp - personalizado */}
            <section className="rounded-2xl border border-border border-l-4 border-l-[#25D366] bg-card p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    ¿Hablamos por WhatsApp?
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Te contestamos al instante para resolver dudas y ayudarte con este producto.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleWhatsapp}
                className="mt-5 grid gap-3 sm:grid-cols-2"
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
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#20BD5A]"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Usamos estos datos solo para responder por WhatsApp.
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

