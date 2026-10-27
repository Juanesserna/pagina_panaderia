// Constantes del módulo Insumos. Sin colores: solo nombres del tema.

export const PAGE_SIZE = 8

export const filtrosVacios = {
  idCategoria: '',
  estado: '',
  nivelStock: '',
  idUnidadMedida: '',
  stockMinimoDesde: '',
  stockMinimoHasta: '',
}

export const formVacio = {
  nombre: '',
  idCategoria: '',
  idUnidadMedida: '',
  stockMinimo: '',
  estado: true,
}

// "estado" es BOOLEAN real (true = Activo, false = Inactivo).
export const estadoOptions = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
]

export const nivelStockOptions = [
  { value: 'bajo', label: 'Stock Bajo' },
  { value: 'normal', label: 'Stock Normal' },
  { value: 'sin', label: 'Sin Stock' },
]

// Estado visual (calculado) → variante de StatusBadge
export const estadoVisualVariant = {
  Activo: 'success',
  'Stock Bajo': 'warning',
  Inactivo: 'danger',
}
