import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTiendaEstilo, ESTILOS } from '../context/TiendaEstiloContext.jsx'
import TiendaEstiloClasico from './TiendaEstiloClasico'
import TiendaEstiloModerno from './TiendaEstiloModerno'

export default function TiendaPage() {
  const [searchParams] = useSearchParams()
  const { estilo, setEstilo } = useTiendaEstilo()

  const paramEstilo = searchParams.get('estilo')
  const estiloActual = paramEstilo === ESTILOS.MODERNO ? ESTILOS.MODERNO : paramEstilo === ESTILOS.CLASICO ? ESTILOS.CLASICO : estilo

  useEffect(() => {
    if (paramEstilo === ESTILOS.MODERNO || paramEstilo === ESTILOS.CLASICO) {
      setEstilo(paramEstilo)
    }
  }, [paramEstilo, setEstilo])

  if (estiloActual === ESTILOS.MODERNO) {
    return <TiendaEstiloModerno />
  }

  return <TiendaEstiloClasico />
}
