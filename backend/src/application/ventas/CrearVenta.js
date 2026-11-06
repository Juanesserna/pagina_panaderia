import { Venta } from '../../domain/ventas/Venta.js'
import { SinStockError, ValidationError } from '../../domain/shared/errors.js'

export class CrearVenta {
  constructor({ ventaRepository, catalogoClientes, catalogoProductos, reloj = () => new Date() }) {
    Object.assign(this, { ventaRepository, catalogoClientes, catalogoProductos, reloj })
  }

  // items del cliente: [{ nombre, cantidad }] → el precio y el stock los decide el servidor.
  async execute({ usuario, clienteNit, items, metodo, pagoDividido = false }) {
    const cliente = await this.catalogoClientes.buscarPorNit(clienteNit)
    if (!cliente) throw new ValidationError('Cliente no encontrado')
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('La venta debe tener al menos un producto')
    }

    // une líneas repetidas del mismo producto
    const pedido = new Map()
    for (const it of items) pedido.set(it.nombre, (pedido.get(it.nombre) ?? 0) + it.cantidad)

    const lineas = []
    for (const [nombre, cantidad] of pedido) {
      const producto = await this.catalogoProductos.buscarPorNombre(nombre)
      if (!producto) throw new ValidationError(`Producto no encontrado: ${nombre}`)
      if (producto.stock < cantidad) throw new SinStockError(producto.nombre)
      lineas.push({ nombre: producto.nombre, cantidad, precio: producto.precio })
    }

    const venta = Venta.crear({
      id: await this.ventaRepository.siguienteId(),
      usuario: usuario.nombre, cliente: cliente.nombre, nit: cliente.nit,
      items: lineas, metodo, pagoDividido, fechaHora: this.reloj(),
    })
    await this.ventaRepository.guardar(venta)
    await this.catalogoProductos.descontarStock(lineas)
    return venta
  }
}