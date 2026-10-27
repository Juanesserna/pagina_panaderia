import { useState } from 'react'

// Modal "Cambiar estado" de una venta. `cambiarEstado` viene de useVentas.
export function useCambiarEstado(cambiarEstado) {
  const [abierto, setAbierto] = useState(false)
  const [venta, setVenta] = useState(null)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)

  const abrir = (v) => {
    if (v.estado === 'cancelado') return
    setVenta(v)
    setEstadoSeleccionado(v.estado)
    setAbierto(true)
  }

  const cerrar = () => {
    setAbierto(false)
    setVenta(null)
    setEstadoSeleccionado(null)
  }

  const confirmar = () => {
    if (!venta || !estadoSeleccionado) return
    cambiarEstado(venta.id, estadoSeleccionado)
    cerrar()
  }

  return { abierto, venta, estadoSeleccionado, setEstadoSeleccionado, abrir, cerrar, confirmar }
}
