// Datos de ejemplo (mock) del módulo "compras".
// TEMPORAL: se elimina cuando las pantallas lean de la API (ver services/comprasService.js).
// Aquí NO van constantes ni reglas de negocio: eso vive en constants/ y utils/.

// Catálogo de proveedores. Cuando exista el módulo real se reemplaza por la API.
export const PROVEEDORES = [
  { id: 'PROV-001', nombre: 'Harinas del Norte' },
  { id: 'PROV-002', nombre: 'Lácteos del Norte' },
  { id: 'PROV-003', nombre: 'Distribuidora Panera' },
  { id: 'PROV-004', nombre: 'Azúcares Centro' },
  { id: 'PROV-005', nombre: 'Empaques Medellín' },
]

// Catálogo de insumos con su unidad y categoría.
// La "unidad" NO es texto libre por línea de compra (así nadie escribe "Kg", "kg" o "KILOS" para el
// mismo insumo): se hereda del insumo elegido. Cuando el módulo de Insumos exponga su catálogo real,
// esto se reemplaza por esa data.
export const INSUMOS = [
  { nombre: 'Harina', unidad: 'kg', categoria: 'Materias primas' },
  { nombre: 'Azúcar', unidad: 'kg', categoria: 'Materias primas' },
  { nombre: 'Leche', unidad: 'lt', categoria: 'Lácteos' },
  { nombre: 'Café', unidad: 'kg', categoria: 'Materias primas' },
  { nombre: 'Aceite', unidad: 'lt', categoria: 'Materias primas' },
  { nombre: 'Arroz', unidad: 'kg', categoria: 'Materias primas' },
  { nombre: 'Sal', unidad: 'kg', categoria: 'Materias primas' },
  { nombre: 'Huevos', unidad: 'und', categoria: 'Lácteos' },
]

// TODO: este usuario debe venir de features/auth, no del mock de compras.
export const usuarioAutenticado = {
  nombre: 'Andrés Mesa',
}

// Forma de una orden de compra:
//  - fecha: "dd/mm/yyyy" · fechaVencimiento de cada lote: "yyyy-mm-dd" (o "" si no aplica)
//  - total y subtotal están en pesos (número, sin formato); el formato se aplica al mostrarlos
//  - descuento: porcentaje (0-100) aplicado sobre la suma de subtotales
//  - la cantidad de ítems NO se guarda: es detalle.length
export const initialCompras = [
  {
    id: 'OC-045',
    fecha: '22/06/2026',
    proveedorId: 'PROV-001',
    categoria: 'Materias primas',
    estado: 'Recibida',
    solicitante: 'Ana M.',
    descuento: 0,
    total: 45000,
    detalle: [
      { nombre: 'Harina de trigo', cantidad: 50, unidad: 'kg', subtotal: 35000, lote: 'LOTE-INIT-0001', fechaVencimiento: '2026-12-01', cantidadDisponible: 50 },
      { nombre: 'Harina integral', cantidad: 10, unidad: 'kg', subtotal: 10000, lote: 'LOTE-INIT-0002', fechaVencimiento: '2026-10-15', cantidadDisponible: 10 },
    ],
    notas: 'Entrega verificada en bodega central.',
  },
  {
    id: 'OC-044',
    fecha: '20/06/2026',
    proveedorId: 'PROV-002',
    categoria: 'Lácteos',
    estado: 'Parcial',
    solicitante: 'Luis R.',
    descuento: 0,
    total: 32000,
    detalle: [
      { nombre: 'Mantequilla', cantidad: 8, unidad: 'kg', subtotal: 20000, lote: 'LOTE-INIT-0003', fechaVencimiento: '2026-08-20', cantidadDisponible: 8 },
      { nombre: 'Leche entera', cantidad: 10, unidad: 'lt', subtotal: 12000, lote: 'LOTE-INIT-0004', fechaVencimiento: '2026-07-25', cantidadDisponible: 10 },
    ],
    notas: 'Pendiente confirmación del proveedor.',
  },
  {
    id: 'OC-043',
    fecha: '18/06/2026',
    proveedorId: 'PROV-003',
    categoria: 'Empaque',
    estado: 'Recibida',
    solicitante: 'Ana M.',
    descuento: 0,
    total: 58000,
    detalle: [
      { nombre: 'Bolsas kraft', cantidad: 500, unidad: 'und', subtotal: 28000, lote: 'LOTE-INIT-0005', fechaVencimiento: '', cantidadDisponible: 500 },
      { nombre: 'Cajas plegables', cantidad: 100, unidad: 'und', subtotal: 30000, lote: 'LOTE-INIT-0006', fechaVencimiento: '', cantidadDisponible: 100 },
    ],
    notas: '',
  },
]
