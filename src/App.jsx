import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import LandingProductoPage from './components/LandingProductoPage'
import LandingPlataforma from './components/LandingPlataforma'
import TiendaPage from './components/TiendaPage'
import Login from './components/Login'
import CrearTienda from './components/CrearTienda'
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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/crear-tienda" element={<CrearTienda />} />
      <Route path="/tienda" element={<TiendaPage />} />
      <Route path="/landing-producto/:id" element={<LandingProductoPage />} />
      <Route path="/landing" element={<LandingPlataforma />} />
      <Route path="/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
