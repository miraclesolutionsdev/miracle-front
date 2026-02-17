import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext.jsx'
import { TiendaEstiloProvider } from './context/TiendaEstiloContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProductosProvider>
        <TiendaEstiloProvider>
          <App />
        </TiendaEstiloProvider>
      </ProductosProvider>
    </BrowserRouter>
  </StrictMode>,
)
