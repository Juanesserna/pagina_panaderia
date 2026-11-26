import { NotFoundError, ValidationError } from '../../domain/shared/errors.js'
import { Producto } from '../../domain/productos/Producto.js'
import { validarNombreUnico, validarComponentes, validarQueNoSeInactivaEnUso } from './validacionesProducto.js'

// El stock actual no se edita aquí (D8) y el tipo no se puede cambiar (RN-06)
const CAMPOS_EDITABLES = [
  'nombre', 'categoria', 'precio', 'esVendible', 'stockMinimo',
  'cantMinimaProduccion', 'cantMaximaProduccion', 'estado', 'receta', 'imagen',
]

export class ActualizarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id, datosProducto) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }

    if (datosProducto.tipo !== undefined && datosProducto.tipo !== existente.tipo) {
      throw new ValidationError('El tipo del producto no puede modificarse una vez creado.');
    }

    const cambios = {};
    for (const campo of CAMPOS_EDITABLES) {
      if (datosProducto[campo] !== undefined) cambios[campo] = datosProducto[campo];
    }

    if (cambios.nombre !== undefined) {
      await validarNombreUnico(this.productoRepository, cambios.nombre, existente.id);
    }
    if (cambios.estado === 'INACTIVO' && existente.estado !== 'INACTIVO') {
      await validarQueNoSeInactivaEnUso(this.productoRepository, existente);
    }

    // El constructor valida todo; si algo falla, el producto original queda intacto
    const candidato = new Producto({ ...existente, ...cambios });
    await validarComponentes(this.productoRepository, candidato);

    return await this.productoRepository.actualizar(candidato);
  }
}