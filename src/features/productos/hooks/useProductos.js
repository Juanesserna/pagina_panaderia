import { useState, useCallback } from 'react'
import { productos as mockProductos } from '../services/productos.service'

// Convierte los datos que entregan NuevoProductoModal/EditarProductoModal
// (stockActual, activo boolean, imagen) al formato real del objeto producto
// (stock, estado 'Activo'/'Agotado', imagenUrl).
function mapFormDataToProducto(datos) {
  return {
    id: datos.id,
    codigo: datos.codigo,
    nombre: datos.nombre,
    categoria: datos.categoria,
    precioVenta: datos.precioVenta,
    stock: datos.stockActual,
    estado: datos.activo ? 'Activo' : 'Agotado',
    imagenUrl: datos.imagen,
  }
}

export function useProductos() {
  const [productos, setProductos] = useState(mockProductos)

  const crearProducto = useCallback((datos) => {
    const nuevoProducto = mapFormDataToProducto({
      ...datos,
      id: datos.id ?? Date.now(),
      codigo: datos.codigo ?? `PR-${Math.floor(Math.random() * 900) + 100}`,
    })
    setProductos((prev) => [...prev, nuevoProducto])
    return nuevoProducto
  }, [])

  const editarProducto = useCallback((id, datos) => {
    const productoActualizado = mapFormDataToProducto({ ...datos, id, codigo: datos.codigo })
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productoActualizado } : p))
    )
  }, [])

  const eliminarProducto = useCallback((id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    productos,
    crearProducto,
    editarProducto,
    eliminarProducto,
  }
}
