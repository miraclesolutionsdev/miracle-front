import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardLayout from './components/DashboardLayout'
import LandingProductoPage from './components/LandingProductoPage'
import TiendaPage from './components/TiendaPage'
import Login from './components/Login'
import CrearTienda from './components/CrearTienda'
import IACopyResumenPage from './components/IACopyResumenPage'
import PagoResultado from './components/PagoResultado'
import { useAuth } from './context/AuthContext'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <>
    <Toaster richColors position="top-right" />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/crear-tienda" element={<CrearTienda />} />
      <Route path="/tienda" element={<TiendaPage />} />
      <Route path="/landing-producto/:id" element={<LandingProductoPage />} />
      <Route path="/pago/exitoso" element={<PagoResultado tipo="exitoso" />} />
      <Route path="/pago/fallido" element={<PagoResultado tipo="fallido" />} />
      <Route path="/pago/pendiente" element={<PagoResultado tipo="pendiente" />} />
      <Route
        path="/ia-resumen"
        element={
          <ProtectedRoute>
            <IACopyResumenPage />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
    </Routes>
    </>
  )
}

export default App
