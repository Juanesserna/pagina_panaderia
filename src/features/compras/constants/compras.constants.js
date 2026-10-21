// Constantes y catálogos del dominio "compras".
// Son valores fijos (no datos de ejemplo): estados, categorías, paginación, filtros por defecto.

export const PAGE_SIZE = 8

// Duración (ms) de las notificaciones de confirmación
export const NOTIF_DURATION = 3000

// ---------- Estados de la orden ----------
// La BD (tb_detalle_compra.estado) maneja pendiente / parcial / recibido / cancelado.
export const ESTADO = {
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Parcial',
  RECIBIDA: 'Recibida',
  CANCELADA: 'Cancelada',
}

// Variante de <StatusBadge> según el estado de la orden
export const estadoVariant = {
  [ESTADO.RECIBIDA]: 'success',
  [ESTADO.PENDIENTE]: 'warning',
  [ESTADO.PARCIAL]: 'accent',
  [ESTADO.CANCELADA]: 'danger',
}

// Color del puntito de cada estado (nombre del tema, sirve directo en sx: bgcolor: estadoDotColor[estado])
export const estadoDotColor = {
  [ESTADO.RECIBIDA]: 'success.main',
  [ESTADO.PENDIENTE]: 'warning.main',
  [ESTADO.PARCIAL]: 'primary.main',
  [ESTADO.CANCELADA]: 'error.main',
}

export const estadoOptions = [
  { value: ESTADO.PENDIENTE, label: 'Pendiente' },
  { value: ESTADO.PARCIAL, label: 'Parcial' },
  { value: ESTADO.RECIBIDA, label: 'Recibida' },
  { value: ESTADO.CANCELADA, label: 'Cancelada' },
]

// ---------- Categorías ----------
// "Mixto" sirve para órdenes cuyos insumos pertenecen a más de una categoría
// (tb_compras no tiene categoría propia: es un dato derivado, ver derivarCategoria en utils/).
export const CATEGORIA_MIXTA = 'Mixto'
export const CATEGORIAS = ['Materias primas', 'Lácteos', 'Empaque', 'Herramientas', CATEGORIA_MIXTA]
export const categoriaOptions = CATEGORIAS.map((c) => ({ value: c, label: c }))

// ---------- Filtros ----------
export const filtrosVacios = {
  estado: '',
  categoria: '',
  proveedorId: '',
  fechaDesde: '',
  fechaHasta: '',
}
