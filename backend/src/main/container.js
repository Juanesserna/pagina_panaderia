// Composition root: único lugar donde se conectan implementaciones concretas con casos de uso.
import { InMemoryVentaRepository } from '../infrastructure/ventas/InMemoryVentaRepository.js'
import { InMemoryCatalogoClientes, InMemoryCatalogoProductos } from '../infrastructure/catalogos/InMemoryCatalogos.js'
import { ProductoRepositoryInMemory } from '../infrastructure/catalogos/productoRepositoryInMemory.js'
import { ListarVentas } from '../application/ventas/ListarVentas.js'
import { ObtenerVenta } from '../application/ventas/ObtenerVenta.js'
import { CrearVenta } from '../application/ventas/CrearVenta.js'
import { CambiarEstadoVenta } from '../application/ventas/CambiarEstadoVenta.js'
import { RegistrarAbono } from '../application/ventas/RegistrarAbono.js'
import { ListarProductos } from '../application/productos/ListarProductos.js'
import { CrearProducto } from '../application/productos/CrearProducto.js'
import { ActualizarProducto } from '../application/productos/ActualizarProducto.js'
import { CambiarEstadoProducto } from '../application/productos/CambiarEstadoProducto.js'
import { EliminarProducto } from '../application/productos/EliminarProducto.js'

export function buildContainer(overrides = {}) {
  const ventaRepository = overrides.ventaRepository ?? new InMemoryVentaRepository()
  const catalogoClientes = overrides.catalogoClientes ?? new InMemoryCatalogoClientes()
  const catalogoProductos = overrides.catalogoProductos ?? new InMemoryCatalogoProductos()
  const productoRepository = overrides.productoRepository ?? new ProductoRepositoryInMemory()

  return {
    ventas: {
      listarVentas: new ListarVentas({ ventaRepository }),
      obtenerVenta: new ObtenerVenta({ ventaRepository }),
      crearVenta: new CrearVenta({ ventaRepository, catalogoClientes, catalogoProductos }),
      cambiarEstadoVenta: new CambiarEstadoVenta({ ventaRepository }),
      registrarAbono: new RegistrarAbono({ ventaRepository }),
    },
    productos: {
      listarProductos: new ListarProductos({ productoRepository }),
      crearProducto: new CrearProducto({ productoRepository }),
      actualizarProducto: new ActualizarProducto({ productoRepository }),
      cambiarEstadoProducto: new CambiarEstadoProducto({ productoRepository }),
      eliminarProducto: new EliminarProducto({ productoRepository }),
    },
    catalogoClientes,
    catalogoProductos,
  }
}

