import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingProductoPage from './components/store/LandingProductoPage'
import TiendaPage from './components/store/TiendaPage'
import CartPage from './components/store/CartPage'
import Login from './components/auth/Login'
import GlobalLogin from './components/auth/GlobalLogin'
import CrearTienda from './components/public/CrearTienda'
import IACopyResumenPage from './components/ai/IACopyResumenPage'
import PagoResultado from './components/store/PagoResultado'
import ServiciosPage from './components/public/ServiciosPage'
import PoliticaGarantia from './components/policies/PoliticaGarantia'
import Contactanos from './components/public/Contactanos'
import PoliticaReembolso from './components/policies/PoliticaReembolso'
import PoliticaEnvio from './components/policies/PoliticaEnvio'
import MetodosPago from './components/public/MetodosPago'
import BlogPage from './components/blog/BlogPage'
import BlogArticulo from './components/blog/BlogArticulo'
import { isCustomDomain } from './utils/api'
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

function App() {
  // Si el usuario entra desde un dominio custom (ej. venompharmacol.com),
  // mostrar directamente la tienda de ese tenant en cualquier path.
  if (isCustomDomain()) {
    return (
      <Routes>
        {/* En dominio custom el tenant ya está implícito en el hostname.
            La tienda vive en / y cada producto en /{productoId} */}
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:articuloId" element={<BlogArticulo />} />
        <Route path="/politicas/garantia" element={<PoliticaGarantia />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/politicas/reembolso" element={<PoliticaReembolso />} />
        <Route path="/politicas/envio" element={<PoliticaEnvio />} />
        <Route path="/metodos-pago" element={<MetodosPago />} />
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
      <Route path="/:slug/tienda/blog" element={<BlogPage />} />
      <Route path="/:slug/tienda/blog/:articuloId" element={<BlogArticulo />} />
      <Route path="/:slug/tienda/politicas/garantia" element={<PoliticaGarantia />} />
      <Route path="/:slug/tienda/contactanos" element={<Contactanos />} />
      <Route path="/:slug/tienda/politicas/reembolso" element={<PoliticaReembolso />} />
      <Route path="/:slug/tienda/politicas/envio" element={<PoliticaEnvio />} />
      <Route path="/:slug/tienda/metodos-pago" element={<MetodosPago />} />
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
