// Constantes y catálogos del dominio "compras".
// Son valores fijos (no datos de ejemplo): estados, categorías, paginación, filtros por defecto.

export const PAGE_SIZE = 8

// Duración (ms) de las notificaciones de confirmación
export const NOTIF_DURATION = 3000

// ---------- Estados de la orden ----------
// Solo se manejan dos estados: Registrada y Anulado.
export const ESTADO = {
  REGISTRADA: 'Registrada',
  ANULADO: 'Anulado',
}

// Variante de <StatusBadge> según el estado de la orden
export const estadoVariant = {
  [ESTADO.REGISTRADA]: 'success',
  [ESTADO.ANULADO]: 'danger',
}

// Color del puntito de cada estado (nombre del tema, sirve directo en sx: bgcolor: estadoDotColor[estado])
export const estadoDotColor = {
  [ESTADO.REGISTRADA]: 'success.main',
  [ESTADO.ANULADO]: 'error.main',
}

export const estadoOptions = [
  { value: ESTADO.REGISTRADA, label: 'Registrada' },
  { value: ESTADO.ANULADO, label: 'Anulado' },
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
