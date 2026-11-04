// Funciones puras del dominio "dashboard": no usan React ni acceden a datos.
import {
  AGRUPACION,
  ESTADO_PEDIDO,
  MAX_DIAS_AGRUPACION_DIARIA,
  MAX_DIAS_AGRUPACION_SEMANAL,
  MS_DAY,
  NOMBRES_DIA_CORTO,
  NOMBRES_MES_CORTO,
} from '../constants/dashboard.constants'

// ---------- Texto y dinero ----------

export const capitalizar = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// 319330 → "$319.330"
export const formatearMoneda = (valor) => `$${(Number(valor) || 0).toLocaleString('es-CO')}`

// ---------- Fechas ----------

// Date → "yyyy-mm-dd" (valor de <input type="date">)
export const toInputValue = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// "yyyy-mm-dd" → Date (a las 00:00 locales)
export const fromInputValue = (value) => {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

// Date → "14 oct"
export const formatearFechaCorta = (d) => `${d.getDate()} ${NOMBRES_MES_CORTO[d.getMonth()].toLowerCase()}`

// "14 oct - 20 oct"
export const etiquetaDeRango = (rango) => `${formatearFechaCorta(rango.start)} - ${formatearFechaCorta(rango.end)}`

export const diasEntreInclusive = (start, end) => {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const b = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((b.getTime() - a.getTime()) / MS_DAY) + 1
}

// Últimos N días terminando hoy
export const rangoUltimosDias = (dias) => {
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  const start = new Date(end)
  start.setDate(start.getDate() - (dias - 1))
  return { start, end }
}

// Identifica un rango (sirve para saber a qué rango pertenecen unos datos)
export const claveDeRango = (rango) => `${toInputValue(rango.start)}_${toInputValue(rango.end)}`

// Ambas fechas ("yyyy-mm-dd") elegidas y inicio <= fin
export const rangoEsValido = (inicio, fin) => Boolean(inicio && fin && fromInputValue(inicio).getTime() <= fromInputValue(fin).getTime())

// ---------- Agrupación de la serie ----------

export const modoAgrupacion = (start, end) => {
  const dias = diasEntreInclusive(start, end)
  if (dias <= MAX_DIAS_AGRUPACION_DIARIA) return AGRUPACION.DIA
  if (dias <= MAX_DIAS_AGRUPACION_SEMANAL) return AGRUPACION.SEMANA
  return AGRUPACION.MES
}

const agruparPorDia = (dias) =>
  dias.map((d) => ({ name: `${NOMBRES_DIA_CORTO[d.date.getDay()]} ${d.date.getDate()}`, ventas: d.ventas, compras: d.compras }))

const agruparPorSemana = (dias) => {
  if (dias.length === 0) return []
  const inicio = dias[0].date.getTime()
  const semanas = new Map()
  dias.forEach((d) => {
    const idx = Math.floor((d.date.getTime() - inicio) / (7 * MS_DAY))
    const actual = semanas.get(idx)
    if (actual) {
      actual.ventas += d.ventas
      actual.compras += d.compras
    } else {
      semanas.set(idx, { name: `Semana ${idx + 1}`, ventas: d.ventas, compras: d.compras })
    }
  })
  return Array.from(semanas.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)
}

const agruparPorMes = (dias) => {
  if (dias.length === 0) return []
  const meses = new Map()
  dias.forEach((d) => {
    const key = `${d.date.getFullYear()}-${d.date.getMonth()}`
    const order = d.date.getFullYear() * 12 + d.date.getMonth()
    const actual = meses.get(key)
    if (actual) {
      actual.ventas += d.ventas
      actual.compras += d.compras
    } else {
      meses.set(key, { name: NOMBRES_MES_CORTO[d.date.getMonth()], ventas: d.ventas, compras: d.compras, order })
    }
  })
  const lista = Array.from(meses.values()).sort((a, b) => a.order - b.order)
  const anios = new Set(lista.map((m) => Math.floor(m.order / 12)))
  // Si el rango cruza de año, el nombre del mes lleva el año ("Dic 25")
  return lista.map((m) => ({
    name: anios.size > 1 ? `${m.name} ${String(Math.floor(m.order / 12)).slice(-2)}` : m.name,
    ventas: m.ventas,
    compras: m.compras,
  }))
}

// [{ date, ventas, compras }] → [{ name, ventas, compras }] según el modo
export const agruparSerie = (dias, modo) => {
  if (modo === AGRUPACION.DIA) return agruparPorDia(dias)
  if (modo === AGRUPACION.SEMANA) return agruparPorSemana(dias)
  return agruparPorMes(dias)
}

export const sumarCompras = (serieAgrupada) => serieAgrupada.reduce((suma, item) => suma + item.compras, 0)

// ---------- Pedidos ----------

export const resumirPedidos = (pedidos) => ({
  total: pedidos.length,
  completados: pedidos.filter((p) => p.estado === ESTADO_PEDIDO.COMPLETADO).length,
  enCurso: pedidos.filter((p) => p.estado === ESTADO_PEDIDO.PENDIENTE || p.estado === ESTADO_PEDIDO.EN_PROCESO).length,
})
