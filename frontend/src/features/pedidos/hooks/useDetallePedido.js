import { useState } from 'react'
import { calcularResumenFinanciero } from '../utils/pedidosHelpers'

export function useDetallePedido() {
  const [pedido, setPedido] = useState(null)

  const abrir = (item) => setPedido(item)
  const cerrar = () => setPedido(null)

  const resumen = calcularResumenFinanciero(pedido)

  return {
    abierto: Boolean(pedido),
    pedido,
    resumen,
    abrir,
    cerrar,
  }
}

