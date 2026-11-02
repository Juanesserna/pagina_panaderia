import { useState, useRef } from 'react'
import { calcularResumenFinanciero, pagosPermitidos } from '../utils/pedidosHelpers'

export function useAbonosPedido({ onRegistrarAbono } = {}) {
  const [pedido, setPedido] = useState(null)
  const [slotActivo, setSlotActivo] = useState(null)
  const inputRef = useRef(null)

  const abrir = (item) => {
    setPedido(item)
    setSlotActivo(null)
  }

  const cerrar = () => {
    setPedido(null)
    setSlotActivo(null)
  }

  const solicitarComprobante = (slot) => {
    setSlotActivo(slot)
    inputRef.current?.click()
  }

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files?.[0]
    if (!file || !pedido || !slotActivo) return

    const reader = new FileReader()
    reader.onload = async () => {
      const url = reader.result
      await onRegistrarAbono?.(pedido.id, slotActivo, url)
      // Actualiza referencia local del pedido
      setPedido((prev) => {
        if (!prev) return null
        const abonos = prev.abonos ? [...prev.abonos] : []
        const idx = abonos.findIndex((a) => a.slot === slotActivo)
        const nuevoAbono = {
          id: `AB-${String(prev.id).replace(/\D/g, '') || prev.id}-${slotActivo}`,
          slot: slotActivo,
          monto: prev.total / (prev.pagoUnico ? 1 : 2),
          urlComprobante: url,
          fecha: new Date().toLocaleString(),
        }
        if (idx >= 0) abonos[idx] = nuevoAbono
        else abonos.push(nuevoAbono)
        return { ...prev, abonos }
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const comprobanteDeSlot = (slot) => {
    return pedido?.abonos?.find((a) => a.slot === slot) || null
  }

  const resumen = calcularResumenFinanciero(pedido)
  const cantidadPagos = pagosPermitidos(pedido)
  const slots = Array.from({ length: cantidadPagos }, (_, i) => i + 1)
  const montoPorPago = cantidadPagos > 0 ? (pedido?.total || 0) / cantidadPagos : (pedido?.total || 0)

  return {
    abierto: Boolean(pedido),
    pedido,
    abrir,
    cerrar,
    inputRef,
    solicitarComprobante,
    handleImagenSeleccionada,
    comprobanteDeSlot,
    cantidadPagos,
    slots,
    montoPorPago,
    totalPedido: resumen.totalPedido,
    totalPagado: resumen.totalPagado,
    diferenciaPorPagar: resumen.diferenciaPorPagar,
    porcentajePagado: resumen.porcentajePagado,
  }
}

