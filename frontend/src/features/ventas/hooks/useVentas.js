import { useState } from 'react'
import { ventasService } from '../services/ventasService'
import { esTransicionValida } from '../utils/ventasHelpers'

// Fuente de verdad del listado de ventas y de sus mutaciones.
export function useVentas() {
  const [ventas, setVentas] = useState(() => ventasService.listarVentas())

  // Solo aplica el cambio si la transición de estado es válida
  const cambiarEstado = (id, nuevoEstado) => {
    setVentas((prev) =>
      prev.map((v) => (v.id !== id || !esTransicionValida(v.estado, nuevoEstado) ? v : { ...v, estado: nuevoEstado }))
    )
  }

  const marcarPagoParcial = (id) => cambiarEstado(id, 'pago parcial')

  const agregarVenta = (venta) => setVentas((prev) => [venta, ...prev])

  return { ventas, cambiarEstado, marcarPagoParcial, agregarVenta }
}
