// Funciones puras del dominio "compras": no usan React ni acceden a datos.
// (Los generadores de id/lote usan Date/Math.random: son de "dominio", no de render.)
import { CATEGORIA_MIXTA, CATEGORIAS, ESTADO, estadoOptions } from '../constants/compras.constants'

const pad = (n) => String(n).padStart(2, '0')

// ---------- Texto y dinero ----------

// Minúsculas y sin tildes, para comparar/buscar texto
export const normalizarTexto = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

// 45000 → "$45.000"
export const formatearMoneda = (valor) => `$${(Number(valor) || 0).toLocaleString('es-CO')}`

// ---------- Catálogos ----------

// "PROV-001 - Harinas del Norte"
export const etiquetaProveedor = (proveedores, proveedorId) => {
  const p = proveedores.find((x) => x.id === proveedorId)
  return p ? `${p.id} - ${p.nombre}` : proveedorId
}

export const opcionesProveedor = (proveedores) =>
  proveedores.map((p) => ({ value: p.id, label: `${p.id} - ${p.nombre}` }))

export const opcionesInsumo = (insumos) => insumos.map((i) => ({ value: i.nombre, label: i.nombre }))

export const buscarInsumo = (insumos, nombre) => insumos.find((i) => i.nombre === nombre)

// La categoría de la orden se deriva de sus insumos: si todos son de la misma, esa; si hay varias, "Mixto".
export const derivarCategoria = (items, insumos) => {
  const categorias = new Set(items.map((i) => buscarInsumo(insumos, i.nombre)?.categoria).filter(Boolean))
  if (categorias.size === 0) return CATEGORIAS[0]
  if (categorias.size === 1) return [...categorias][0]
  return CATEGORIA_MIXTA
}

// ---------- Reglas de negocio ----------

// Pendiente puede ir a cualquiera; Parcial solo avanza a Recibida o se cancela (no retrocede);
// Recibida solo se cancela; Cancelada es definitiva.
export const esTransicionValida = (actual, nuevo) => {
  if (actual === nuevo) return true
  if (actual === ESTADO.CANCELADA) return false
  if (actual === ESTADO.RECIBIDA) return nuevo === ESTADO.CANCELADA
  if (actual === ESTADO.PARCIAL) return nuevo === ESTADO.RECIBIDA || nuevo === ESTADO.CANCELADA
  return true // actual === PENDIENTE
}

export const opcionesEstadoParaFila = (actual) => estadoOptions.filter((o) => esTransicionValida(actual, o.value))

// Subtotal de las líneas del formulario (cantidad × valor unitario)
export const calcularSubtotal = (items) => items.reduce((suma, i) => suma + i.cantidad * i.precioUnitario, 0)

export const calcularTotal = (subtotal, descuento = 0) => Math.round(subtotal * (1 - descuento / 100))

// Recalcula el total de una orden ya existente a partir de los subtotales de su detalle
export const recalcularTotal = (compra) =>
  calcularTotal(
    compra.detalle.reduce((suma, d) => suma + d.subtotal, 0),
    compra.descuento
  )

export const itemsSonValidos = (items) => items.every((i) => i.nombre && i.cantidad > 0 && i.precioUnitario > 0)

// ---------- Ids, lotes y fechas ----------

// Siguiente id disponible a partir de las compras existentes ("OC-045" → "OC-046")
export const siguienteIdCompra = (compras) => {
  const maxNum = compras.reduce((max, c) => Math.max(max, parseInt(c.id.replace('OC-', ''), 10) || 0), 0)
  return `OC-${String(maxNum + 1).padStart(3, '0')}`
}

export const generarNumeroLote = () => {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `LOTE-${ts}-${rand}`
}

// "dd/mm/yyyy" → Date
export const parseFechaCompra = (compra) => {
  const [d, m, y] = compra.fecha.split('/').map(Number)
  return new Date(y, m - 1, d)
}

export const fechaHoyFormateada = () => {
  const ahora = new Date()
  return `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()}`
}

// ---------- Formularios ----------

// Línea vacía del formulario "Nueva compra": arranca con el primer insumo del catálogo
export const crearItemVacio = (insumos) => {
  const base = insumos[0]
  return {
    nombre: base?.nombre ?? '',
    cantidad: 1,
    unidad: base?.unidad ?? 'kg',
    precioUnitario: 0,
    lote: generarNumeroLote(),
    fechaVencimiento: '',
  }
}

// Arma la orden que se guarda a partir de lo que el usuario llenó en el formulario
export const construirCompra = ({ id, fecha, proveedorId, estado, solicitante, descuento, items, insumos }) => ({
  id,
  fecha,
  proveedorId,
  categoria: derivarCategoria(items, insumos),
  estado,
  solicitante,
  descuento,
  total: calcularTotal(calcularSubtotal(items), descuento),
  detalle: items.map((i) => ({
    nombre: i.nombre,
    cantidad: i.cantidad,
    unidad: i.unidad,
    subtotal: i.cantidad * i.precioUnitario,
    lote: i.lote,
    fechaVencimiento: i.fechaVencimiento,
    cantidadDisponible: i.cantidad,
  })),
  notas: descuento > 0 ? `Descuento del ${descuento}% aplicado` : '',
})

// ---------- Filtros, orden y KPIs ----------

export const contarFiltrosActivos = (filtros) => Object.values(filtros).filter(Boolean).length

export const filtrarCompras = (compras, { busqueda, filtros, proveedores }) => {
  const q = normalizarTexto(busqueda.trim())
  const desde = filtros.fechaDesde ? new Date(`${filtros.fechaDesde}T00:00:00`) : null
  const hasta = filtros.fechaHasta ? new Date(`${filtros.fechaHasta}T23:59:59`) : null

  return compras.filter((c) => {
    if (q) {
      const texto = normalizarTexto(`${c.id} ${etiquetaProveedor(proveedores, c.proveedorId)} ${c.categoria}`)
      if (!texto.includes(q)) return false
    }
    if (filtros.estado && c.estado !== filtros.estado) return false
    if (filtros.categoria && c.categoria !== filtros.categoria) return false
    if (filtros.proveedorId && c.proveedorId !== filtros.proveedorId) return false
    if (desde || hasta) {
      const fecha = parseFechaCompra(c)
      if (desde && fecha < desde) return false
      if (hasta && fecha > hasta) return false
    }
    return true
  })
}

// Cada columna ordenable (misma "key" que la columna de la tabla) sabe extraer el valor comparable.
const accesoresOrden = {
  id: (c) => parseInt(c.id.replace(/\D/g, ''), 10) || 0,
  fecha: (c) => parseFechaCompra(c).getTime(),
  proveedor: (c) => c.proveedorId, // el id va primero en la etiqueta, así que ordena igual que antes
  total: (c) => c.total,
}

export const ordenarCompras = (compras, key, dir) => {
  const accesor = accesoresOrden[key]
  if (!accesor) return compras
  return [...compras].sort((a, b) => {
    const av = accesor(a)
    const bv = accesor(b)
    if (av < bv) return dir === 'asc' ? -1 : 1
    if (av > bv) return dir === 'asc' ? 1 : -1
    return 0
  })
}

// "Compras del mes" suma las órdenes del mes de `hoy`. Pendientes y Recibidas cuentan todas las órdenes
// (igual que antes). Los porcentajes de tendencia ya no existen: el KPICard de shared/ui no los muestra.
export const calcularKpis = (compras, hoy = new Date()) => {
  const delMes = compras.filter((c) => {
    const f = parseFechaCompra(c)
    return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
  })
  return {
    totalMes: delMes.reduce((suma, c) => suma + c.total, 0),
    pendientes: compras.filter((c) => c.estado === ESTADO.PENDIENTE).length,
    recibidas: compras.filter((c) => c.estado === ESTADO.RECIBIDA).length,
  }
}
