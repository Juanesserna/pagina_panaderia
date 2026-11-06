// Datos de ejemplo (mock) del módulo "dashboard".
// TEMPORAL: se elimina cuando las pantallas lean de la API (ver services/dashboardService.js).
// Aquí NO van constantes ni reglas de negocio: eso vive en constants/ y utils/.
// Los importes están en pesos (número, sin formato); el formato se aplica al mostrarlos.

// Resumen de los KPIs que no dependen del rango de fechas
export const kpisMock = {
  ventasDelMes: 319330,
  pedidosActivos: 127,
  pedidosListos: 34,
  minutosDesdeActualizacion: 2,
}

// id: número del pedido (se muestra como "#2851"; así no se confunde con un color #hex en el linter)
export const pedidosRecientes = [
  { id: 2851, cliente: 'María López', productos: 'Pan integral ×3, Croissant ×2', total: 285, estado: 'completado', hora: '09:42' },
  { id: 2850, cliente: 'Carlos Ruiz', productos: 'Pastel de chocolate (1kg)', total: 520, estado: 'en proceso', hora: '09:35' },
  { id: 2849, cliente: 'Ana García', productos: 'Galletas surtidas ×4', total: 160, estado: 'completado', hora: '09:18' },
  { id: 2848, cliente: 'José Martínez', productos: 'Baguette ×2, Empanadas ×6', total: 340, estado: 'pendiente', hora: '09:05' },
  { id: 2847, cliente: 'Laura Sánchez', productos: 'Torta de jamón, Café americano', total: 185, estado: 'completado', hora: '08:52' },
  { id: 2846, cliente: 'Pedro Flores', productos: 'Donas glaseadas ×12', total: 210, estado: 'cancelado', hora: '08:40' },
]

// tendencia: variación porcentual frente al mes anterior
export const productosMasVendidos = [
  { name: 'Pan integral', unidades: 847, ingresos: 12705, tendencia: 12 },
  { name: 'Pastel chocolate', unidades: 234, ingresos: 9360, tendencia: 8 },
  { name: 'Croissant mantequilla', unidades: 612, ingresos: 7650, tendencia: 5 },
  { name: 'Empanada queso', unidades: 490, ingresos: 5880, tendencia: -3 },
  { name: 'Galletas surtidas', unidades: 380, ingresos: 4180, tendencia: 14 },
]

// ---------- Generador de la serie diaria de ventas/compras ----------
// Datos simulados pero deterministas (misma fecha → mismo valor). En la API real, esto lo devuelve el backend.

const pseudoRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const dateSeed = (d) => d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()

const generarRegistroDia = (date) => {
  const dow = date.getDay()
  const seed = dateSeed(date)
  const weekendBoost = dow === 0 || dow === 6 ? 18000 : dow === 5 ? 9000 : 0
  const base = 32000 + weekendBoost
  const variance = (pseudoRandom(seed) - 0.5) * 16000
  const ventas = Math.max(8000, Math.round(base + variance))

  const comprasBase = 19000 + (pseudoRandom(seed + 7) - 0.5) * 9000
  const monthTrend = date.getMonth() * 250
  const compras = Math.max(6000, Math.round(comprasBase + monthTrend))

  return { date: new Date(date), ventas, compras }
}

// [{ date, ventas, compras }] un registro por día entre start y end (ambos incluidos)
export const generarSerieDiaria = (start, end) => {
  const serie = []
  const actual = new Date(start)
  while (actual.getTime() <= end.getTime()) {
    serie.push(generarRegistroDia(actual))
    actual.setDate(actual.getDate() + 1)
  }
  return serie
}
