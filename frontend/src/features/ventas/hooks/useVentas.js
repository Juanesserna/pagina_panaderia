import { useState } from 'react'
import { ventasService } from '../services/ventasService'
import { esTransicionValida } from '../utils/ventasHelpers'

// Fuente de verdad del listado de ventas y de sus mutaciones.
export function useVentas() {
  const [ventas, setVentas] = useState(() => ventasService.listarVentas())

  // Solo aplica el cambio si la transición de estado es válida y cuenta con permisos
  const cambiarEstado = async (id, nuevoEstado, options = {}) => {
    const ventaActual = ventas.find((v) => v.id === id)
    if (!ventaActual) return { ok: false, error: 'Venta no encontrada' }

    if (!esTransicionValida(ventaActual.estado, nuevoEstado)) {
      return { ok: false, error: `No se puede pasar de "${ventaActual.estado}" a "${nuevoEstado}"` }
    }

    if (nuevoEstado === 'anulado') {
      const usuario = ventasService.obtenerUsuarioActual()
      const rol = (usuario?.rol || '').toLowerCase()
      const esAdmin = rol === 'admin' || rol === 'gerente'
      if (!esAdmin) {
        return { ok: false, error: 'Solo el Administrador o Gerente tiene permisos para anular ventas' }
      }
      if (!options.password || options.password.trim().length === 0) {
        return { ok: false, error: 'Debe ingresar la contraseña de administrador' }
      }
    }

    setVentas((prev) =>
      prev.map((v) => (v.id !== id ? v : { ...v, estado: nuevoEstado }))
    )
    return { ok: true }
  }

  const marcarPagoParcial = (id) => cambiarEstado(id, 'pago parcial')

  const agregarVenta = (venta) => setVentas((prev) => [venta, ...prev])

  return { ventas, cambiarEstado, marcarPagoParcial, agregarVenta }
}
