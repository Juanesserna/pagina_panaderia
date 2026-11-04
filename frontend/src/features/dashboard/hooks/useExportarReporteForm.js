import { useState } from 'react'
import { MODULOS_EXPORTABLES } from '../constants/dashboard.constants'
import { rangoEsValido } from '../utils/dashboardHelpers'

// Estado del formulario "Exportar reporte".
// Se usa dentro de un componente que se monta cada vez que el modal abre, así siempre arranca limpio.
export function useExportarReporteForm() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [modulos, setModulos] = useState([])
  const [formato, setFormato] = useState('excel')

  const alternarModulo = (id) =>
    setModulos((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))

  const todosSeleccionados = modulos.length === MODULOS_EXPORTABLES.length
  const alternarTodos = () => setModulos(todosSeleccionados ? [] : MODULOS_EXPORTABLES.map((m) => m.id))

  const rangoValido = rangoEsValido(fechaInicio, fechaFin)

  return {
    fechaInicio,
    fechaFin,
    modulos,
    formato,
    setFechaInicio,
    setFechaFin,
    setFormato,
    alternarModulo,
    alternarTodos,
    todosSeleccionados,
    // las dos fechas elegidas pero en desorden
    rangoInvertido: Boolean(fechaInicio && fechaFin && !rangoValido),
    puedeExportar: rangoValido && modulos.length > 0,
    datos: { fechaInicio, fechaFin, modulos, formato },
  }
}
