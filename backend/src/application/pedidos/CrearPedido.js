import { Pedido } from '../../domain/pedidos/Pedido.js'
import { SinStockError, ValidationError } from '../../domain/shared/errors.js'

export class CrearPedido {
  constructor({ pedidoRepository, catalogoProductos, catalogoClientes }) {
    Object.assign(this, { pedidoRepository, catalogoProductos, catalogoClientes })
  }

  async execute({ usuario, clienteNit, items, metodo, pagoUnico = false, canal, notas }) {
    if (!usuario?.nombre) {
      throw new ValidationError('Usuario autenticado requerido para crear pedido')
    }

    let clienteNombre = 'Cliente general'
    let nit = clienteNit || 'NN'
    if (this.catalogoClientes && clienteNit) {
      const c = await this.catalogoClientes.buscarPorNit(clienteNit)
      if (c) {
        clienteNombre = c.nombre
        nit = c.nit
      }
    }

    const itemsConPrecio = []
    for (const i of items || []) {
      let precio = i.precio
      let nombre = i.nombre
      if (this.catalogoProductos) {
        const prod = await this.catalogoProductos.buscarPorNombre(i.nombre)
        if (!prod) {
          throw new ValidationError(`Producto no existe en catálogo: ${i.nombre}`)
        }
        if (typeof prod.stock === 'number' && prod.stock < i.cantidad) {
          throw new SinStockError(i.nombre)
        }
        precio = prod.precio
        nombre = prod.nombre
      }
      itemsConPrecio.push({ nombre, cantidad: i.cantidad, precio })
    }

    const id = await this.pedidoRepository.siguienteId()
    const pedido = Pedido.crear({
      id,
      usuario: usuario.nombre,
      cliente: clienteNombre,
      nit,
      items: itemsConPrecio,
      metodo,
      pagoUnico,
      canal,
      notas,
      fechaHora: new Date(),
    })

    await this.pedidoRepository.guardar(pedido)
    return pedido
  }
}

