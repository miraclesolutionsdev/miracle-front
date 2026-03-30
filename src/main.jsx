import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductosProvider } from './context/ProductosContext.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductosProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </ProductosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
