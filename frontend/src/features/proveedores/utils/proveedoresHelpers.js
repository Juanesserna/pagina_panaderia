// "estado" es BOOLEAN real (true = Activo, false = Inactivo), sin niveles
// intermedios como en Insumos (que sí tiene "Stock Bajo").
export function getEstadoVisual(proveedor) {
  return proveedor.estado ? 'Activo' : 'Inactivo'
}

// Validación simple de formato: algo@dominio.ext (sin espacios).
export function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

// ── Búsqueda general ─────────────────────────────────────────────────────
// Campos de tb_proveedor en los que busca el buscador de la tabla.
const CAMPOS_BUSQUEDA = [
  'id',
  'nombre',
  'nit',
  'nombreContacto',
  'telefono',
  'email',
  'direccion',
  'descripcion',
]

// Minúsculas y sin tildes: "jimenez" encuentra "Jiménez".
function normalizar(valor) {
  return String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Solo letras y números: "310 234" encuentra "+57 310 234 5678"
// y "9001234567" encuentra "900.123.456-7".
function compactar(valor) {
  return normalizar(valor).replace(/[^a-z0-9]/g, '')
}

// Devuelve true si TODAS las palabras escritas en el buscador aparecen en
// alguno de los campos del proveedor (ej: "roberto trigal" encuentra a
// Roberto Jiménez de Molinos El Trigal).
export function coincideBusqueda(proveedor, texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return true

  const campos = CAMPOS_BUSQUEDA.map((c) => ({
    normal: normalizar(proveedor[c]),
    compacto: compactar(proveedor[c]),
  }))

  return palabras.every((palabra) => {
    const palabraCompacta = compactar(palabra)
    return campos.some(
      (c) =>
        c.normal.includes(palabra) ||
        (palabraCompacta && c.compacto.includes(palabraCompacta))
    )
  })
}
