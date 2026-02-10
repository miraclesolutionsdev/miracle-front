import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import LandingProductoPage from './components/LandingProductoPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<DashboardLayout />} />
      <Route path="/landing-producto/:id" element={<LandingProductoPage />} />
    </Routes>
  )
}

export default App
