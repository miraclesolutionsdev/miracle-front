/**
 * Bloque de métodos de pago en la landing de producto.
 * Recibe { producto } para poder mostrar opciones por producto si aplica.
 */
function LandingMetodoPago({ producto }) {
  return (
    <div className="mt-6 border-t border-white/[0.06] pt-6">
      <p className="text-xs font-medium text-white/50">Métodos de pago</p>
      <p className="mt-1 text-sm text-white/70">
        Aceptamos transferencia, efectivo y otros medios. Contáctanos para confirmar.
      </p>
    </div>
  )
}

export default LandingMetodoPago
