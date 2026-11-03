export class EliminarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new Error('Producto no encontrado');
    }
    await this.productoRepository.eliminar(id);
  }
}

