// Puertos: contratos que el dominio/aplicación necesitan; infrastructure los implementa.
//
// VentaRepository:   listar(): Venta[] · obtenerPorId(id): Venta|null · guardar(venta): void · siguienteId(): string
// CatalogoClientes:  buscarPorNit(nit): {nit, nombre}|null         (futuro: feature usuarios)
// CatalogoProductos: listar(): Producto[] · buscarPorNombre(nombre): {nombre, precio, stock}|null  (futuro: feature productos)
export {}
