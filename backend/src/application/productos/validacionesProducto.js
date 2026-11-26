import { ValidationError } from '../../domain/shared/errors.js'

const nombres = (productos) => productos.map((p) => p.nombre).join(', ')

// RN-10: el nombre es único entre todos los productos
export async function validarNombreUnico(repo, nombre, idExcluir = null) {
  const otro = await repo.buscarPorNombre(nombre)
  if (otro && otro.id !== idExcluir) {
    throw new ValidationError(`Ya existe un producto con el nombre "${otro.nombre}".`)
  }
}

// RN-03 y RN-09: un producto solo puede usar como componente un Intermedio activo y con receta
export async function validarComponentes(repo, producto) {
  for (const linea of producto.receta) {
    if (linea.origen !== 'PRODUCTO') continue
    const comp = await repo.buscarPorId(linea.idComponente)
    if (!comp) {
      throw new ValidationError(`El componente "${linea.nombre ?? linea.idComponente}" no existe.`)
    }
    if (comp.tipo !== 'INTERMEDIO') {
      throw new ValidationError(`"${comp.nombre}" no es un producto Intermedio y no puede usarse como componente.`)
    }
    if (comp.estado !== 'ACTIVO') {
      throw new ValidationError(`"${comp.nombre}" está inactivo y no puede usarse como componente.`)
    }
    if (comp.receta.length === 0) {
      throw new ValidationError(`"${comp.nombre}" no tiene receta y no puede usarse como componente.`)
    }
  }
}

// RN-08 (inactivar): un Intermedio no se inactiva si está en recetas de productos activos
export async function validarQueNoSeInactivaEnUso(repo, producto) {
  if (producto.tipo !== 'INTERMEDIO') return
  const usan = (await repo.buscarQueUsan(producto.id)).filter((p) => p.estado === 'ACTIVO')
  if (usan.length > 0) {
    throw new ValidationError(`No se puede inactivar "${producto.nombre}": se usa en la receta de ${nombres(usan)}.`)
  }
}

// RN-08 (eliminar): no se elimina un producto que sea componente de otra receta
export async function validarQueNoSeUsaComoComponente(repo, producto) {
  const usan = await repo.buscarQueUsan(producto.id)
  if (usan.length > 0) {
    throw new ValidationError(`No se puede eliminar "${producto.nombre}": se usa en la receta de ${nombres(usan)}.`)
  }
}