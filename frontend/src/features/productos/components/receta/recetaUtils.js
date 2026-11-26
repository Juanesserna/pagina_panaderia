// Formato de línea de receta del backend:
// { origen: 'INSUMO'|'PRODUCTO', idComponente (número), nombre, cantidad (número > 0), unidad (texto) }

export const filaHaciaApi = (fila) => ({
  origen: fila.origen ?? 'INSUMO',
  idComponente: Number(fila.idComponente ?? fila.idInsumo),
  nombre: fila.nombre ?? fila.insumo,
  cantidad: Number(fila.cantidad),
  unidad: fila.unidad,
})

export const filasHaciaApi = (filas) => filas.map(filaHaciaApi)

// Clave única de un componente de la receta para detectar duplicados
export const claveComponente = (fila) => `${fila.origen ?? 'INSUMO'}:${fila.idComponente ?? fila.idInsumo}`

// Etiqueta legible del origen de un componente
export const etiquetaOrigen = (origen) => (origen === 'PRODUCTO' ? 'Producto' : 'Insumo')

// Asigna un id local a cada línea que viene del backend (el backend no lo envía)
export const filasDesdeApi = (receta) => (Array.isArray(receta) ? receta : []).map((linea, i) => ({ id: i + 1, ...linea }))