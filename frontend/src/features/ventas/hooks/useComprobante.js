import { useMemo, useState } from 'react'
import { ventasService } from '../services/ventasService'

// Modal "Comprobante de venta". La venta se deriva de `ventas` por id,
// así siempre refleja el estado actual sin sincronizar copias.
export function useComprobante(ventas) {
  const [abierto, setAbierto] = useState(false)
  const [ventaId, setVentaId] = useState(null)

  const venta = useMemo(() => ventas.find((v) => v.id === ventaId) ?? null, [ventas, ventaId])
  const productos = useMemo(() => (venta ? ventasService.obtenerDetalleVenta(venta) : []), [venta])

  const abrir = (v) => {
    setVentaId(v.id)
    setAbierto(true)
  }

  const cerrar = () => setAbierto(false)

  return { abierto, venta, productos, abrir, cerrar }
}
