import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import LandingProductoPage from './components/LandingProductoPage'
import TiendaPage from './components/TiendaPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/tienda" element={<TiendaPage />} />
      <Route path="/landing-producto/:id" element={<LandingProductoPage />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  )
}

export default App
