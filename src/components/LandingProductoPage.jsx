import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { getProductoImagenSrc } from '../utils/api'

// Cambia este número por el tuyo en formato internacional, sin "+"
const WHATSAPP_NUMBER = '573001234567'

const WhatsAppIcon = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function LandingProductoPage() {
  const { id } = useParams()
  const { findProductoById } = useProductos()

  const producto = findProductoById(id)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [showWhatsappForm, setShowWhatsappForm] = useState(false)

  if (!producto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Producto no encontrado.</p>
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
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Columna izquierda: imagen(es) — protagonistas */}
          {producto.imagenes?.length > 0 && getProductoImagenSrc(producto, 0) && (
            <section className="space-y-5">
              <div className="flex min-h-0 w-full justify-center overflow-hidden rounded-2xl bg-neutral-900/80 shadow-2xl shadow-black/40 ring-1 ring-neutral-700/50">
                <img
                  src={getProductoImagenSrc(producto, 0)}
                  alt={producto.nombre}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              {producto.imagenes.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((idx) => getProductoImagenSrc(producto, idx)).filter(Boolean).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${producto.nombre} ${i + 2}`}
                      className="aspect-square w-full rounded-xl object-contain shadow-lg ring-1 ring-neutral-700/50"
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Columna derecha: título, precio, descripción, beneficios, CTA */}
          <div className="flex flex-col gap-8">
            <div className="rounded-2xl bg-neutral-900/60 p-8 shadow-xl ring-1 ring-neutral-800 sm:p-10">
              <span className="inline-flex rounded-full bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-400">
                {producto.tipo === 'servicio' ? 'Servicio' : 'Producto'}
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
                {producto.nombre}
              </h1>
              {producto.precio && (
                <p className="mt-4 text-2xl font-bold text-pink-400 sm:text-3xl">
                  {producto.precio}
                </p>
              )}
              <div className="mt-8 border-t border-neutral-700/80 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-400/90">
                  Descripción
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-300">
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {producto.usos?.length > 0 && (
                <div className="mt-8 border-t border-neutral-700/80 pt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-400/90">
                    Usos
                  </h2>
                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-neutral-300">
                    {producto.usos.map((uso, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                        {uso}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {producto.caracteristicas?.length > 0 && (
                <div className="mt-8 border-t border-neutral-700/80 pt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-400/90">
                    Características
                  </h2>
                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-neutral-300">
                    {producto.caracteristicas.map((c, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link
              to="/tienda"
              className="inline-flex w-full items-center justify-center rounded-xl bg-pink-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition-all hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Ver Tienda
            </Link>

            {/* Bloque WhatsApp */}
            <div className="rounded-2xl bg-neutral-900/60 p-6 shadow-xl ring-1 ring-neutral-800 sm:p-8">
              {!showWhatsappForm ? (
                <button
                  type="button"
                  onClick={() => setShowWhatsappForm(true)}
                  className="flex w-full flex-col items-center justify-center gap-5 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 py-12 transition-colors hover:border-emerald-500/70 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-neutral-950"
                  aria-label="Abrir formulario de contacto por WhatsApp"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg">
                    <WhatsAppIcon className="h-10 w-10" />
                  </div>
                  <span className="text-base font-semibold text-neutral-100">
                    Contáctanos por WhatsApp
                  </span>
                  <span className="text-sm text-neutral-400">
                    Haz clic para dejar tus datos y te redirigimos
                  </span>
                </button>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                      <WhatsAppIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        ¿Hablamos por WhatsApp?
                      </h2>
                      <p className="text-sm text-neutral-400">
                        Completa y te redirigimos al chat.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleWhatsapp} className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-neutral-200">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-neutral-200">
                        Número de celular
                      </label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="+57 300 000 0000"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2 focus:ring-offset-neutral-950"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        Ir a WhatsApp
                      </button>
                      <p className="text-xs text-neutral-500">
                        Usamos estos datos solo para el mensaje inicial en WhatsApp.
                      </p>
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={() => setShowWhatsappForm(false)}
                    className="mt-5 text-sm text-neutral-400 underline hover:text-neutral-200"
                  >
                    Volver al cuadro de contacto
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LandingProductoPage

