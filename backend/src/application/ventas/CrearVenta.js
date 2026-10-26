import { Venta } from '../../domain/ventas/Venta.js'
import { SinStockError, ValidationError } from '../../domain/ventas/errors.js'

export class CrearVenta {
  constructor({ ventaRepository, catalogoClientes, catalogoProductos, reloj = () => new Date() }) {
    Object.assign(this, { ventaRepository, catalogoClientes, catalogoProductos, reloj })
  }

  // items del cliente: [{ nombre, cantidad }] → el precio y el stock los decide el servidor.
  async execute({ usuario, clienteNit, items, metodo, pagoDividido = false }) {
    const cliente = await this.catalogoClientes.buscarPorNit(clienteNit)
    if (!cliente) throw new ValidationError('Cliente no encontrado')
    if (!Array.isArray(items) || items.length === 0) throw new ValidationError('La venta debe tener al menos un producto')

    const lineas = []
    for (const it of items) {
      const producto = await this.catalogoProductos.buscarPorNombre(it.nombre)
      if (!producto) throw new ValidationError(`Producto no encontrado: ${it.nombre}`)
      if (producto.stock <= 0) throw new SinStockError(producto.nombre)
      lineas.push({ nombre: producto.nombre, cantidad: it.cantidad, precio: producto.precio })
    }

    const venta = Venta.crear({
      id: await this.ventaRepository.siguienteId(),
      usuario: usuario.nombre, cliente: cliente.nombre, nit: cliente.nit,
      items: lineas, metodo, pagoDividido, fechaHora: this.reloj(),
    })
    await this.ventaRepository.guardar(venta)
    return venta
  }
}
