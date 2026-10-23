// Constantes del módulo Proveedores. Sin colores: solo nombres del tema.

export const PAGE_SIZE = 8

export const filtrosVacios = {
  estado: '',
  nombre: '',
  nit: '',
  nombreContacto: '',
  email: '',
}

export const formVacio = {
  nombre: '',
  nit: '',
  nombreContacto: '',
  telefono: '',
  email: '',
  direccion: '',
  estado: true,
}

// "estado" es BOOLEAN real (true = Activo, false = Inactivo).
export const estadoOptions = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
]

// Estado visual → variante de StatusBadge
export const estadoVisualVariant = {
  Activo: 'success',
  Inactivo: 'danger',
}
