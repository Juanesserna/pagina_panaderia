export class ListarProductos {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository
  }

  async execute({ buscar, categoria, estado, pagina = 1, limite = 10 } = {}) {
    const { datos, ...meta } = await this.productoRepository.buscarConFiltros({
      buscar, categoria, estado, pagina: Number(pagina), limite: Number(limite),
    })
    return { ...meta, items: datos }
  }
}