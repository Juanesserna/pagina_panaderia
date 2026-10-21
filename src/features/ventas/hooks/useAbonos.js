import { useMemo, useRef, useState } from 'react'
import { fechaHoyFormateada, pagosPermitidos } from '../utils/ventasHelpers'
import { calcularResumenPagos } from '../utils/ventasPagos'

// Pagos de una venta: 1 comprobante (100%) o 2 (50% c/u) si es encargo.
// Abono: { id, idVenta, slot (1 | 2), fecha, urlComprobante }
// onPagoParcial(idVenta): se llama cuando, tras subir un comprobante, aún queda saldo por pagar.
export function useAbonos({ onPagoParcial }) {
  const [abonos, setAbonos] = useState([])
  const [abierto, setAbierto] = useState(false)
  const [venta, setVenta] = useState(null)
  const inputRef = useRef(null)
  const slotRef = useRef(null)

  const abrir = (v) => {
    setVenta(v)
    setAbierto(true)
  }

  const cerrar = () => {
    setAbierto(false)
    setVenta(null)
    slotRef.current = null
  }

  // slot: 1 o 2. Sirve tanto para subir como para reemplazar el comprobante.
  const solicitarComprobante = (slot) => {
    slotRef.current = slot
    inputRef.current?.click()
  }

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files?.[0]
    const slot = slotRef.current
    e.target.value = ''
    slotRef.current = null
    if (!file || !slot || !venta || !file.type.startsWith('image/')) return

    const idVenta = venta.id
    // ¿Con este comprobante queda cubierto el 100% de la venta?
    const otrosComprobantes = abonos.filter((a) => a.idVenta === idVenta && a.slot !== slot).length
    const pagoCompleto = otrosComprobantes + 1 >= pagosPermitidos(venta)

    const reader = new FileReader()
    reader.onload = () => {
      const urlComprobante = reader.result
      setAbonos((prev) => {
        const existe = prev.some((a) => a.idVenta === idVenta && a.slot === slot)
        if (existe) {
          return prev.map((a) =>
            a.idVenta === idVenta && a.slot === slot ? { ...a, urlComprobante, fecha: fechaHoyFormateada() } : a
          )
        }
        return [
          ...prev,
          { id: `AB-${idVenta.replace('#', '')}-${slot}`, idVenta, slot, fecha: fechaHoyFormateada(), urlComprobante },
        ]
      })

      // Al subir una captura la venta pasa a "pago parcial" mientras aún quede saldo por pagar
      if (!pagoCompleto) onPagoParcial(idVenta)
    }
    reader.readAsDataURL(file)
  }

  const abonosDeVenta = useMemo(() => (venta ? abonos.filter((a) => a.idVenta === venta.id) : []), [abonos, venta])
  const resumen = useMemo(() => calcularResumenPagos(venta, abonosDeVenta), [venta, abonosDeVenta])
  const comprobanteDeSlot = (slot) => abonosDeVenta.find((a) => a.slot === slot)

  return {
    abierto,
    venta,
    abrir,
    cerrar,
    inputRef,
    solicitarComprobante,
    handleImagenSeleccionada,
    comprobanteDeSlot,
    ...resumen,
  }
}
