// Constantes y catálogos del módulo "pedidos"
export const PAGE_SIZE = 8

// Variante de <StatusBadge> según el estado del pedido
export const estadoVariant = {
  completado: 'success',
  'en proceso': 'process',
  'pago parcial': 'process',
  pendiente: 'warning',
  anulado: 'danger', // Tarea 4: Estado Anulado (reemplaza Cancelado)
}

// Color del puntito de cada estado (compatible con sx del tema de MUI)
export const estadoDotColor = {
  completado: 'success.main',
  'en proceso': 'primary.main',
  pendiente: 'warning.main',
  'pago parcial': 'info.main',
  anulado: 'error.main', // Tarea 4
}

// Opciones de estado (consistencia global: no existe 'cancelado')
export const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'pago parcial', label: 'Pago parcial' },
  { value: 'en proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'anulado', label: 'Anulado' },
]

export const metodoOptions = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
]

export const canalOptions = [
  { value: 'encargo', label: 'Encargo' },
  { value: 'pagina', label: 'Página' },
  { value: 'presencial', label: 'Presencial' },
]

