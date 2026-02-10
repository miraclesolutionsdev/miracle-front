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
    <main className="min-h-screen bg-background pt-10">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Cabecera producto */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">
              {producto.nombre}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
            </p>
          </div>
          {producto.precio && (
            <p className="text-2xl font-semibold text-primary">
              {producto.precio}
            </p>
          )}
        </header>

        {/* Galería */}
        {producto.imagenes?.length > 0 && (
          <section className="grid gap-3 sm:grid-cols-2">
            {producto.imagenes.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${producto.nombre} ${i + 1}`}
                className="h-64 w-full rounded-xl object-cover"
              />
            ))}
          </section>
        )}

        {/* Descripción */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-card-foreground">
            Descripción
          </h2>
          <p className="text-sm text-muted-foreground">
            {producto.descripcion || 'Sin descripción disponible.'}
          </p>
        </section>

        {/* Bloque WhatsApp */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                placeholder="+57 300 000 0000"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col items-start gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
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
    </main>
  )
}

export default LandingProductoPage

