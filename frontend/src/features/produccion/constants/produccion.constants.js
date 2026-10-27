export const PAGE_SIZE = 6

// Variante de StatusBadge por estado de la orden.
export const estadoVariant = {
  completado: 'success',
  'en proceso': 'accent',
  pendiente: 'warning',
  retrasado: 'danger',
  cancelado: 'danger',
}

export const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'retrasado', label: 'Retrasado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export const origenOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Pagina', label: 'Página' },
]

// Una orden con 2 días o más desde su solicitud, sin estado final, se muestra como 'retrasado'.
export const DOS_DIAS_MS = 2 * 24 * 60 * 60 * 1000
