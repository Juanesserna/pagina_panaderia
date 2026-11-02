// Composition root: único lugar donde se conectan implementaciones concretas con casos de uso.
import { InMemoryVentaRepository } from '../infrastructure/ventas/InMemoryVentaRepository.js'
import { InMemoryCatalogoClientes, InMemoryCatalogoProductos } from '../infrastructure/catalogos/InMemoryCatalogos.js'
import { ProductoRepositoryInMemory } from '../infrastructure/catalogos/productoRepositoryInMemory.js'
import { InMemoryUsuarioRepository } from '../infrastructure/auth/InMemoryUsuarioRepository.js'
import { JwtTokenService } from '../infrastructure/auth/JwtTokenService.js'

import { ListarVentas } from '../application/ventas/ListarVentas.js'
import { ObtenerVenta } from '../application/ventas/ObtenerVenta.js'
import { CrearVenta } from '../application/ventas/CrearVenta.js'
import { CambiarEstadoVenta } from '../application/ventas/CambiarEstadoVenta.js'
import { RegistrarAbono } from '../application/ventas/RegistrarAbono.js'

import { CrearProducto } from '../application/productos/CrearProducto.js'
import { ListarProductos } from '../application/productos/ListarProductos.js'

import { Login } from '../application/auth/Login.js'
import { config } from './config.js'

export async function buildContainer(overrides = {}) {
  const tokenService = overrides.tokenService ?? new JwtTokenService({
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
  })

  const usuarioRepository = overrides.usuarioRepository ?? await InMemoryUsuarioRepository.conAdminSemilla({
    email: config.SEED_ADMIN_EMAIL,
    password: config.SEED_ADMIN_PASSWORD,
  })

  const login = overrides.login ?? new Login({ usuarioRepository, tokenService })
  const auth = overrides.auth ?? { login }

  const ventaRepository = overrides.ventaRepository ?? new InMemoryVentaRepository()
  const catalogoClientes = overrides.catalogoClientes ?? new InMemoryCatalogoClientes()
  const catalogoProductos = overrides.catalogoProductos ?? new InMemoryCatalogoProductos()
  const productoRepository = overrides.productoRepository ?? new ProductoRepositoryInMemory()

  const productos = overrides.productos ?? {
    crearProducto: new CrearProducto({ productoRepository }),
    listarProductos: new ListarProductos({ productoRepository }),
  }

  const ventas = overrides.ventas ?? {
    listarVentas: new ListarVentas({ ventaRepository }),
    obtenerVenta: new ObtenerVenta({ ventaRepository }),
    crearVenta: new CrearVenta({ ventaRepository, catalogoClientes, catalogoProductos }),
    cambiarEstadoVenta: new CambiarEstadoVenta({ ventaRepository }),
    registrarAbono: new RegistrarAbono({ ventaRepository }),
  }

  return {
    auth,
    tokenService,
    usuarioRepository,
    productos,
    ventas,
    catalogoClientes,
    catalogoProductos,
  }
}
