import { ValidationError } from '../shared/errors.js'

export const TIPOS = ['TERMINADO', 'INTERMEDIO']
const ESTADOS_GUARDADOS = ['ACTIVO', 'INACTIVO']
const ORIGENES = ['INSUMO', 'PRODUCTO']
const PREFIJO_CODIGO = { TERMINADO: 'PT', INTERMEDIO: 'PI' }

const generarCodigo = (tipo, id) => `${PREFIJO_CODIGO[tipo] ?? 'PR'}-${String(id).padStart(4, '0')}`

export class Producto {
  constructor({
    id, codigo, nombre, categoria, precio = 0, stock, estado = 'ACTIVO',
    tipo = 'TERMINADO', esVendible = true,
    stockMinimo = 0, cantMinimaProduccion = 1, cantMaximaProduccion = 100,
    receta = [], imagen = null,
  }) {
    this.id = id
    this.codigo = codigo ?? generarCodigo(tipo, id)
    this.nombre = nombre
    this.categoria = categoria
    this.tipo = tipo
    this.esVendible = esVendible
    this.precio = Number(precio)
    this.stock = Number(stock)
    this.stockMinimo = Number(stockMinimo)
    this.cantMinimaProduccion = Number(cantMinimaProduccion)
    this.cantMaximaProduccion = Number(cantMaximaProduccion)
    this.estado = estado // guardado: ACTIVO | INACTIVO. "Agotado" se calcula
    this.receta = receta // líneas: { origen, idComponente, nombre, cantidad, unidad }
    this.imagen = imagen

    this.validar()
  }

  // Agotado = activo con stock en cero. Un inactivo sigue viéndose inactivo
  get estadoEfectivo() {
    if (this.estado === 'INACTIVO') return 'INACTIVO'
    return this.stock <= 0 ? 'AGOTADO' : 'ACTIVO'
  }

  toJSON() {
    return { ...this, estado: this.estadoEfectivo, activo: this.estado === 'ACTIVO' }
  }

  usaComponente(idProducto) {
    return this.receta.some((l) => l.origen === 'PRODUCTO' && Number(l.idComponente) === Number(idProducto))
  }

  validar() {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new ValidationError('El nombre del producto es obligatorio.')
    }
    if (!TIPOS.includes(this.tipo)) {
      throw new ValidationError(`Tipo no válido. Permitidos: ${TIPOS.join(', ')}`)
    }
    if (typeof this.esVendible !== 'boolean') {
      throw new ValidationError('El campo vendible debe ser verdadero o falso.')
    }
    if (this.tipo === 'TERMINADO' && !this.esVendible) {
      throw new ValidationError('Un producto Terminado siempre es vendible.')
    }
    if (!ESTADOS_GUARDADOS.includes(this.estado)) {
      throw new ValidationError(`Estado no válido. Permitidos: ${ESTADOS_GUARDADOS.join(', ')}`)
    }
    if (isNaN(this.precio) || this.precio < 0) {
      throw new ValidationError('El precio del producto debe ser un número válido mayor o igual a 0.')
    }
    if (this.esVendible && !(this.precio > 0)) {
      throw new ValidationError('El precio de venta debe ser mayor a 0 cuando el producto es vendible.')
    }
    if (!Number.isInteger(this.stock) || this.stock < 0) {
      throw new ValidationError('El stock debe ser un número entero mayor o igual a 0.')
    }
    if (!Number.isInteger(this.stockMinimo) || this.stockMinimo < 0) {
      throw new ValidationError('El stock mínimo debe ser un número entero mayor o igual a 0.')
    }
    if (!Number.isInteger(this.cantMinimaProduccion) || this.cantMinimaProduccion <= 0) {
      throw new ValidationError('La cantidad mínima de producción debe ser un entero mayor a 0.')
    }
    if (!Number.isInteger(this.cantMaximaProduccion) || this.cantMaximaProduccion <= 0) {
      throw new ValidationError('La cantidad máxima de producción debe ser un entero mayor a 0.')
    }
    if (this.cantMinimaProduccion > this.cantMaximaProduccion) {
      throw new ValidationError('La cantidad mínima de producción no puede superar la máxima.')
    }
    this.validarReceta()
  }

  validarReceta() {
    if (!Array.isArray(this.receta)) {
      throw new ValidationError('La receta debe ser una lista.')
    }
    const vistos = new Set()
    for (const linea of this.receta) {
      if (!ORIGENES.includes(linea?.origen)) {
        throw new ValidationError('Cada componente de la receta debe ser un insumo o un producto.')
      }
      if (linea.idComponente === undefined || linea.idComponente === null || linea.idComponente === '') {
        throw new ValidationError('Cada componente de la receta debe tener un identificador.')
      }
      if (!(Number(linea.cantidad) > 0)) {
        throw new ValidationError('La cantidad de cada componente debe ser mayor a 0.')
      }
      if (!linea.unidad) {
        throw new ValidationError('Cada componente de la receta debe tener unidad de medida.')
      }
      const clave = `${linea.origen}:${linea.idComponente}`
      if (vistos.has(clave)) {
        throw new ValidationError('No se puede repetir un componente en la receta.')
      }
      vistos.add(clave)
      if (linea.origen === 'PRODUCTO' && Number(linea.idComponente) === Number(this.id)) {
        throw new ValidationError('Una receta no puede contener al propio producto.')
      }
    }
    if (this.tipo === 'INTERMEDIO' && this.receta.some((l) => l.origen === 'PRODUCTO')) {
      throw new ValidationError('Un producto Intermedio solo puede contener insumos en su receta.')
    }
  }

  cambiarEstado(nuevoEstado) {
    if (!ESTADOS_GUARDADOS.includes(nuevoEstado)) {
      throw new ValidationError(`Estado no válido. Permitidos: ${ESTADOS_GUARDADOS.join(', ')}`)
    }
    this.estado = nuevoEstado
  }

  actualizarStock(cantidad) {
    const nuevoStock = this.stock + cantidad
    if (nuevoStock < 0) {
      throw new ValidationError('Stock insuficiente para realizar la operación.')
    }
    this.stock = nuevoStock
  }
}