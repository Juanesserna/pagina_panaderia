// Constantes y catálogos del dominio "ventas".
// Son valores fijos (no datos de ejemplo): estados, métodos de pago, canales, paginación.

export const PAGE_SIZE = 8

// Variante de <StatusBadge> según el estado de la venta
export const estadoVariant = {
  completado: 'success',
  'en proceso': 'process',
  'pago parcial': 'process',
  pendiente: 'warning',
  anulado: 'danger',
}

// Color del puntito de cada estado (nombre del tema, sirve directo en sx: bgcolor: estadoDotColor[estado])
export const estadoDotColor = {
  completado: 'success.main',
  'en proceso': 'primary.main',
  pendiente: 'warning.main',
  'pago parcial': 'info.main',
  anulado: 'error.main',
}

export const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'pago parcial', label: 'Pago parcial' },
  { value: 'en proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'anulado', label: 'Anulado' },
]

// Métodos de pago: mismos valores que muestra la columna "Método" del listado y el filtro
export const metodoOptions = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
]

// Canales de venta (sin encargo)
export const canalOptions = [
  { value: 'pagina', label: 'Página' },
  { value: 'presencial', label: 'Presencial' },
]
