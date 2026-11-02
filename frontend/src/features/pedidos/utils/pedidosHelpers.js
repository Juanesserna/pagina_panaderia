import { estadoOptions } from '../constants/pedidos.constants'

const pad = (n) => String(n).padStart(2, '0')

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

export const normalizarTexto = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const contieneCaracterEspecial = (texto) => /[^a-zA-Z0-9À-ÿ\s]/.test(texto || '')

// Comprobantes / pagos permitidos (pagoUnico = true -> 1 pago 100%, false -> 2 abonos 50%)
export const pagosPermitidos = (pedido) => (pedido?.pagoUnico === false ? 2 : 1)

// Tarea 4: Bloqueo estricto si está Anulado
export const esTransicionValida = (estadoActual, nuevoEstado) => {
  if (estadoActual === nuevoEstado) return true
  if (estadoActual === 'anulado') return false // No permite cambios una vez anulado
  if (estadoActual === 'completado') return nuevoEstado === 'anulado'
  return true
}

export const opcionesEstadoParaFila = (estadoActual) =>
  estadoOptions.filter((o) => esTransicionValida(estadoActual, o.value))

export const obtenerNombreCliente = (pedido) => {
  if (pedido.origen === 'manual') {
    return pedido.cliente?.trim() || 'Cliente general'
  }
  return pedido.usuario || 'Cliente general'
}

export const siguienteIdPedido = (pedidos = []) => {
  const maxNum = pedidos.reduce((max, p) => {
    const n = parseInt(String(p.id || '').replace(/\D/g, ''), 10) || 0
    return Math.max(max, n)
  }, 100)
  return String(maxNum + 1)
}

export const fechaHoyFormateada = () => {
  const ahora = new Date()
  return `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()}`
}

export const horaActualFormateada = () => {
  const ahora = new Date()
  return `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`
}

export const productoSinStock = (producto) => {
  if (!producto) return false
  if (typeof producto.stock === 'number') return producto.stock <= 0
  return normalizarTexto(producto.nombre) === 'pan frances'
}

// Tarea 5: Visualizar resumen financiero del pedido
export function calcularResumenFinanciero(pedido, abonosLista = null) {
  const totalPedido = Number(pedido?.total) || 0
  const abonos = abonosLista ?? pedido?.abonos ?? []

  if (!abonos || abonos.length === 0) {
    return {
      totalPedido,
      totalPagado: 0,
      diferenciaPorPagar: totalPedido,
      cantidadAbonos: 0,
      porcentajePagado: 0,
      estaPagadoTotalmente: false,
    }
  }

  const cantidadPagos = pagosPermitidos(pedido)
  const montoPorPago = cantidadPagos > 0 ? totalPedido / cantidadPagos : totalPedido

  const totalPagado = abonos.reduce((sum, a) => {
    const val = typeof a.monto === 'number' && a.monto > 0 ? a.monto : montoPorPago
    return sum + val
  }, 0)

  const diferenciaPorPagar = Math.max(totalPedido - totalPagado, 0)
  const porcentajePagado = totalPedido > 0 ? Math.min(Math.round((totalPagado / totalPedido) * 100), 100) : 0

  return {
    totalPedido,
    totalPagado,
    diferenciaPorPagar,
    cantidadAbonos: abonos.length,
    cantidadPagos,
    montoPorPago,
    porcentajePagado,
    estaPagadoTotalmente: diferenciaPorPagar <= 0,
  }
}
