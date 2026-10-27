// Datos de ejemplo que se muestran cuando el producto no trae insumos ni historial
export const insumosEjemplo = (codigoProducto) => [
  { id: 1, idProducto: codigoProducto, idInsumo: 'I-001', insumo: 'Harina de trigo', cantidad: 500, unidad: 'kg' },
  { id: 2, idProducto: codigoProducto, idInsumo: 'I-002', insumo: 'Mantequilla', cantidad: 200, unidad: 'kg' },
  { id: 3, idProducto: codigoProducto, idInsumo: 'I-003', insumo: 'Sal', cantidad: 10, unidad: 'kg' },
  { id: 4, idProducto: codigoProducto, idInsumo: 'I-004', insumo: 'Levadura', cantidad: 5, unidad: 'kg' },
  { id: 5, idProducto: codigoProducto, idInsumo: 'I-005', insumo: 'Agua', cantidad: 300, unidad: 'L' },
]

export const historialEjemplo = (estado) => [
  { id: 1, texto: 'Registro creado', autor: 'Admin AlHorno' },
  { id: 2, texto: `Estado: ${estado ?? 'Activo'}`, autor: 'Admin AlHorno' },
]