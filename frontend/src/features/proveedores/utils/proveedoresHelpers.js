// "estado" es BOOLEAN real (true = Activo, false = Inactivo), sin niveles
// intermedios como en Insumos (que sí tiene "Stock Bajo").
export function getEstadoVisual(proveedor) {
  return proveedor.estado ? 'Activo' : 'Inactivo'
}

// Validación simple de formato: algo@dominio.ext (sin espacios).
export function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}
