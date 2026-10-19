// Funciones puras del dominio "ventas": no usan React ni acceden a datos.
import { estadoOptions } from '../constants/ventas.constants'

const pad = (n) => String(n).padStart(2, '0')

// ---------- Texto ----------

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// Minúsculas y sin tildes, para comparar/buscar texto
export const normalizarTexto = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const contieneCaracterEspecial = (texto) => /[^a-zA-Z0-9À-ÿ\s]/.test(texto || '')

// ---------- Reglas de negocio ----------

// Comprobantes permitidos según pagoUnico:
// - pagoUnico = true  → 1 comprobante (100%)
// - pagoUnico = false → 2 comprobantes (50% c/u)
export const pagosPermitidos = (venta) => (venta?.pagoUnico === false ? 2 : 1)

export const esTransicionValida = (estadoActual, nuevoEstado) => {
  if (estadoActual === nuevoEstado) return true
  if (estadoActual === 'cancelado') return false
  if (estadoActual === 'completado') return nuevoEstado === 'cancelado'
  return true
}

export const opcionesEstadoParaFila = (estadoActual) =>
  estadoOptions.filter((o) => esTransicionValida(estadoActual, o.value))

export const obtenerNombreCliente = (venta) => {
  if (venta.origen === 'manual') {
    return venta.cliente?.trim() || 'Cliente no especificado'
  }
  return venta.usuario
}

// Siguiente id disponible a partir de las ventas existentes ("#2851" → "#2852")
export const siguienteIdVenta = (ventas) => {
  const maxNum = ventas.reduce((max, v) => Math.max(max, parseInt(v.id.replace('#', ''), 10) || 0), 0)
  return `#${maxNum + 1}`
}

// ---------- Fechas ----------

export const parseFechaVenta = (venta) => {
  const [d, m, y] = venta.fecha.split('/').map(Number)
  const [hh, mm] = (venta.hora || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export const fechaHoyFormateada = () => {
  const ahora = new Date()
  return `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()}`
}

export const horaActualFormateada = () => {
  const ahora = new Date()
  return `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`
}
