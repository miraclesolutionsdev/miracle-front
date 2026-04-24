import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './components/DashboardLayout'
import LandingProductoPage from './components/LandingProductoPage'
import TiendaPage from './components/TiendaPage'
import CartPage from './components/CartPage'
import Login from './components/Login'
import GlobalLogin from './components/GlobalLogin'
import CrearTienda from './components/CrearTienda'
import IACopyResumenPage from './components/IACopyResumenPage'
import PagoResultado from './components/PagoResultado'
import ServiciosPage from './components/ServiciosPage'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const { slug } = useParams()
  // Verificar también el token en sessionStorage para el caso donde
  // navigate() corrió antes de que login() actualizara el estado de React
  const hasToken = !!sessionStorage.getItem(`miracle_auth_${slug}`)
  if (loading && !hasToken) return null
  if (!isAuthenticated && !hasToken) return <Navigate to="/login" replace />
  return children
}

const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

function isCustomDomain() {
  const h = window.location.hostname
  return h !== 'localhost' && h !== MAIN_DOMAIN && h !== `www.${MAIN_DOMAIN}`
}

function App() {
  // Si el usuario entra desde un dominio custom (ej. venompharmacol.com),
  // mostrar directamente la tienda de ese tenant en cualquier path.
  if (isCustomDomain()) {
    return (
      <Routes>
        {/* En dominio custom el tenant ya está implícito en el hostname.
            La tienda vive en / y cada producto en /{productoId} */}
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/:productoId" element={<LandingProductoPage />} />
        <Route path="*" element={<TiendaPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      {/* Raíz = tienda de miraclesolutions */}
      <Route path="/" element={<TiendaPage defaultSlug="miraclesolutions" />} />

      {/* Página de información de la plataforma */}
      <Route path="/info-plataforma" element={<ServiciosPage />} />
      <Route path="/servicios" element={<Navigate to="/info-plataforma" replace />} />

      {/* Públicas globales */}
      <Route path="/login" element={<GlobalLogin />} />
      <Route path="/crear-tienda" element={<CrearTienda />} />
      <Route path="/pago/exitoso" element={<PagoResultado tipo="exitoso" />} />
      <Route path="/pago/fallido" element={<PagoResultado tipo="fallido" />} />
      <Route path="/pago/pendiente" element={<PagoResultado tipo="pendiente" />} />

      {/* Rutas por tenant — /:slug/... */}
      <Route path="/:slug/login" element={<Login />} />
      <Route path="/:slug/tienda" element={<TiendaPage />} />
      <Route path="/:slug/tienda/:productoId" element={<LandingProductoPage />} />
      <Route path="/:slug/carrito" element={<CartPage />} />
      <Route
        path="/:slug/plataforma/ia-resumen"
        element={<ProtectedRoute><IACopyResumenPage /></ProtectedRoute>}
      />
      <Route
        path="/:slug/plataforma/*"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      />

      {/* Redirects de compatibilidad */}
      <Route path="/plataforma/*" element={<Navigate to="/miraclesolutions/plataforma" replace />} />
      <Route path="/tienda" element={<Navigate to="/" replace />} />

      {/* Landing de producto de miraclesolutions desde la raíz — debe ir al final */}
      <Route path="/:productoId" element={<LandingProductoPage defaultSlug="miraclesolutions" />} />
    </Routes>
  )
}

export default App
