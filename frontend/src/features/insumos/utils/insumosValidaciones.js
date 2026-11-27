// Validación en tiempo real del formulario de insumos.
// validarInsumo devuelve { campo: 'mensaje' } solo con los campos que tienen error.
// Para cambiar qué caracteres se aceptan, se edita SOLO este archivo.

// Nombre: letras (con tildes y ñ), números, espacios y . , - ( ) / %
const NOMBRE_INVALIDO = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,\-()\/%]/

function describirCaracter(c) {
  return /\s/.test(c) ? 'espacio' : c
}

export function validarInsumo(form, { editando = false } = {}) {
  const errores = {}

  // Al editar, nombre, unidad y stock mínimo están bloqueados: no se validan.
  if (!editando) {
    const nombre = String(form.nombre)
    if (!nombre.trim()) {
      errores.nombre = 'El nombre del insumo es obligatorio'
    } else {
      const mal = nombre.match(NOMBRE_INVALIDO)
      if (mal) errores.nombre = `Carácter no permitido: ${describirCaracter(mal[0])}`
    }

    if (!form.idUnidadMedida) errores.idUnidadMedida = 'Selecciona una unidad de medida'

    const stock = String(form.stockMinimo).trim()
    if (stock === '') errores.stockMinimo = 'El stock mínimo es obligatorio'
    else if (Number.isNaN(Number(stock))) errores.stockMinimo = 'Escribe un número válido'
    else if (Number(stock) < 0) errores.stockMinimo = 'El stock mínimo no puede ser negativo'
  }

  if (!form.idCategoria) errores.idCategoria = 'Selecciona una categoría'

  return errores
}
