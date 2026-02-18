import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ProductosProvider } from './context/ProductosContext.jsx'
import { TiendaEstiloProvider } from './context/TiendaEstiloContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProductosProvider>
          <TiendaEstiloProvider>
            <App />
          </TiendaEstiloProvider>
        </ProductosProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
