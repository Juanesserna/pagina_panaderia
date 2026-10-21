// TEMPORAL: datos de ejemplo. En el paso de hooks/services esto deja de importarse desde la página.

// Receta de insumos por producto: cuánto de cada insumo se necesita por unidad producida.
// En una integración real esto vendría de la base de datos de formulaciones.
export const recetasProductos = {
  Jugo: [
    { nombre: 'Fruta (naranja)', cantidad: 0.3, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.02, unidad: 'kg' },
    { nombre: 'Agua', cantidad: 0.15, unidad: 'l' },
  ],
  Pan: [
    { nombre: 'Harina de trigo', cantidad: 0.1, unidad: 'kg' },
    { nombre: 'Levadura', cantidad: 0.005, unidad: 'kg' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.01, unidad: 'kg' },
  ],
  'Palito Q': [
    { nombre: 'Harina de maíz', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.03, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.005, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
  ],
  'Palito G': [
    { nombre: 'Harina de maíz', cantidad: 0.12, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.04, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.008, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.003, unidad: 'kg' },
  ],
  'Pastel P': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.06, unidad: 'kg' },
  ],
  'Pastel H': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Azúcar', cantidad: 0.08, unidad: 'kg' },
    { nombre: 'Chocolate', cantidad: 0.07, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.04, unidad: 'kg' },
  ],
  'Pastel A': [
    { nombre: 'Harina de trigo', cantidad: 0.15, unidad: 'kg' },
    { nombre: 'Huevo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Arequipe', cantidad: 0.09, unidad: 'kg' },
    { nombre: 'Mantequilla', cantidad: 0.04, unidad: 'kg' },
  ],
  'Palito GQ': [
    { nombre: 'Harina de maíz', cantidad: 0.1, unidad: 'kg' },
    { nombre: 'Queso en polvo', cantidad: 0.05, unidad: 'kg' },
    { nombre: 'Aceite vegetal', cantidad: 0.006, unidad: 'l' },
    { nombre: 'Sal', cantidad: 0.002, unidad: 'kg' },
    { nombre: 'Ajo en polvo', cantidad: 0.001, unidad: 'kg' },
  ],
}

// Calcula el total consolidado de insumos para todos los ítems de una orden,

// Catálogo de productos disponibles para armar una orden (panel "Nueva orden" / "Editar").
export const catalogoProductos = ['Jugo', 'Pan', 'Palito Q', 'Palito G', 'Pastel P', 'Pastel H', 'Pastel A', 'Palito GQ']

// Usuario actualmente autenticado en el sistema (operador que registra la orden manualmente
// desde este panel). En una integración real este dato debe obtenerse del contexto de
// autenticación / sesión activa, no de un valor fijo como aquí.
export const usuarioAutenticado = { nombre: 'Andrea Gómez', nit: '1020304050' }

export const initialOrdenes = [
  {
    id: 'OP-001',
    producto: 'Manual',
    items: [
      { nombre: 'Pan', cantidad: 3 },
      { nombre: 'Palito G', cantidad: 2 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 05:30',
    fechaFabricacion: '20/06/2026 06:15',
    estado: 'completado',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-002',
    producto: 'Pagina',
    items: [
      { nombre: 'Pastel A', cantidad: 20 },
      { nombre: 'Pastel P', cantidad: 10 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 06:00',
    fechaFabricacion: '20/06/2026 07:30',
    estado: 'completado',
    generadoPor: { nombre: 'Camila Restrepo', documento: '1098765432' },
    ventaId: '#2210',
  },
  {
    id: 'OP-003',
    producto: 'Manual',
    items: [{ nombre: 'Palito G', cantidad: 15 }],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 07:00',
    fechaFabricacion: '',
    estado: 'en proceso',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-004',
    producto: 'Manual',
    items: [
      { nombre: 'Jugo', cantidad: 10 },
      { nombre: 'Palito Q', cantidad: 10 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 08:30',
    fechaFabricacion: '',
    estado: 'en proceso',
    generadoPor: { nombre: 'Juan Pablo Restrepo', documento: '1015223344' },
  },
  {
    id: 'OP-005',
    producto: 'Pagina',
    items: [
      { nombre: 'Pastel H', cantidad: 40 },
      { nombre: 'Palito GQ', cantidad: 20 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 09:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Laura Jiménez', documento: '43215678' },
    ventaId: '#2210',
  },
  {
    id: 'OP-006',
    producto: 'Manual',
    items: [{ nombre: 'Palito Q', cantidad: 30 }],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 09:30',
    fechaFabricacion: '20/06/2026 12:00',
    estado: 'retrasado',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
  {
    id: 'OP-007',
    producto: 'Pagina',
    items: [
      { nombre: 'Palito GQ', cantidad: 20 },
      { nombre: 'Pastel H', cantidad: 20 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 10:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Mateo Salazar', documento: '71234567' },
    ventaId: '#2210',
  },
  {
    id: 'OP-008',
    producto: 'Manual',
    items: [
      { nombre: 'Jugo', cantidad: 6 },
      { nombre: 'Palito Q', cantidad: 4 },
    ],
    unidad: 'piezas',
    fechaSolicitud: '20/06/2026 11:00',
    fechaFabricacion: '',
    estado: 'pendiente',
    generadoPor: { nombre: 'Andrea Gómez', documento: '1020304050' },
  },
]
